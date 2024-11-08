const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const moment = require('moment');

function generateFcmNumber(date) {
    // Generate FCM number based on today's date.
    return `FCM${moment(date).format('MMDDYY')}`;
}

function passwordResetCase(expiryDate, today) {
    // Create description and resolution for password reset case.
    const description = `The client is requesting a password reset because the password expired since ${expiryDate} and is requesting to change it.`;
    const fcmNumber = generateFcmNumber(today);
    const resolution = `${fcmNumber}: Verified client information. Added phone number and personal email as MyPassword sign-in methods. Provide the MyPassword information to change the password under 'Forgot My Password' > 'Reset Password'.`;
    return { description, resolution };
}

function authenticationErrorCase(today) {
    // Create description and resolution for authentication error case.
    const description = `The client called to report that they are encountering an 'CAS Validation Failed' error when attempting to sign in to Jagnet.`;
    const fcmNumber = generateFcmNumber(today);
    const resolution = `${fcmNumber}: Verified client information. Informed client of username format for signing into Jagnet.`;
    const internalNotes = `Common reasons a client may receive an 'CAS Validation Failed' error include: Entering their STC email address in the 'username' field, Double-clicking the 'Enter' button to sign in, Browser cache needs to be cleared. If the client's password is not expired and you confirmed they are entering the correct information, advise them to clear the cache and cookies from their browser or try using a different browser or device.`;
    return { description, resolution, internalNotes };
}

function disabledAccountCase(today) {
    // Create description and resolution for disabled account case.
    return new Promise(resolve => {
        rl.question("When was the last semester the client attended STC? (e.g., Fall 2020, Spring 2023): ", lastSemester => {
            const description = `The client is requesting support because they have a disabled account. The last semester the client attended was ${lastSemester}, but has a recent cleared application for this semester.`;
            const fcmNumber = generateFcmNumber(today);
            const resolution = `${fcmNumber}: Verified client information. Re-enabled account. Assisted client in resetting password online. Verified client could sign in. Registered the two sign-in methods on the MyPassword Assistant.`;
            resolve({ description, resolution });
        });
    });
}

function passwordResetEmailCase(today) {
    // Create description and resolution for password reset email case.
    return new Promise(resolve => {
        rl.question("When was the email sent? (MM/DD/YY): ", emailDate => {
            rl.question("At what time was the email sent? (HH:MM): ", emailTime => {
                const description = `Client sent an email on ${emailDate} at ${emailTime} requesting support with a password reset.`;
                const fcmNumber = generateFcmNumber(today);
                const resolution = `${fcmNumber}: Client received password reset auto-response and our contact information.`;
                resolve({ description, resolution });
            });
        });
    });
}

function main() {
    rl.question("Enter today's date (MM/DD/YY): ", todayStr => {
        const today = moment(todayStr, "MM/DD/YY");

        const handleRequest = () => {
            console.log("\nPlease select the type of ticket:");
            console.log("1. Password Reset");
            console.log("2. Disabled Account");
            console.log("3. Compromised Account");
            console.log("4. Password Reset Email");
            console.log("5. Authentication Error");

            rl.question("Enter the number corresponding to the ticket type: ", async ticketType => {
                let description, resolution, internalNotes;

                switch (ticketType) {
                    case '1':
                        const expiryDate = await new Promise(resolve => rl.question("When did the account expire? (MM/DD/YY): ", resolve));
                        ({ description, resolution } = passwordResetCase(expiryDate, today));
                        break;
                    case '2':
                        ({ description, resolution } = await disabledAccountCase(today));
                        break;
                    case '5':
                        ({ description, resolution, internalNotes } = authenticationErrorCase(today));
                        console.log("\nInternal Notes:\n", internalNotes);
                        break;
                    default:
                        console.log("This ticket type is not yet implemented.");
                        handleRequest();
                        return;
                }

                console.log("\nDescription:\n", description);
                console.log("\nResolution:\n", resolution);

                rl.question("Do you want to handle another request? (yes/no): ", answer => {
                    if (answer.toLowerCase() === 'yes') {
                        handleRequest();
                    } else {
                        rl.close();
                    }
                });
            });
        };

        handleRequest();
    });
}

main();
