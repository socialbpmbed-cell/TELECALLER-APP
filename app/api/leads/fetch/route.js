const API_URL = process.env.N8N_FETCH_LEADS_URL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    
    console.log("Fetching leads for:", name, "from", API_URL);
    
    const res = await fetch(`${API_URL}?name=${encodeURIComponent(name)}`, {
      cache: "no-store",
    });
    
    console.log("n8n response status:", res.status);
    
    const data = await res.json();
    console.log("n8n response data:", JSON.stringify(data));
    return Response.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return Response.json({ error: "Failed to fetch leads", details: error.message }, { status: 500 });
  }
}
