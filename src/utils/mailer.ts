import nodemailer from "nodemailer";
import prisma from "@/src/lib/prisma";
import crypto from "crypto";

interface MailProps {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: MailProps) => {
  try {
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    if (emailType === "VERIFY") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: expiry,
        },
      });
    }

    if (emailType === "RESET") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          resetToken: hashedToken,
          resetTokenExpiry: expiry,
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_PASSWORD!,
      },
    });

    const actionUrl =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verify-email?token=${rawToken}`
        : `${process.env.DOMAIN}/reset-password?token=${rawToken}`;

    const mailOptions = {
      from: `"Upahar Khatiwada" <upaharlol@gmail.com>`,
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your ClipGen AI account"
          : "Reset your ClipGen AI password",
      text: `Click the link to continue: ${actionUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>ClipGen AI</h2>
          <p>
            ${
              emailType === "VERIFY"
                ? "Thanks for signing up! Please verify your email."
                : "You requested a password reset."
            }
          </p>
          <p>
            <a href="${actionUrl}" style="padding:10px 16px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
              ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
            </a>
          </p>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return {
      status: "error",
      message: "Unable to send email. Please try again later.",
    };
  }
};
