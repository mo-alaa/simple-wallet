# Simple-Wallet

This application aims to transfer money between users with their phone numbers.

# Stack

Frontend: React js.  
Backend: Express js.  
ORM: Prisma.  
Database: postgreSQL.   
Authentication: Jwt (with httpOnly).

# Future Improvements
- Verify phone number is legit for the corresponding country code.
- Add success and fail messages in the browser on user transactions.
- Database is already deployed successfully on Heroku, need to deploy the whole app.
- Disable the (SendMoney) button once the user clicked, to prevent unhandled transactions.
- Push notification to online users to update their available balance.
- Implement unit testing for the whole app.
- Remove logic from the backend's server.ts
