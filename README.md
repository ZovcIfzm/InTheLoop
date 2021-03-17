## Running the project

To run the project you will need a Twilio account and a Twilio phone number that can send SMS messages. Gather your Twilio Account Sid and Auth Token from the [Twilio console](https://www.twilio.com/console) and the phone number. Similarly you will need a GroupMe access token.


Copy the `.env.example` file to `.env` and fill in your Twilio credentials and phone number.  
In the src directory, create a env.js file and write export default GROUPME_ACCESS_TOKEN = <your access token>  

Then, install dependencies and run using

```bash
npm install  
npm run dev  
```

