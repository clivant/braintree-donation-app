# BrainTree donation app

This repository showcase a demo donation app that allows the user to
send donations to a BrainTree sandbox account.

This application is adapted from [BrainTree Drop-in Tutorial](https://developers.braintreepayments.com/start/tutorial-drop-in-node).

## Running the app locally
- Clone this repository to your local machine.
- Ensure that you [NodeJs](https://nodejs.org/en/download/) running on your local machine.
- Change **<use_your_tokenization_key>** at line 148 of **javascripts/donation-app-client.js** to your tokenization key.
- Change  **<use_your_merchant_id>** at line 9 of **routes/checkout.js** to your merchantId.
- Change **<use_your_public_key>** at line 10 of **routes/checkout.js** to your public key.
- Change **<use_your_private_key>** at line 11 of **routes/checkout.js** to your private key.
- Start a terminal program and run **npm start** at the root directory of this project.
- Use your browser to access http://localhost:3000
