import os
import shutil
import re

# Base workspace path
BASE_DIR = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e-waste-drop-point-and-recycling\e-waste-frontend"
SRC_DIR = os.path.join(BASE_DIR, "src")
DEPRECATED_DIR = os.path.join(BASE_DIR, "_deprecated")

# Admin mapping: old folder name inside src/Admin -> new folder path inside src/pages/admin
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

# User mapping: old folder name inside src/Component -> new folder path inside src/pages/user
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

# Build moves map
all_file_moves = {}

# User folders
user_base_old = os.path.join(SRC_DIR, "Component")
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
admin_base_old = os.path.join(SRC_DIR, "Admin")
for old_name, new_rel in admin_mapping.items():
    all_file_moves[os.path.join(admin_base_old, old_name)] = os.path.join(SRC_DIR, "pages", "admin", new_rel)

# Layout files
all_file_moves[os.path.join(SRC_DIR, "Component", "PublicLayout.jsx")] = os.path.join(SRC_DIR, "layouts", "PublicLayout.jsx")
all_file_moves[os.path.join(SRC_DIR, "Admin", "Layout", "AdminLayout.jsx")] = os.path.join(SRC_DIR, "layouts", "AdminLayout.jsx")

# Header & Footer
all_file_moves[os.path.join(SRC_DIR, "Component", "Header.js")] = os.path.join(SRC_DIR, "components", "Header.js")
all_file_moves[os.path.join(SRC_DIR, "Component", "Header.css")] = os.path.join(SRC_DIR, "components", "Header.css")
all_file_moves[os.path.join(SRC_DIR, "Component", "Footer.js")] = os.path.join(SRC_DIR, "components", "Footer.js")
all_file_moves[os.path.join(SRC_DIR, "Component", "Footer.css")] = os.path.join(SRC_DIR, "components", "Footer.css")

# CSS / Asset files
all_file_moves[os.path.join(SRC_DIR, "App.css")] = os.path.join(SRC_DIR, "assets", "styles", "App.css")
all_file_moves[os.path.join(SRC_DIR, "admin.css")] = os.path.join(SRC_DIR, "assets", "styles", "admin.css")
all_file_moves[os.path.join(SRC_DIR, "style.css")] = os.path.join(SRC_DIR, "assets", "styles", "style.css")
all_file_moves[os.path.join(SRC_DIR, "index.css")] = os.path.join(SRC_DIR, "assets", "styles", "index.css")
all_file_moves[os.path.join(SRC_DIR, "logo.svg")] = os.path.join(SRC_DIR, "assets", "images", "logo.svg")
all_file_moves[os.path.join(SRC_DIR, "ewaste_illustration.png")] = os.path.join(SRC_DIR, "assets", "images", "ewaste_illustration.png")

# API paths mapping
all_file_moves[os.path.join(SRC_DIR, "Component", "User-Interface-API")] = os.path.join(SRC_DIR, "services", "user-api")
all_file_moves[os.path.join(SRC_DIR, "Admin", "API")] = os.path.join(SRC_DIR, "services", "admin-api")

def setup_directories():
    print("Setting up directories...")
    os.makedirs(DEPRECATED_DIR, exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "context"), exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "hooks"), exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "utils"), exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "constants"), exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "routes"), exist_ok=True)
    
    # Assets subdirectories
    os.makedirs(os.path.join(SRC_DIR, "assets", "styles"), exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "assets", "images"), exist_ok=True)
    
    # Layout and Components
    os.makedirs(os.path.join(SRC_DIR, "layouts"), exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "components"), exist_ok=True)

    # Pages subdirectories
    os.makedirs(os.path.join(SRC_DIR, "pages", "user", "auth"), exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "pages", "user", "home"), exist_ok=True)
    os.makedirs(os.path.join(SRC_DIR, "pages", "user", "about"), exist_ok=True)
    
    for new_dir in admin_mapping.values():
        os.makedirs(os.path.join(SRC_DIR, "pages", "admin", os.path.dirname(new_dir)), exist_ok=True)
        
    for new_dir in user_mapping.values():
        os.makedirs(os.path.join(SRC_DIR, "pages", "user", os.path.dirname(new_dir)), exist_ok=True)

