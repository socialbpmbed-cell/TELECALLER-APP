import { checkRateLimit } from '@/lib/rateLimit';
import { setSession } from '@/lib/auth';

const API_URL = process.env.N8N_VERIFY_OTP_URL;

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!checkRateLimit(`otp-verify:${ip}`, 10, 15 * 60 * 1000)) {
    return Response.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  }

  try {
    const body = await request.json();

    if (!API_URL) {
      return Response.json({ error: 'Verification service not configured.' }, { status: 503 });
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
    } catch {
      if (text.includes('Workflow started') || res.status === 200) {
        await setSession(body.email);
        return Response.json({ verified: true });
      }
      return Response.json({ error: 'Invalid response from verification service.' }, { status: 500 });
    }

    if (res.status === 200 && data && !data.error) {
      await setSession(body.email);
      data.verified = true;
    }

    return Response.json(data, { status: res.status });
  } catch (error) {
    if (error.name === 'AbortError') {
      return Response.json({ error: 'Verification timed out.' }, { status: 504 });
    }
    return Response.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
