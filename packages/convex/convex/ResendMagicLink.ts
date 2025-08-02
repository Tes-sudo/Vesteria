import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";

export const ResendMagicLink = Resend({
  id: "resend-magic-link",
  apiKey: process.env.AUTH_RESEND_KEY!,
  async sendVerificationRequest({ identifier: email, provider, url, theme }) {
    const resend = new ResendAPI(provider.apiKey);
    
    // For React Native, we need to handle the redirect properly
    const magicLinkUrl = new URL(url);
    magicLinkUrl.searchParams.set("mobile", "true");
    
    const { error } = await resend.emails.send({
      from: "ConvexMobile <noreply@yourdomain.com>",
      to: [email],
      subject: "Sign in to ConvexMobile",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to ConvexMobile</h2>
          <p>Click the link below to sign in:</p>
          <a href="${magicLinkUrl.toString()}" 
             style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
            Sign In
          </a>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error("Could not send magic link");
    }
  },
});