import os
import django
import sys
from rest_framework.test import APIClient
from django.contrib.auth.models import User

# Set up django environment
project_path = r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e_waste_recycling"
sys.path.append(project_path)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_waste_recycling.settings")
django.setup()

from app_12_Reward_Cart.Reward_Cart__API__1.models import Reward_Cart_Model
from app_12_Reward_Cart.Reward_Cart_Items__API__2.models import Reward_Cart_Items_Model

# Try to get the user
user = User.objects.first()
if not user:
    print("No user found")
    sys.exit(1)

print(f"Testing for user: {user.username}")

cart = Reward_Cart_Model.objects.filter(user=user, status="active").first()
if cart:
    print(f"Cart ID: {cart.id}")
    items = Reward_Cart_Items_Model.objects.filter(cart=cart)
    print(f"Number of items in cart: {items.count()}")
    for item in items:
        print(f"Item: {item.product.name}, Qty: {item.quantity}")
else:
    print("No active cart found for user.")

# Test serialization
from app_12_Reward_Cart.Reward_Cart__API__1.serializers import Reward_Cart_Serializer
if cart:
    try:
        serializer = Reward_Cart_Serializer(cart)
        data = serializer.data
        print("Serialization SUCCESSFUL")
        print("Data:", data)
    except Exception as e:
        print("Serialization FAILED")
        import traceback
        traceback.print_exc()
