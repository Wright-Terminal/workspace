// Serverless function (Vercel, Node runtime) — receives demo-form submissions
// and emails them via Resend (https://resend.com).
//
// Required env vars (set in Vercel Project Settings → Environment Variables):
//   RESEND_API_KEY  — API key from resend.com
//   DEMO_TO_EMAIL   — inbox that should receive demo requests
//   DEMO_FROM_EMAIL — a sender address on a domain verified with Resend
//                      (e.g. "Wright Treo <demo@wrightterminal.com>")

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch (e) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }
  }

  const fullName = String(body.fullName || '').trim();
  const email = String(body.email || '').trim();
  const company = String(body.company || '').trim();
  const role = String(body.role || '').trim();
  const notes = String(body.notes || '').trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!fullName || !email || !company || !role) {
    return res.status(400).json({ error: 'Please fill in your name, work email, company and account type.' });
  }
  if (!emailOk) {
    return res.status(400).json({ error: "That email address doesn't look right — please check it." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.DEMO_TO_EMAIL;
  const fromEmail = process.env.DEMO_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error('Demo request dropped: RESEND_API_KEY, DEMO_TO_EMAIL or DEMO_FROM_EMAIL is not configured.');
    return res.status(500).json({ error: 'Demo requests are not being accepted right now. Please email us directly.' });
  }

  const html =
    '<h2>New demo request</h2>' +
    '<p><b>Name:</b> ' + escapeHtml(fullName) + '</p>' +
    '<p><b>Email:</b> ' + escapeHtml(email) + '</p>' +
    '<p><b>Company:</b> ' + escapeHtml(company) + '</p>' +
    '<p><b>Account type:</b> ' + escapeHtml(role) + '</p>' +
    '<p><b>Notes:</b><br>' + (notes ? escapeHtml(notes).replace(/\n/g, '<br>') : '(none)') + '</p>';

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: 'Demo request — ' + company + ' (' + fullName + ')',
        html: html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend API error:', resendRes.status, errText);
      return res.status(502).json({ error: 'Failed to send your request. Please try again shortly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Demo request send failed:', err);
    return res.status(500).json({ error: 'Failed to send your request. Please try again shortly.' });
  }
};
