import os
import shutil
import subprocess

BASE_DIR = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e-waste-drop-point-and-recycling\e-waste-frontend"
SRC_DIR = os.path.join(BASE_DIR, "src")
DEPRECATED_DIR = os.path.join(BASE_DIR, "_deprecated")

def rollback():
    print("Running git checkout to restore files...")
    subprocess.run(["git", "checkout", "--", "src"], cwd=BASE_DIR, check=True)
    subprocess.run(["git", "checkout", "--", "package.json"], cwd=BASE_DIR, check=True)

    print("Cleaning up new directories...")
    for folder in ["pages", "layouts", "services", "utils", "components", "assets"]:
        path = os.path.join(SRC_DIR, folder)
        if os.path.exists(path):
            print(f"Removing {path}")
            shutil.rmtree(path)
            
    if os.path.exists(DEPRECATED_DIR):
        print(f"Removing {DEPRECATED_DIR}")
        shutil.rmtree(DEPRECATED_DIR)

    if os.path.exists(os.path.join(BASE_DIR, "build_output.log")):
        os.remove(os.path.join(BASE_DIR, "build_output.log"))

    print("Rollback complete!")

if __name__ == "__main__":
    rollback()
