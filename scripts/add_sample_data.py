import os
import django
from datetime import date, time

# Set up Django environment
import sys
sys.path.append(r"e:\All Project\E-Waste Drop Point And Recycling Incentive Platform\e_waste_recycling")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_waste_recycling.settings')
django.setup()

from app_10_E_Waste_Submissions.E_Waste_Submission__API__1.models import EWasteSubmission
from app_10_E_Waste_Submissions.E_Waste_Status_History__API__2.models import EWasteStatusHistory

def add_data():
    # Clear existing data to avoid duplicates
    EWasteStatusHistory.objects.all().delete()
    EWasteSubmission.objects.all().delete()

    # User 1 - First Submission
    s1 = EWasteSubmission.objects.create(
        submission_id="EWS-101",
        user_id=1,
        category="Mobile Devices",
        brand="Apple",
        model_name="iPhone 12",
        condition_type="Working",
        pickup_type="pickup",
        facility="Central Recycling Hub",
        address="123 Street, City",
        pickup_date="2026-04-15",
        pickup_time="10:00:00",
        phone_number="9876543210",
        current_status="Evaluated"
    )
    
    EWasteStatusHistory.objects.create(submission=s1, status_label="Requested", update_date="2026-04-15", update_time="10:30:00", remarks="Initial request")
    EWasteStatusHistory.objects.create(submission=s1, status_label="Picked Up", update_date="2026-04-16", update_time="14:15:00", remarks="Collected from doorstep")
    EWasteStatusHistory.objects.create(submission=s1, status_label="Evaluated", update_date="2026-04-17", update_time="11:00:00", remarks="Condition verified")

    # User 1 - Second Submission
    EWasteSubmission.objects.create(
        submission_id="EWS-102",
        user_id=1,
        category="IT Assets",
        brand="Dell",
        model_name="XPS 15",
        condition_type="Minor Damage",
        pickup_type="pickup",
        facility="North Collection Point",
        address="123 Street, City",
        pickup_date="2026-04-18",
        pickup_time="16:00:00",
        phone_number="9876543210",
        current_status="Requested"
    )

    # User 2 - Submission
    s3 = EWasteSubmission.objects.create(
        submission_id="EWS-103",
        user_id=2,
        category="Monitors",
        brand="HP",
        model_name="Z27",
        condition_type="Scrap",
        pickup_type="dropoff",
        facility="Central Recycling Hub",
        address="456 Avenue, City",
        pickup_date="2026-04-15",
        pickup_time="11:45:00",
        phone_number="9123456789",
        current_status="Picked Up"
    )
    
    EWasteStatusHistory.objects.create(submission=s3, status_label="Requested", update_date="2026-04-15", update_time="11:45:00", remarks="Dropped at facility")
    EWasteStatusHistory.objects.create(submission=s3, status_label="Picked Up", update_date="2026-04-17", update_time="09:00:00", remarks="Internal transfer")

    print("Sample data added successfully!")

if __name__ == "__main__":
    add_data()
