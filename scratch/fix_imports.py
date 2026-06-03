import os
import re

# Base workspace path
BASE_DIR = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e-waste-drop-point-and-recycling\e-waste-frontend"
SRC_DIR = os.path.join(BASE_DIR, "src")

# Define target paths mappings (relative to SRC_DIR)
# Admin mapping: old folder name inside src/pages/admin/Admin -> new folder path inside src/pages/admin
admin_mapping = {
    "Register Users": "auth/register-users",
    "JWT Auto Check": "auth/jwt-auto-check",
    "Home": "dashboard",
    "Brands": "brands/brands-list",
    "Category - Brand - Mapping": "brands/category-brand-mapping",
    "Category_Brand_Wise_Model_Name": "brands/model-names",
    "E_Waste_Management": "e-waste/management",
    "E_Waste_Submission": "e-waste/submission",
    "E_Waste_Status_History": "e-waste/status-history",
    "Category -- Recycling Info": "e-waste/recycling-info",
    "Education-Admin": "e-waste/education",
    "Reward Condition": "rewards/conditions",
    "Reward Rules": "rewards/rules",
    "Reward_Category": "rewards/categories",
    "Reward_Product": "rewards/products",
    "Reward_Product_Images_All": "rewards/product-images",
    "Reward_Transactions": "rewards/transactions",
    "Reward_Cart": "rewards/cart",
    "Reward_Cart_Items": "rewards/cart-items",
    "Reward_Orders": "rewards/orders",
    "Reward_Order_Items": "rewards/order-items",
    "Reward_Order_Address": "rewards/order-addresses",
    "Reward_Order_Payment": "rewards/order-payments",
    "Reward_Order_Status_History": "rewards/order-status-history",
    "Reward_Return_Request": "rewards/returns",
    "Reward_Return_Items": "rewards/return-items",
    "Reward_Return_Pickups": "rewards/return-pickups",
    "Reward_Return_Status_History": "rewards/return-status-history",
    "Reward_Replace_Request": "rewards/replacements",
    "Reward_Replace_Items": "rewards/replacement-items",
    "Reward_Replace_Pickups": "rewards/replacement-pickups",
    "Reward_Replace_Status_History": "rewards/replacement-status-history",
    "E-waste users": "users/users-list",
    "User_Wallet": "users/user-wallets",
    "Admin Panel Design": "shared/AdminHeader",
    "Pagination": "shared/Pagination",
    "Filter_Component": "shared/FilterComponent",
    "Common Files": "shared/common",
    "Components": "shared/components",
    "Layout": "shared/layout",
    "Styles": "shared/styles",
}

# User mapping: old folder name inside src/pages/user/Component -> new folder path inside src/pages/user
user_mapping = {
    "Contact-Us": "contact-us",
    "E-Facility": "e-facility",
    "E-Waste": "e-waste",
    "Education": "education",
    "Recycling-info": "recycling-info",
    "Rewards": "rewards",
    "RewardCheckout": "rewards-checkout",
    "Rules": "rules",
    "Rewards--copy": "rewards-legacy/v1",
    "Rewards copy": "rewards-legacy/v2"
}

# Map old paths to new paths of moved files/directories
all_file_moves = {}

# User folders
user_base_old = os.path.join(SRC_DIR, "pages", "user", "Component")
for old_name, new_rel in user_mapping.items():
    all_file_moves[os.path.join(user_base_old, old_name)] = os.path.join(SRC_DIR, "pages", "user", new_rel)

# User files
files_to_move = {
    "About.js": "pages/user/about/About.js",
    "About.css": "pages/user/about/About.css",
    "Home.js": "pages/user/home/Home.js",
    "Home.css": "pages/user/home/Home.css",
    "Login.js": "pages/user/auth/Login.js",
    "Sign-Up.js": "pages/user/auth/Sign-Up.js",
    "Auth.css": "pages/user/auth/Auth.css",
}
for filename, dest_rel in files_to_move.items():
    all_file_moves[os.path.join(user_base_old, filename)] = os.path.join(SRC_DIR, dest_rel)

# Admin folders
admin_base_old = os.path.join(SRC_DIR, "pages", "admin", "Admin")
for old_name, new_rel in admin_mapping.items():
    all_file_moves[os.path.join(admin_base_old, old_name)] = os.path.join(SRC_DIR, "pages", "admin", new_rel)


def get_old_file_path(new_file_path):
    new_file_path_norm = os.path.normcase(new_file_path)
    # Find which moved folder this new file is inside of
    for old, new in all_file_moves.items():
        new_norm = os.path.normcase(new)
        old_norm = os.path.normcase(old)
        if new_file_path_norm == new_norm:
            return old
        if new_file_path_norm.startswith(new_norm + os.sep):
            rel = os.path.relpath(new_file_path_norm, new_norm)
            return os.path.normpath(os.path.join(old, rel))
    return new_file_path


