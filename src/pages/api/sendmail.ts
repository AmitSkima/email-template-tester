import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";
import * as Yup from "yup";

export const sendMailApiValidationSchema = Yup.object({
  toEmail: Yup.string()
    .email("Invalid mail:to email")
    .required("Email required"),
  name: Yup.string().required("Name required"),
  subject: Yup.string().required("Subject required"),
  html: Yup.string().required("Html required"),
});

export type MailRequestBody = Yup.InferType<typeof sendMailApiValidationSchema>;
export type MailResponse = {
  status: number;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    if (method !== "POST") {
      res.status(400).json({
        status: 400,
        message: `[${method}] is not allowed`,
      });
      return;
    }

    const body: MailRequestBody = req.body;

    try {
      await sendMailApiValidationSchema.validate(body, { abortEarly: false });
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        res.status(422).json({
          status: 422,
          message: validationError.errors[0],
        });
      } else {
        res.status(500).json({
          status: 500,
          message: "Inernal Serve Error",
        });
      }
      return;
    }

    const response = await sendMail(body);
    res.status(response.status).send(response);
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  }
};

export default handler;

const sendMail = async (body: MailRequestBody): Promise<MailResponse> => {
  const USER = process.env.NODEMAILER_USER;
  const PASS = process.env.NODEMAILER_PASS;

  if (!USER && !PASS) {
    return new Promise((_, reject) =>
      reject({ status: 500, message: "Internal Server Error" })
    );
  }

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: USER,
      pass: PASS,
    },
  });

  const mailOptions = {
    from: USER,
    to: body.toEmail,
    subject: body.subject,
    html: body.html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        reject({ status: 500, message: "Failed to send mail" });
      } else {
        resolve({ status: 200, message: "Mail sent successfully" });
      }
    });
  });
};
