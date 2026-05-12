const API_URL = "https://n8n-bqrh.srv1648756.hstgr.cloud/webhook/send-otp";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Create an AbortController for a 10-second timeout
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
      // If n8n succeeded but didn't return "sent: true" (e.g. it returned Google Sheets output)
      // we inject it so the frontend proceeds.
      if (res.status === 200 && data && !data.error) {
        data.sent = true;
      }
    } catch (e) {
      if (text.includes("Workflow started") || res.status === 200) {
        return Response.json({ sent: true, note: "Handled by proxy" });
      }
      return Response.json({ error: "Invalid response from n8n", details: text }, { status: 500 });
    }

    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error("OTP Proxy Error:", error);
    if (error.name === 'AbortError') {
      return Response.json({ error: "n8n request timed out. Check if workflow is active." }, { status: 504 });
    }
    return Response.json({ error: "Failed to connect to n8n backend" }, { status: 500 });
  }
}
