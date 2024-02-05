# Application to test email template

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛑 Important Note

1. **Do not push your Nodemailer pass on Github** as it can give access to your google email. Use `.env` file
2. Use [Nextjs api routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) for nodemailer transporters and send mail function as they only run on server and cannot expose your google app variables to client.
3. Only use port **`3000`**

## ✉️ Setup Nodemailer

### Create Nodemailer User and Password

1. Go to your Google Mail app or any other Google App.
2. Click on your `Profile`
3. Click on `Manage your Google Account`
4. Click on `2-Step Verification` under How you sign in Google
5. Under 2-Step Verification go to `App passwords`
6. Create an app (e.g., portfolio-nodemailer), and copy the generated password securely. Use it as the value for the `NODEMAILER_PASS` variable and your email as the value for `NODEMAILER_USER` variable in `.env` file. [Note: Passwords are not visible once closed; if forgotten, delete the old app and create a new one.]
