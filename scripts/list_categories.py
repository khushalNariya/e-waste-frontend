import os
import sys
import django

# Add backend dir to python path
backend_dir = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e_waste_recycling"
sys.path.append(backend_dir)
os.chdir(backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_waste_recycling.settings')
django.setup()

from app_9_Reward_Products.Reward_Category__API__1.models import Reward_Category_model

categories = Reward_Category_model.objects.all()
for cat in categories:
    print(f"ID: {cat.id} | Name: {cat.name}")
