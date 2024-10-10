import datetime

def generate_fcm_number(date):
    """Generate FCM number based on today's date."""
    return f"FCM{date.strftime('%m%d%y')}"

def password_reset_case(expiry_date, today):
    """Create description and resolution for password reset case."""
    description = f"The client is requesting a password reset because they are not a student since {expiry_date} and are requesting to change the password."
    fcm_number = generate_fcm_number(today)
    resolution = f"{fcm_number}: Verified client information. Added phone number and personal email as MyPassword sign-in methods. Provide the MyPassword information to change the password under 'Forgot My Password' > 'Reset Password'."
    return description, resolution

def main():
    # First run asks for today's date
    today_str = input("Enter today's date (MM/DD/YY): ")
    today = datetime.datetime.strptime(today_str, "%m/%d/%y")
    
    while True:
        # Ask if it's a password reset case
        reset_case = input("Is this a password reset case? (yes/no): ").lower()
        
        if reset_case == 'yes':
            expiry_date = input("When did the account expire? (MM/DD/YY): ")
            description, resolution = password_reset_case(expiry_date, today)
            print("\nDescription:\n", description)
            print("\nResolution:\n", resolution)
        else:
            print("Currently only handling password reset cases.")
        
        # Ask if they want to continue
        continue_request = input("Do you want to handle another request? (yes/no): ").lower()
        if continue_request != 'yes':
            break

if __name__ == "__main__":
    main()
