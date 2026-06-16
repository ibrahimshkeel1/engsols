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
    console.error("[email] failed", text);
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
