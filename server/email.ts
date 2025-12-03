import nodemailer from "nodemailer";

// --- PART A: THE POSTMAN (The Transporter) ---
// This section sets up the connection to Gmail.
// It acts like the truck driver who will carry the letter.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // We don't type your real password here for security.
    // Instead, we use "process.env" variables.
    // These variables will grab the password from your .env file later.
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- PART B: THE INSTRUCTION (The Function) ---
// This is a "tool" we are building. Any time another part of your app
// (like the Approval button) needs to send an email, it will call this function.
export async function sendLoginDetails(
  toEmail: string,
  name: string,
  userId: string,
  password: string
) {
  // 1. Write the Letter
  const mailOptions = {
    from: '"Al-Furqan Portal" <process.env.EMAIL_USER>', // Who is sending it?
    to: toEmail, // Who is receiving it?
    subject: "Application Approved - Login Details", // The Email Subject

    // 2. Design the Email (HTML)
    // This is the actual design the student will see in their inbox.
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #d90429;">Welcome to Al-Furqan Group of Schools</h2>
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>We are pleased to inform you that your application has been <strong>APPROVED</strong>.</p>
        <p>You can now log in to the school portal using the credentials below:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>👤 User ID:</strong> ${userId}</p>
          <p style="margin: 5px 0;"><strong>🔑 Password:</strong> ${password}</p>
          <p style="margin: 10px 0;">
            <a href="http://localhost:5000/login" style="background-color: #d90429; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Login to Portal</a>
          </p>
        </div>

        <p>Please keep these details safe.</p>
        <p>Best regards,<br>The Admin Team</p>
      </div>
    `,
  };

  // 3. Send the Letter
  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to " + toEmail);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
}
