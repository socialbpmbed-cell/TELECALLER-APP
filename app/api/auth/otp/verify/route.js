const API_URL = process.env.N8N_VERIFY_OTP_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
      if (res.status === 200 && data && !data.error) {
        data.verified = true;
      }
    } catch (e) {
      if (text.includes("Workflow started") || res.status === 200) {
        return Response.json({ verified: true, note: "Handled by proxy" });
      }
      return Response.json({ error: "Invalid response from n8n", details: text }, { status: 500 });
    }

    return Response.json(data, { status: res.status });
  } catch (error) {
    if (error.name === 'AbortError') {
      return Response.json({ error: "Verification timed out. Check n8n." }, { status: 504 });
    }
    return Response.json({ error: "Failed to connect to verification backend" }, { status: 500 });
  }
}
