# Passwordless Authentication

## Intro

This is a passwordless authentication demo built using Nexmo Messages API and AWS Serverless components.

The user flow of this demo is the following: 

1. The user types his mobile number
2. Receives an URL to begin the authetication process.
3. The webpage displays an unique code (4 digits)
4. User sends the code via SMS for authentication
5. API checks if the recipient and the code are correct and authenticate the user

Below an image explaining the user flow:

![User flow](./client/public/assets/images/passwordlessauth.png)

## Requirements

-  [Tokbox Account](https://tokbox.com/account/user/signup?icid=tryitfree_comm-apis_tokboxfreetrialsignup_btn)
-  [Nexmo Account](https://dashboard.nexmo.com/sign-up?icid=tryitfree_comm-apis_nexmodashbdfreetrialsignup_btn)
-  Serverless Framework

You can install the [Serverless](https://serverless.com/framework/docs/getting-started#installing-via-npm) framework directly from npm

```
# Install the serverless cli
npm install -g serverless

# Or, update the serverless cli from a previous version
npm update -g serverless

```

## Implementation

The project is composed by AWS Serverless components and Nexmo Messages API.

Firstly, the user types his mobile number in the Home webpage. The webpage sends a POST request to an API Gateway backed by a Lambda function. The Lambda function is responsible for saving the item in DynamoDB and sending the SMS using Nexmo Messages API:

![User flow 2](./client/public/assets/images/passwordlessauth-Page-3.png)

The item saved in Dynamo is composed by the authCode used in the login page, a random 4 digits code and the recipient number.

The user will receive an SMS with the login page personalized with the authCode. To complete the authentication, the user sends the unique code back via SMS. 

Using the Nexmo Inbound webhook for SMS, you can register an endpoint to invoke a function. In this case, a Lambda function is called. The function will check the recipient and the text.
If the credentials are correct, the user is authenticated.

![User flow 3](./client/public/assets/images/passwordlessauth-Page-2.png)

#### Limitations

Currently the demo doesn't handle expired codes or used codes.

