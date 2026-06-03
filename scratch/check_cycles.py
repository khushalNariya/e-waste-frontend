import os
import re

BASE_DIR = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e-waste-drop-point-and-recycling\e-waste-frontend"
SRC_DIR = os.path.join(BASE_DIR, "src")

def get_imports(file_path):
    import_regex = re.compile(r'(?:import|from|require)\s*[\'"]([^\'"]+)[\'"]')
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    imports = import_regex.findall(content)
    file_dir = os.path.dirname(file_path)
    resolved = []
    for imp in imports:
        if imp.startswith(".") and not imp.endswith(".css"):
            target = os.path.normpath(os.path.join(file_dir, imp))
            resolved.append(target)
    return resolved

def find_cycles():
    graph = {}
    # Scan files
    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith((".js", ".jsx")):
                file_path = os.path.join(root, file)
                file_key = os.path.normcase(os.path.splitext(file_path)[0])
                
                # Get resolved imports
                targets = []
                for imp in get_imports(file_path):
                    # Check if file exists with .js or .jsx, or as a folder index
                    resolved_target = None
                    for ext in [".js", ".jsx", "/index.js", "/index.jsx"]:
                        test_path = imp + ext if not ext.startswith("/") else os.path.join(imp, ext[1:])
                        if os.path.exists(test_path):
                            resolved_target = test_path
                            break
                    if not resolved_target and os.path.exists(imp):
                        resolved_target = imp
                        
                    if resolved_target:
                        targets.append(os.path.normcase(os.path.splitext(resolved_target)[0]))
                
                graph[file_key] = targets
                
    # Detect cycles using DFS
    visited = {}
    path = []
    cycles = []
    
    def dfs(node):
        visited[node] = 1 # visiting
        path.append(node)
        
        for neighbor in graph.get(node, []):
            if visited.get(neighbor, 0) == 1:
                # Cycle found!
                cycle_start_idx = path.index(neighbor)
                cycles.append(path[cycle_start_idx:] + [neighbor])
            elif visited.get(neighbor, 0) == 0:
                dfs(neighbor)
                
        path.pop()
        visited[node] = 2 # visited
        
    for node in graph:
        if visited.get(node, 0) == 0:
            dfs(node)
            
    if cycles:
        print(f"Found {len(cycles)} dependency cycles:")
        for c in cycles:
            print(" -> ".join([os.path.basename(p) for p in c]))
    else:
        print("No dependency cycles found.")

if __name__ == "__main__":
    find_cycles()
