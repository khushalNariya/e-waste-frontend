import os
import re

BASE_DIR = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e-waste-drop-point-and-recycling\e-waste-frontend"
SRC_DIR = os.path.join(BASE_DIR, "src")

def verify_imports():
    import_regex = re.compile(r'(?:import|from|require|import\s*\()\s*[\'"]([^\'"]+)[\'"]')
    broken_imports = []
    
    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith((".js", ".jsx", ".css")):
                file_path = os.path.join(root, file)
                
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                imports = import_regex.findall(content)
                file_dir = os.path.dirname(file_path)
                
                for imp in imports:
                    if imp.startswith("."):
                        # Resolve path
                        target = os.path.normpath(os.path.join(file_dir, imp))
                        
                        # Check extensions
                        resolved = False
                        # If target is CSS, check target or target.css
                        if imp.endswith(".css") or file.endswith(".css"):
                            for ext in ["", ".css"]:
                                if os.path.exists(target + ext):
                                    resolved = True
                                    break
                        else:
                            for ext in ["", ".js", ".jsx", ".css", "/index.js", "/index.jsx"]:
                                test_path = target + ext if not ext.startswith("/") else os.path.join(target, ext[1:])
                                if os.path.exists(test_path):
                                    resolved = True
                                    break
                                    
                        if not resolved:
                            # Let's check case-insensitive match to see if it's just a casing issue
                            parent_dir = os.path.dirname(target)
                            base_name = os.path.basename(target)
                            case_issue = False
                            if os.path.exists(parent_dir):
                                for name in os.listdir(parent_dir):
                                    name_no_ext = os.path.splitext(name)[0]
                                    if name.lower() == base_name.lower() or name_no_ext.lower() == base_name.lower():
                                        case_issue = True
                                        break
                            
                            broken_imports.append((file_path, imp, case_issue))
                            
    if broken_imports:
        print(f"Found {len(broken_imports)} broken or suspicious imports:")
        for f, imp, case_issue in broken_imports:
            status = "Casing issue" if case_issue else "Not found"
            print(f"File: {os.path.relpath(f, SRC_DIR)}\n  Import: {imp} ({status})\n")
    else:
        print("All relative imports resolved successfully.")

if __name__ == "__main__":
    verify_imports()