def get_new_relative_import(file_path, old_import):
    # If it is a relative import, resolve its target
    if not old_import.startswith("."):
        return old_import # Absolute/third party import
        
    # Get current file old location
    old_file_path = get_old_file_path(file_path)
    old_dir = os.path.dirname(old_file_path)
    
    # Resolve old import to an absolute-like path inside workspace
    resolved_old_target = os.path.normpath(os.path.join(old_dir, old_import))
    resolved_old_target_norm = os.path.normcase(resolved_old_target)
    
    # Find matching new path of the target
    matched_new_target = None
    
    for old, new in all_file_moves.items():
        old_norm = os.path.normcase(old)
        new_norm = os.path.normcase(new)
        
        if resolved_old_target_norm == old_norm or resolved_old_target_norm + ".js" == old_norm or resolved_old_target_norm + ".jsx" == old_norm or resolved_old_target_norm + ".css" == old_norm:
            matched_new_target = new
            break
        if resolved_old_target_norm.startswith(old_norm + os.sep) or resolved_old_target_norm == old_norm:
            # Sibling/child of a folder that was moved
            rel = os.path.relpath(resolved_old_target_norm, old_norm)
            new_val = os.path.normpath(os.path.join(new, rel))
            matched_new_target = new_val
            break

    # Reroute Admin/API/API_Service to services/admin-api/API_Service
    if "admin/api/api_service" in resolved_old_target_norm or "admin\\api\\api_service" in resolved_old_target_norm or resolved_old_target_norm.endswith("api/api_service") or resolved_old_target_norm.endswith("api\\api_service"):
        matched_new_target = os.path.join(SRC_DIR, "services", "admin-api", "API_Service")

    # Reroute ScrollToTop, calculateLocation, getLocation
    if resolved_old_target_norm.endswith("scrolltotop") or resolved_old_target_norm.endswith("scrolltotop.js"):
        matched_new_target = os.path.join(SRC_DIR, "utils", "scrollToTop")
    elif resolved_old_target_norm.endswith("calculatelocation") or resolved_old_target_norm.endswith("calculatelocation.js"):
        matched_new_target = os.path.join(SRC_DIR, "utils", "calculateLocation")
    elif resolved_old_target_norm.endswith("getlocation") or resolved_old_target_norm.endswith("getlocation.js"):
        matched_new_target = os.path.join(SRC_DIR, "utils", "getLocation")

    if matched_new_target:
        # Calculate new relative path from the new file path directory
        new_file_dir = os.path.dirname(file_path)
        new_rel_import = os.path.relpath(matched_new_target, new_file_dir)
        new_rel_import = new_rel_import.replace(os.sep, "/")
        
        # Ensure it has leading ./ or ../
        if not new_rel_import.startswith("."):
            new_rel_import = "./" + new_rel_import
            
        # Keep original extension status
        old_ext = os.path.splitext(old_import)[1]
        new_ext = os.path.splitext(new_rel_import)[1]
        
        if not old_ext and new_ext in [".js", ".jsx", ".css"]:
            new_rel_import = os.path.splitext(new_rel_import)[0]
            
        return new_rel_import

    return old_import


def update_all_imports():
    import_regex = re.compile(r'((?:import|from|require|import\s*\()\s*[\'"])([^\'"]+)([\'"]\s*\)?)')
    
    print("Updating file imports...")
    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith((".js", ".jsx", ".css")):
                file_path = os.path.join(root, file)
                
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                
                # Replace layout relative/absolute paths
                new_content = new_content.replace("../pages/user/Component/E-Facility/", "../pages/user/e-facility/")
                new_content = new_content.replace("../pages/user/Component/Contact-Us/", "../pages/user/contact-us/")
                new_content = new_content.replace("../pages/user/Component/E-Waste/", "../pages/user/e-waste/")
                new_content = new_content.replace("../pages/user/Component/Education/", "../pages/user/education/")
                new_content = new_content.replace("../pages/user/Component/Recycling-info/", "../pages/user/recycling-info/")
                new_content = new_content.replace("../pages/user/Component/Rewards/", "../pages/user/rewards/")
                new_content = new_content.replace("../pages/user/Component/RewardCheckout/", "../pages/user/rewards-checkout/")
                new_content = new_content.replace("../pages/user/Component/Rules/", "../pages/user/rules/")
                new_content = new_content.replace("../pages/user/Component/Home", "../pages/user/home/Home")
                new_content = new_content.replace("../pages/user/Component/About", "../pages/user/about/About")
                new_content = new_content.replace("../pages/user/Component/Login", "../pages/user/auth/Login")
                new_content = new_content.replace("../pages/user/Component/Sign-Up", "../pages/user/auth/Sign-Up")
                new_content = new_content.replace("../pages/user/Component/Auth.css", "../pages/user/auth/Auth.css")
                new_content = new_content.replace("../pages/user/Component/Rewards--copy/", "../pages/user/rewards-legacy/v1/")
                new_content = new_content.replace("../pages/user/Component/Rewards copy/", "../pages/user/rewards-legacy/v2/")
                
                # AdminLayout mapping updates
                new_content = new_content.replace("../pages/admin/Admin/Register Users/Login", "../pages/admin/auth/register-users/Login")
                new_content = new_content.replace("../pages/admin/Admin/Register Users/Sign-Up", "../pages/admin/auth/register-users/Sign-Up")
                new_content = new_content.replace("../pages/admin/Admin/JWT Auto Check/Axios_Instance", "../pages/admin/auth/jwt-auto-check/Axios_Instance")
                new_content = new_content.replace("../pages/admin/Admin/Admin Panel Design/Header", "../pages/admin/shared/AdminHeader/Header")
                new_content = new_content.replace("../pages/admin/Admin/E-waste users/Users_2", "../pages/admin/users/users-list/Users_2")
                new_content = new_content.replace("../pages/admin/Admin/Home/Home_admin", "../pages/admin/dashboard/Home_admin")
                new_content = new_content.replace("../pages/admin/Admin/Pagination/Pagination", "../pages/admin/shared/Pagination/Pagination")
                
                # Run generic relative import replacement on the content
                def replace_match(m):
                    prefix = m.group(1)
                    path = m.group(2)
                    suffix = m.group(3)
                    new_path = get_new_relative_import(file_path, path)
                    return f"{prefix}{new_path}{suffix}"
                
                new_content = import_regex.sub(replace_match, new_content)
                
                if new_content != content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated imports in: {file_path}")


if __name__ == "__main__":
    update_all_imports()
    print("Fixing completed.")