def centralize_api_services():
    print("Centralizing API services...")
    # Centralize User-Interface-API
    user_api_old = os.path.join(SRC_DIR, "Component", "User-Interface-API")
    user_api_new = os.path.join(SRC_DIR, "services", "user-api")
    if os.path.exists(user_api_old):
        print(f"Copying {user_api_old} -> {user_api_new}")
        shutil.copytree(user_api_old, user_api_new, dirs_exist_ok=True)
        
    # Centralize Admin API
    admin_api_old = os.path.join(SRC_DIR, "Admin", "API")
    admin_api_new = os.path.join(SRC_DIR, "services", "admin-api")
    if os.path.exists(admin_api_old):
        print(f"Copying {admin_api_old} -> {admin_api_new}")
        shutil.copytree(admin_api_old, admin_api_new, dirs_exist_ok=True)

def move_admin_files():
    print("Moving Admin files...")
    if not os.path.exists(admin_base_old):
        print("Admin base folder does not exist or already moved.")
        return
        
    for old_name, new_rel in admin_mapping.items():
        old_path = os.path.join(admin_base_old, old_name)
        new_path = os.path.join(SRC_DIR, "pages", "admin", new_rel)
        if os.path.exists(old_path):
            print(f"Moving {old_path} -> {new_path}")
            if os.path.exists(new_path):
                # Copy contents over
                for item in os.listdir(old_path):
                    s = os.path.join(old_path, item)
                    d = os.path.join(new_path, item)
                    if os.path.isdir(s):
                        shutil.copytree(s, d, dirs_exist_ok=True)
                    else:
                        shutil.copy2(s, d)
                shutil.rmtree(old_path)
            else:
                shutil.move(old_path, new_path)

    # Move Layout Layout folder contents if any remains
    layout_folder = os.path.join(admin_base_old, "Layout")
    if os.path.exists(layout_folder):
        admin_layout_old = os.path.join(layout_folder, "AdminLayout.jsx")
        if os.path.exists(admin_layout_old):
            print(f"Moving layout {admin_layout_old} to layouts/AdminLayout.jsx")
            shutil.move(admin_layout_old, os.path.join(SRC_DIR, "layouts", "AdminLayout.jsx"))
        shutil.rmtree(layout_folder)

    # Move Admin/Pages (unused interview manager) to deprecated
    unused_pages = os.path.join(admin_base_old, "Pages")
    if os.path.exists(unused_pages):
        print(f"Moving unused pages {unused_pages} to deprecated")
        shutil.move(unused_pages, os.path.join(DEPRECATED_DIR, "admin-pages-copy"))

    # Move E_Waste_Submission copy to deprecated
    submission_copy = os.path.join(admin_base_old, "E_Waste_Submission copy")
    if os.path.exists(submission_copy):
        shutil.move(submission_copy, os.path.join(DEPRECATED_DIR, "E_Waste_Submission copy"))

    # Clean duplicate API folder under admin
    admin_api = os.path.join(admin_base_old, "API")
    if os.path.exists(admin_api):
        print(f"Removing duplicate Admin/API: {admin_api}")
        shutil.rmtree(admin_api)

