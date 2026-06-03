import os
import re

BASE_DIR = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e-waste-drop-point-and-recycling\e-waste-frontend"
SRC_DIR = os.path.join(BASE_DIR, "src")

def resolve_exact_casing(path):
    """
    Given a path, returns the exact case-sensitive path as it exists on disk,
    or None if it doesn't exist at all.
    """
    actual_path = None
    if os.path.exists(path):
        actual_path = path
    else:
        for ext in [".js", ".jsx", ".css", "/index.js", "/index.jsx"]:
            test_path = path + ext if not ext.startswith("/") else os.path.join(path, ext[1:])
            if os.path.exists(test_path):
                actual_path = test_path
                break

    if not actual_path:
        return None

    # Walk up the path and match casing of each segment
    parts = []
    curr = os.path.abspath(actual_path)
    while True:
        parent, child = os.path.split(curr)
        if not child:
            if parent:
                parts.append(parent)
            break
        # Find exact case of child in parent directory
        if os.path.exists(parent):
            matched = False
            for name in os.listdir(parent):
                if name.lower() == child.lower():
                    parts.append(name)
                    matched = True
                    break
            if not matched:
                parts.append(child)
        else:
            parts.append(child)
        curr = parent
        
    parts.reverse()
    # Join parts (handle drive letter on Windows)
    if len(parts) > 1 and parts[0].endswith(":") or parts[0] == "\\":
        resolved_path = parts[0] + os.sep + os.path.join(*parts[1:])
    else:
        resolved_path = os.path.join(*parts)
    return os.path.normpath(resolved_path)

def fix_imports():
    import_regex = re.compile(r'((?:import|from|require|import\s*\()\s*[\'"])([^\'"]+)([\'"]\s*\)?)')
    fixed_count = 0

    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith((".js", ".jsx", ".css")):
                file_path = os.path.join(root, file)
                
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                file_dir = os.path.dirname(file_path)
                
                def replace_casing(m):
                    nonlocal fixed_count
                    prefix = m.group(1)
                    imp_path = m.group(2)
                    suffix = m.group(3)
                    
                    if not imp_path.startswith("."):
                        return m.group(0)
                        
                    # Resolve to absolute path
                    target_abs = os.path.normpath(os.path.join(file_dir, imp_path))
                    exact_abs = resolve_exact_casing(target_abs)
                    
                    if exact_abs:
                        # Make relative again
                        rel_path = os.path.relpath(exact_abs, file_dir)
                        rel_path = rel_path.replace(os.sep, "/")
                        if not rel_path.startswith("."):
                            rel_path = "./" + rel_path
                            
                        # Preserve extension presence
                        old_ext = os.path.splitext(imp_path)[1]
                        new_ext = os.path.splitext(rel_path)[1]
                        if not old_ext and new_ext in [".js", ".jsx", ".css"]:
                            rel_path = os.path.splitext(rel_path)[0]
                            
                        if rel_path != imp_path:
                            print(f"Fixed casing in {os.path.relpath(file_path, SRC_DIR)}:\n  '{imp_path}' -> '{rel_path}'")
                            fixed_count += 1
                            return f"{prefix}{rel_path}{suffix}"
                            
                    return m.group(0)

                new_content = import_regex.sub(replace_casing, new_content)
                
                if new_content != content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(new_content)

    print(f"Total imports fixed: {fixed_count}")

if __name__ == "__main__":
    fix_imports()
