import { getSession } from '@/lib/auth';

const API_URL = process.env.N8N_UPDATE_LEAD_URL;

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!API_URL) {
    return Response.json({ error: 'Update service not configured.' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return Response.json({ error: 'Update service timed out.' }, { status: 504 });
    }
    return Response.json({ error: 'Failed to update lead.' }, { status: 500 });
  }
}