def move_user_files():
    print("Moving User files...")
    if not os.path.exists(user_base_old):
        print("User base folder does not exist or already moved.")
        return

    # Move folders mapped in user_mapping
    for old_name, new_rel in user_mapping.items():
        old_path = os.path.join(user_base_old, old_name)
        new_path = os.path.join(SRC_DIR, "pages", "user", new_rel)
        if os.path.exists(old_path):
            print(f"Moving {old_path} -> {new_path}")
            if os.path.exists(new_path):
                for item in os.listdir(old_path):
                    s = os.path.join(old_path, item)
                    d = os.path.join(new_path, item)
                    if os.path.isdir(s):
                        shutil.copytree(s, d, dirs_exist_ok=True)
                    else:
                        shutil.copy2(s, d)
                shutil.rmtree(old_path)
            else:
                shutil.move(old_path, new_path)

    # Move individual files
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
        old_file = os.path.join(user_base_old, filename)
        new_file = os.path.join(SRC_DIR, dest_rel)
        if os.path.exists(old_file):
            print(f"Moving file {old_file} -> {new_file}")
            shutil.move(old_file, new_file)

    # Move PublicLayout, Header and Footer to their locations
    public_layout_old = os.path.join(user_base_old, "PublicLayout.jsx")
    if os.path.exists(public_layout_old):
        shutil.move(public_layout_old, os.path.join(SRC_DIR, "layouts", "PublicLayout.jsx"))

    for item in ["Header.js", "Header.css", "Footer.js", "Footer.css"]:
        item_path = os.path.join(user_base_old, item)
        if os.path.exists(item_path):
            shutil.move(item_path, os.path.join(SRC_DIR, "components", item))

    # Move copy/legacy files to deprecated
    deprecated_files = {
        "About copy.js": "About copy.js",
        "Home copy.js": "Home copy.js",
        "E-Facility copy": "E-Facility copy",
        "test.js": "test.js",
    }
    for filename, dep_name in deprecated_files.items():
        old_file = os.path.join(user_base_old, filename)
        if os.path.exists(old_file):
            print(f"Moving deprecated file {old_file} -> {os.path.join(DEPRECATED_DIR, dep_name)}")
            if os.path.isdir(old_file):
                shutil.move(old_file, os.path.join(DEPRECATED_DIR, dep_name))
            else:
                shutil.move(old_file, os.path.join(DEPRECATED_DIR, dep_name))

    # Move user legacy component copy folder to deprecated
    user_legacy_base = os.path.join(SRC_DIR, "Component copy")
    if os.path.exists(user_legacy_base):
        print("Moving Component copy base to deprecated")
        shutil.move(user_legacy_base, os.path.join(DEPRECATED_DIR, "Component copy"))

    # Move backups folder to deprecated
    backups_folder = os.path.join(SRC_DIR, "backups")
    if os.path.exists(backups_folder):
        print(f"Moving backups folder to deprecated")
        shutil.move(backups_folder, os.path.join(DEPRECATED_DIR, "backups"))

    # Move specific utils files from components to src/utils
    education_scroll = os.path.join(SRC_DIR, "pages", "user", "education", "ScrollToTop.js")
    if os.path.exists(education_scroll):
        shutil.move(education_scroll, os.path.join(SRC_DIR, "utils", "scrollToTop.js"))

    education_test = os.path.join(SRC_DIR, "pages", "user", "education", "test.jsx")
    if os.path.exists(education_test):
        shutil.move(education_test, os.path.join(DEPRECATED_DIR, "test.jsx"))

    efacility_calc = os.path.join(SRC_DIR, "pages", "user", "e-facility", "calculateLocation.js")
    if os.path.exists(efacility_calc):
        shutil.move(efacility_calc, os.path.join(SRC_DIR, "utils", "calculateLocation.js"))

    efacility_get = os.path.join(SRC_DIR, "pages", "user", "e-facility", "getLocation.js")
    if os.path.exists(efacility_get):
        shutil.move(efacility_get, os.path.join(SRC_DIR, "utils", "getLocation.js"))

    # Delete duplicate/unused API folders under user base
    dup_api = os.path.join(user_base_old, "User-Interface-API")
    if os.path.exists(dup_api):
        shutil.rmtree(dup_api)

def move_global_assets():
    print("Moving global asset files...")
    for old, new in [
        (os.path.join(SRC_DIR, "App.css"), os.path.join(SRC_DIR, "assets", "styles", "App.css")),
        (os.path.join(SRC_DIR, "admin.css"), os.path.join(SRC_DIR, "assets", "styles", "admin.css")),
        (os.path.join(SRC_DIR, "style.css"), os.path.join(SRC_DIR, "assets", "styles", "style.css")),
        (os.path.join(SRC_DIR, "index.css"), os.path.join(SRC_DIR, "assets", "styles", "index.css")),
        (os.path.join(SRC_DIR, "logo.svg"), os.path.join(SRC_DIR, "assets", "images", "logo.svg")),
        (os.path.join(SRC_DIR, "ewaste_illustration.png"), os.path.join(SRC_DIR, "assets", "images", "ewaste_illustration.png")),
    ]:
        if os.path.exists(old):
            shutil.move(old, new)

    admin_copy_css = os.path.join(SRC_DIR, "admin copy.css")
    if os.path.exists(admin_copy_css):
        shutil.move(admin_copy_css, os.path.join(DEPRECATED_DIR, "admin copy.css"))

