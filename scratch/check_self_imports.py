import os
import re

BASE_DIR = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e-waste-drop-point-and-recycling\e-waste-frontend"
SRC_DIR = os.path.join(BASE_DIR, "src")

def audit_imports():
    import_regex = re.compile(r'(?:import|from|require)\s*[\'"]([^\'"]+)[\'"]')
    self_imports = []
    
    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith((".js", ".jsx")):
                file_path = os.path.join(root, file)
                
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                imports = import_regex.findall(content)
                file_dir = os.path.dirname(file_path)
                file_name_no_ext = os.path.splitext(file)[0]
                
                for imp in imports:
                    if imp.startswith("."):
                        # Resolve imported path
                        resolved_imp = os.path.normpath(os.path.join(file_dir, imp))
                        resolved_imp_no_ext = os.path.splitext(resolved_imp)[0]
                        file_path_no_ext = os.path.splitext(file_path)[0]
                        
                        if os.path.normcase(resolved_imp_no_ext) == os.path.normcase(file_path_no_ext):
                            self_imports.append((file_path, imp))
                            
    if self_imports:
        print("Found self imports:")
        for f, imp in self_imports:
            print(f"File: {f} imports itself as: {imp}")
    else:
        print("No self imports found.")

if __name__ == "__main__":
    audit_imports()
