const API_URL = "https://n8n-bqrh.srv1648756.hstgr.cloud/webhook/telecaller-update";

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
