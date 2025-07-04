import { mailsForNotification } from '@/data/data';
import nodemailer from 'nodemailer';
const user = process.env.NODEMAILER_USER || 'dodoLink25@gmail.com';
const pass = process.env.NODEMAILER_PASSWORD;
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
