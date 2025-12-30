export default async function handler(request, response) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, subject, message } = await request.json();

    // Validate data
    if (!name || !email || !subject || !message) {
      response.status(400).json({ success: false, message: 'All fields required' });
      return;
    }

    // Test env vars
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      response.status(500).json({ success: false, message: 'Email config missing' });
      return;
    }

    const nodemailer = (await import('nodemailer')).default;
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio: ${subject}`,
      html: `
        <h3>New Message from Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    });

    response.status(200).json({ success: true, message: 'Email sent!' });
    
  } catch (error) {
    console.error('Email error:', error);
    response.status(500).json({ success: false, message: 'Server error' });
  }
}
