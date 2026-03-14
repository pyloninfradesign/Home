import "server-only"; // CRITICAL: Ensures this code never leaks to the browser
import { Resend } from 'resend';

export interface ContactLeadInput {
  name?: string;
  email?: string;
  subject: string;
  message: string;
  phone?: string;
  source?: string;
}

// Fixed email address
const CONTACT_EMAIL = 'info_pyloninfra@protonmail.com';

export async function deliverContactLead(formData: ContactLeadInput) {
  // 1. Check for the key inside the function to avoid global scope leaks
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing from environment variables.");
    return {
      success: false,
      error: 'Email service not configured.',
    };
  }

  try {
    const resend = new Resend(apiKey);
    const name = formData.name?.trim() || 'Chat visitor';
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const sourceLabel = formData.source ? `<p><strong>Source:</strong> ${formData.source}</p>` : '';

    const response = await resend.emails.send({
      // NOTE: Ensure your Resend account is allowed to send to CONTACT_EMAIL
      // if you are using the onboarding@resend.dev address.
      from: 'onboarding@resend.dev',
      to: CONTACT_EMAIL,
      ...(email ? { replyTo: email } : {}),
      subject: `New Contact Form: ${formData.subject}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
          ${sourceLabel}
          <p><strong>Name:</strong> ${name}</p>
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Project Type:</strong> ${formData.subject}</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>
        </div>
      `,
    });

    if (response.error) {
      console.error("Resend API Error:", response.error);
      throw new Error(response.error.message || 'Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error("Contact form delivery failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send email. Please try again later.',
    };
  }
}