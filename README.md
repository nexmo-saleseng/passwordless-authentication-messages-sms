# Passwordless Authentication

## Intro

This is a passwordless authentication demo built upon Nexmo Messages API and AWS Serverless components.

The user types his mobile number and receives an URL to begin the authetication process.
The webpage displays an unique code (4 digits), the user sends the code via SMS for authentication

![User flow](http://nexmo-demo-passwordless-auth.s3-website.eu-west-2.amazonaws.com/assets/images/passwordlessauth.png)

## Usage

#### Use Website

The demo is hosted here: [website](http://nexmo-demo-passwordless-auth.s3-website.eu-west-2.amazonaws.com)

The user types his mobile number in the webpage. The webpage sends a request to a Lambda function. The Lambda function is responsible for saving the item in DynamoDB and sending the SMS using Nexmo Messages API:

![User flow 2](http://nexmo-demo-passwordless-auth.s3-website.eu-west-2.amazonaws.com/assets/images/passwordlessauth-Page-3.png)

Once the user receives the authentication link, he will sends the unique code back via SMS. Using the Nexmo Inbound webhook for SMS, a Lambda function is called. The function will check the recipient and the text.
If the credentials are correct, the user is authenticated.


![User flow 3](http://nexmo-demo-passwordless-auth.s3-website.eu-west-2.amazonaws.com/assets/images/passwordlessauth-Page-2.png)

