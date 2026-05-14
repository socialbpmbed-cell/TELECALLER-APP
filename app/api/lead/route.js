import { getSession } from '@/lib/auth';

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!WEBHOOK_URL) {
    return Response.json({ error: 'Lead lookup service not configured.' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return Response.json({ error: 'Missing search query.' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${WEBHOOK_URL}?q=${encodeURIComponent(q)}`,
      { cache: 'no-store', signal: AbortSignal.timeout(60000) }
    );
    let data = await res.json();

    if (Array.isArray(data)) {
      data = data[0] || {};
    }

    if (res.ok && data.lead) {
      return Response.json(data);
    }

    return Response.json(
      { error: data.error || 'Lead not found.' },
      { status: 404 }
    );
  } catch {
    return Response.json(
      { error: 'Could not connect to server. Check n8n is active.' },
      { status: 502 }
    );
  }
}
