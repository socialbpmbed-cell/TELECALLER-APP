const API_URL = process.env.N8N_FETCH_LEADS_URL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const res = await fetch(`${API_URL}?name=${encodeURIComponent(name)}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