def cleanup_empty_bases():
    print("Cleaning up empty base directories...")
    if os.path.exists(admin_base_old) and not os.listdir(admin_base_old):
        os.rmdir(admin_base_old)
    if os.path.exists(user_base_old) and not os.listdir(user_base_old):
        os.rmdir(user_base_old)

def get_old_file_path(new_file_path):
    new_file_path_norm = os.path.normcase(new_file_path)
    for old, new in all_file_moves.items():
        new_norm = os.path.normcase(new)
        if new_file_path_norm == new_norm:
            return old
        if new_file_path_norm.startswith(new_norm + os.sep):
            rel = os.path.relpath(new_file_path_norm, new_norm)
            return os.path.normpath(os.path.join(old, rel))
    return new_file_path

def get_new_relative_import(file_path, old_import):
    if not old_import.startswith("."):
        return old_import
        
    old_file_path = get_old_file_path(file_path)
    old_dir = os.path.dirname(old_file_path)
    
    resolved_old_target = os.path.normpath(os.path.join(old_dir, old_import))
    resolved_old_target_norm = os.path.normcase(resolved_old_target)
    
    matched_new_target = None
    
    for old, new in all_file_moves.items():
        old_norm = os.path.normcase(old)
        
        # If the target file being moved is a CSS file, only match if the import itself ends with .css
        is_css_target = old_norm.endswith(".css")
        is_css_import = resolved_old_target_norm.endswith(".css") or old_import.endswith(".css")
        if is_css_target and not is_css_import:
            continue
            
        if resolved_old_target_norm == old_norm or resolved_old_target_norm + ".js" == old_norm or resolved_old_target_norm + ".jsx" == old_norm or resolved_old_target_norm + ".css" == old_norm:
            matched_new_target = new
            break
        if resolved_old_target_norm.startswith(old_norm + os.sep) or resolved_old_target_norm == old_norm:
            rel = os.path.relpath(resolved_old_target_norm, old_norm)
            new_val = os.path.normpath(os.path.join(new, rel))
            matched_new_target = new_val
            break

    # Reroute User API vs Admin API only if the target import is API_Service itself
    if resolved_old_target_norm.endswith("api_service") or resolved_old_target_norm.endswith("api_service.js"):
        if "user-interface-api" in resolved_old_target_norm:
            matched_new_target = os.path.join(SRC_DIR, "services", "user-api", "API_Service")
        elif "admin/api" in resolved_old_target_norm or "admin\\api" in resolved_old_target_norm:
            matched_new_target = os.path.join(SRC_DIR, "services", "admin-api", "API_Service")

    # Reroute ScrollToTop, calculateLocation, getLocation
    if resolved_old_target_norm.endswith("scrolltotop") or resolved_old_target_norm.endswith("scrolltotop.js"):
        matched_new_target = os.path.join(SRC_DIR, "utils", "scrollToTop")
    elif resolved_old_target_norm.endswith("calculatelocation") or resolved_old_target_norm.endswith("calculatelocation.js"):
        matched_new_target = os.path.join(SRC_DIR, "utils", "calculateLocation")
    elif resolved_old_target_norm.endswith("getlocation") or resolved_old_target_norm.endswith("getlocation.js"):
        matched_new_target = os.path.join(SRC_DIR, "utils", "getLocation")

    if matched_new_target:
        new_file_dir = os.path.dirname(file_path)
        new_rel_import = os.path.relpath(matched_new_target, new_file_dir)
        new_rel_import = new_rel_import.replace(os.sep, "/")
        
        if not new_rel_import.startswith("."):
            new_rel_import = "./" + new_rel_import
            
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
                
                # Replace app-level layout paths in layout and app files
                new_content = new_content.replace("./layouts/PublicLayout", "./layouts/PublicLayout")
                new_content = new_content.replace("./layouts/AdminLayout", "./layouts/AdminLayout")
                new_content = new_content.replace("./assets/styles/App.css", "./assets/styles/App.css")
                new_content = new_content.replace("./assets/styles/admin.css", "./assets/styles/admin.css")
                new_content = new_content.replace("./index.css", "./assets/styles/index.css")
                new_content = new_content.replace("./style.css", "./assets/styles/style.css")
                new_content = new_content.replace("./admin.css", "./assets/styles/admin.css")
                
                # PublicLayout mapping updates
                new_content = new_content.replace("../Component/E-Facility/", "../pages/user/e-facility/")
                new_content = new_content.replace("../Component/Contact-Us/", "../pages/user/contact-us/")
                new_content = new_content.replace("../Component/E-Waste/", "../pages/user/e-waste/")
                new_content = new_content.replace("../Component/Education/", "../pages/user/education/")
                new_content = new_content.replace("../Component/Recycling-info/", "../pages/user/recycling-info/")
                new_content = new_content.replace("../Component/Rewards/", "../pages/user/rewards/")
                new_content = new_content.replace("../Component/RewardCheckout/", "../pages/user/rewards-checkout/")
                new_content = new_content.replace("../Component/Rules/", "../pages/user/rules/")
                new_content = new_content.replace("../Component/Home", "../pages/user/home/Home")
                new_content = new_content.replace("../Component/About", "../pages/user/about/About")
                new_content = new_content.replace("../Component/Login", "../pages/user/auth/Login")
                new_content = new_content.replace("../Component/Sign-Up", "../pages/user/auth/Sign-Up")
                new_content = new_content.replace("../Component/Auth.css", "../pages/user/auth/Auth.css")
                new_content = new_content.replace("../Component/Rewards--copy/", "../pages/user/rewards-legacy/v1/")
                new_content = new_content.replace("../Component/Rewards copy/", "../pages/user/rewards-legacy/v2/")
                
                # AdminLayout mapping updates
                new_content = new_content.replace("../Admin/Register Users/Login", "../pages/admin/auth/register-users/Login")
                new_content = new_content.replace("../Admin/Register Users/Sign-Up", "../pages/admin/auth/register-users/Sign-Up")
                new_content = new_content.replace("../Admin/JWT Auto Check/Axios_Instance", "../pages/admin/auth/jwt-auto-check/Axios_Instance")
                new_content = new_content.replace("../Admin/Admin Panel Design/Header", "../pages/admin/shared/AdminHeader/Header")
                new_content = new_content.replace("../Admin/E-waste users/Users_2", "../pages/admin/users/users-list/Users_2")
                new_content = new_content.replace("../Admin/Home/Home_admin", "../pages/admin/dashboard/Home_admin")
                new_content = new_content.replace("../Admin/Pagination/Pagination", "../pages/admin/shared/Pagination/Pagination")
                
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

def fix_api_service_axios_imports():
    admin_api_service = os.path.join(SRC_DIR, "services", "admin-api", "API_Service.js")
    if os.path.exists(admin_api_service):
        with open(admin_api_service, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Axios_Instance resides in pages/admin/auth/jwt-auto-check/Axios_Instance
        new_import_path = "../../pages/admin/auth/jwt-auto-check/Axios_Instance"
        
        # Replace the old relative import "../JWT Auto Check/Axios_Instance"
        updated = re.sub(r'from [\'"]\.\./JWT Auto Check/Axios_Instance[\'"]', f'from "{new_import_path}"', content)
        if updated != content:
            with open(admin_api_service, "w", encoding="utf-8") as f:
                f.write(updated)
            print("Fixed Axios import in services/admin-api/API_Service.js")

if __name__ == "__main__":
    setup_directories()
    centralize_api_services()
    move_admin_files()
    move_user_files()
    move_global_assets()
    cleanup_empty_bases()
    update_all_imports()
    fix_api_service_axios_imports()
    print("restructure complete")
