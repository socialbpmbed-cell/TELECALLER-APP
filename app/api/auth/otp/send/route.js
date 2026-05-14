import { checkRateLimit } from '@/lib/rateLimit';

const API_URL = process.env.N8N_SEND_OTP_URL;

const ALLOWED_EMAILS = [
  "telecaller1@pndas.com",
  "telecaller2@pndas.com",
  "telecaller3@pndas.com",
  "pndasacademyofnursing@gmail.com",
  "ritamghosh195@gmail.com",
];

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!checkRateLimit(`otp-send:${ip}`, 5, 15 * 60 * 1000)) {
    return Response.json({ error: 'Too many requests. Try again in 15 minutes.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !ALLOWED_EMAILS.includes(email)) {
      return Response.json({ error: 'This email is not authorized. Contact admin.' }, { status: 403 });
    }

    if (!API_URL) {
      return Response.json({ error: 'OTP service not configured.' }, { status: 503 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
      if (res.status === 200 && data && !data.error) {
        data.sent = true;
      }
    } catch {
      if (text.includes('Workflow started') || res.status === 200) {
        return Response.json({ sent: true });
      }
      return Response.json({ error: 'Invalid response from OTP service.' }, { status: 500 });
    }

    return Response.json(data, { status: res.status });
  } catch (error) {
    if (error.name === 'AbortError') {
      return Response.json({ error: 'OTP service timed out.' }, { status: 504 });
    }
    return Response.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}
