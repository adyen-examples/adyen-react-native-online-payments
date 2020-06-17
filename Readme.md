## Customize the payment page created by [Pay by Link](https://docs.adyen.com/checkout/pay-by-link)

You can customize the payment form with your brand name, logo, and a background color.

1.Log in to your [Customer Area](https://ca-test.adyen.com/).
1.Select Account. Under Configure, select Pay by Link.
1.Select the web service user.
1.Add a display name, upload a brand logo, and set a background color.
1.You will receive a confirmation that the payment form has been updated.

## Setup

Set the correct `SERVER_URL` in `src/constants/General.js`, the IP must be that of the machine where you started the express backend server with `npm run server`. This is printed out as "Server started on wlp2s0 port http://192.168.2.42:8089". It will be the same IP used by Expo to run the application as well when you run `npm start`
