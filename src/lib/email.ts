import { logger } from "@/lib/logger";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "EngSols <notifications@engsols.com>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email]", { to, subject });
    }
    return { ok: true, skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text();
    logger.error("email", "send failed", { response: text });
    return { ok: false, error: text };
  }

  return { ok: true };
}

export function bookingNotificationEmail(opts: {
  mentorName: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  type: string;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  return {
    subject: `New ${opts.type} request on EngSols`,
    html: `
      <p>You have a new mentorship request on EngSols.</p>
      <p><strong>${opts.requesterName}</strong> (${opts.requesterEmail})</p>
      <p>${opts.message}</p>
      <p><a href="${site}/mentor/bookings">View in your inbox</a></p>
    `,
  };
}

export function jobApplicationEmail(opts: {
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  message: string;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  return {
    subject: `New application for ${opts.jobTitle}`,
    html: `
      <p><strong>${opts.applicantName}</strong> (${opts.applicantEmail}) applied to <strong>${opts.jobTitle}</strong>.</p>
      <p>${opts.message}</p>
      <p><a href="${site}/jobs/inbox">View in your inbox</a></p>
    `,
  };
}

export function sellerApprovedEmail(opts: { sellerName: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  return {
    subject: "Your EngSols seller profile is live",
    html: `
      <p>Your seller profile <strong>${opts.sellerName}</strong> has been approved.</p>
      <p><a href="${site}/marketplace/sell">List your first product</a></p>
    `,
  };
}

export function bookingStatusEmail(opts: {
  studentName: string;
  mentorName: string;
  status: string;
  requestType: string;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  const statusLabel = opts.status === "contacted" ? "contacted you" : "closed your request";
  return {
    subject: `Booking update: ${opts.mentorName}`,
    html: `
      <p>Hi ${opts.studentName},</p>
      <p><strong>${opts.mentorName}</strong> has ${statusLabel} regarding your ${opts.requestType.replace(/_/g, " ")} request.</p>
      <p><a href="${site}/settings">View your bookings</a></p>
    `,
  };
}

export function forumReplyEmail(opts: { postTitle: string; replierName: string; postSlug: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  return {
    subject: `New reply on "${opts.postTitle}"`,
    html: `
      <p><strong>${opts.replierName}</strong> replied to your forum thread.</p>
      <p><a href="${site}/forum/${opts.postSlug}">View the discussion</a></p>
    `,
  };
}

export function marketplaceInquiryEmail(opts: {
  sellerName: string;
  listingTitle: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  return {
    subject: `New inquiry for ${opts.listingTitle}`,
    html: `
      <p>You have a new marketplace inquiry on <strong>${opts.listingTitle}</strong>.</p>
      <p><strong>${opts.requesterName}</strong> (${opts.requesterEmail})</p>
      <p>${opts.message}</p>
      <p><a href="${site}/marketplace/seller">View in seller inbox</a></p>
    `,
  };
}

export function jobApplicationStatusEmail(opts: {
  applicantName: string;
  jobTitle: string;
  status: "reviewed" | "rejected";
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  const label = opts.status === "reviewed" ? "reviewed" : "not moving forward with";
  return {
    subject: `Update on your application for ${opts.jobTitle}`,
    html: `
      <p>Hi ${opts.applicantName},</p>
      <p>Your application for <strong>${opts.jobTitle}</strong> has been ${label}.</p>
      <p><a href="${site}/settings">View your applications</a></p>
    `,
  };
}

export function jobApplicationConfirmationEmail(opts: { applicantName: string; jobTitle: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  return {
    subject: `Application submitted: ${opts.jobTitle}`,
    html: `
      <p>Hi ${opts.applicantName},</p>
      <p>Your application for <strong>${opts.jobTitle}</strong> was submitted successfully. The employer will review it in their inbox.</p>
      <p><a href="${site}/settings">Track your applications</a></p>
    `,
  };
}

export function liveRecordingReadyEmail(opts: { sessionTitle: string; recordingUrl: string; sessionSlug: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";
  return {
    subject: `Recording available: ${opts.sessionTitle}`,
    html: `
      <p>A recording is now available for <strong>${opts.sessionTitle}</strong>.</p>
      <p><a href="${site}/live/${opts.sessionSlug}">Watch the recording</a></p>
    `,
  };
}

export function portfolioContactEmail(opts: {
  studentName: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
}) {
  return {
    subject: `Someone reached out about your portfolio`,
    html: `
      <p><strong>${opts.requesterName}</strong> (${opts.requesterEmail}) sent you a message:</p>
      <p>${opts.message}</p>
      <p>Check your email to respond directly.</p>
    `,
  };
}
