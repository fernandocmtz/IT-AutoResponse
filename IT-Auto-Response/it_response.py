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

def disabled_account_case(today):
    """Create description and resolution for disabled account case."""
    last_semester = input("When was the last semester the client attended STC? (e.g., Fall 2020, Spring 2023): ")
    description = f"The client is requesting support because they have a disabled account. The client is not a student since 2022 but has a current application for this semester. The last semester the client attended was {last_semester}."
    fcm_number = generate_fcm_number(today)
    resolution = f"{fcm_number}: Verified client information. Re-enabled account. Assisted client in resetting password online. Verified client could sign in. Registered the two sign-in methods on the MyPassword Assistant."
    return description, resolution

def password_reset_email_case(today):
    """Create description and resolution for password reset email case."""
    email_date = input("When was the email sent? (MM/DD/YY): ")
    email_time = input("At what time was the email sent? (HH:MM): ")
    description = f"Client sent an email on {email_date} at {email_time} requesting support with a password reset."
    fcm_number = generate_fcm_number(today)
    resolution = f"{fcm_number}: Client received password reset auto-response and our contact information."
    return description, resolution

def main():
    # First run asks for today's date
    today_str = input("Enter today's date (MM/DD/YY): ")
    today = datetime.datetime.strptime(today_str, "%m/%d/%y")
    
    while True:
        # Ask for the type of ticket
        print("\nPlease select the type of ticket:")
        print("1. Password Reset")
        print("2. Disabled Account")
        print("3. Compromised Account")
        print("4. Password Reset Email")
        ticket_type = input("Enter the number corresponding to the ticket type: ")
        
        if ticket_type == '1':
            expiry_date = input("When did the account expire? (MM/DD/YY): ")
            description, resolution = password_reset_case(expiry_date, today)
        elif ticket_type == '2':
            description, resolution = disabled_account_case(today)
        elif ticket_type == '4':
            description, resolution = password_reset_email_case(today)
        else:
            print("This ticket type is not yet implemented.")
            continue
        
        print("\nDescription:\n", description)
        print("\nResolution:\n", resolution)
        
        # Ask if they want to continue
        continue_request = input("Do you want to handle another request? (yes/no): ").lower()
        if continue_request != 'yes':
            break

if __name__ == "__main__":
    main()
