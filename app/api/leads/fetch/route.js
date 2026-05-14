import { getSession } from '@/lib/auth';

const API_URL = process.env.N8N_FETCH_LEADS_URL;

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return Response.json({ error: 'Missing name parameter.' }, { status: 400 });
  }

  if (!API_URL) {
    return Response.json({ error: 'Leads service not configured.' }, { status: 503 });
  }

  try {
    const res = await fetch(`${API_URL}?name=${encodeURIComponent(name)}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return Response.json({ error: 'Leads service timed out.' }, { status: 504 });
    }
    return Response.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}
