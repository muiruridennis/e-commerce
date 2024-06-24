import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

export const POST = async (request) => {
  console.log(request)
//   try {
//     const { name, email, message } = await request.json();
//     // Configure nodemailer
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: 'info@techheavens.com',
//       subject: 'New Contact Submission',
//       text: `You have a new contact submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);
// console.log("email sent")
//     // return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     // return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
//   }
}
