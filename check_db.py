import os
import django
import sys

# Set up django environment
sys.path.append(r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e_waste_recycling")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_waste_recycling.settings")
django.setup()

from django.db import connection

tables = connection.introspection.table_names()
print("Tables in database:", tables)

needed_tables = ["reward_cart", "reward_cart_items"]
for table in needed_tables:
    if table in tables:
        print(f"Table '{table}' EXISTS.")
    else:
        print(f"Table '{table}' MISSING.")
