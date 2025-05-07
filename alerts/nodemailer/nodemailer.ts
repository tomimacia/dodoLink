import { mailsForNotification } from '@/data/data';
import nodemailer from 'nodemailer';
const user = process.env.NEXT_PUBLIC_NODEMAILER_USER || 'dodoLink25@gmail.com';
const pass = process.env.NEXT_PUBLIC_NODEMAILER_PASSWORD;
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass,
  },
});

export const mailOptions = {
  from: user,
  to: [...mailsForNotification, user],
};
