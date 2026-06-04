import os
import django
import sys
from rest_framework.test import APIClient
from django.contrib.auth.models import User

# Set up django environment
sys.path.append(r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e_waste_recycling")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_waste_recycling.settings")
django.setup()

client = APIClient()
# Try to get the user 'khushal' or any user
user = User.objects.first()
if not user:
    print("No user found")
    sys.exit(1)

print(f"Testing API for user: {user.username}")
client.force_authenticate(user=user)

try:
    response = client.get("/User-api/cart/")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 500:
        print("Response Content:", response.content.decode())
    else:
        print("Response Data:", response.data)
except Exception as e:
    print("Exception occurred:", str(e))
    import traceback
    traceback.print_exc()
