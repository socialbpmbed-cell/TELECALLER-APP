// ═══════════════════════════════════════════════════════════════
// CONFIGURATION — Change this to your n8n webhook URL
// ═══════════════════════════════════════════════════════════════
const WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "https://n8n-bqrh.srv1648756.hstgr.cloud/webhook/lead-lookup";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return Response.json({ error: "Missing search query." }, { status: 400 });
  }

  // If webhook URL is not configured, return demo data
  if (WEBHOOK_URL.includes("your-n8n-instance")) {
    return Response.json(getDemoData(q));
  }

  try {
    const res = await fetch(
      `${WEBHOOK_URL}?q=${encodeURIComponent(q)}`,
      { cache: "no-store", signal: AbortSignal.timeout(60000) }
    );
    let data = await res.json();

    // n8n returns an array — unwrap the first element
    if (Array.isArray(data)) {
      data = data[0] || {};
    }

    if (res.ok && data.lead) {
      return Response.json(data);
    }

    return Response.json(
      { error: data.error || "Lead not found." },
      { status: 404 }
    );
  } catch {
    return Response.json(
      { error: "Could not connect to server. Check n8n is active." },
      { status: 502 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// DEMO DATA — returned when webhook is not configured
// ═══════════════════════════════════════════════════════════════
function getDemoData(q) {
  return {
    lead: {
      leadNo: q.toUpperCase().startsWith("PNDAS") ? q.toUpperCase() : "PNDAS-001",
      name: "Aarav Sharma",
      phone: q.match(/^\d{10}$/) ? q : "9876543210",
      address: "Burnpur, Asansol, West Bengal",
      course: "GNM Nursing — 3 Year",
      source: "Facebook Ad Campaign",
      status: "Open",
      callbackDate: new Date(Date.now() + 2 * 86400000)
        .toISOString()
        .split("T")[0],
    },
    totalFollowups: 7,
    followups: {
      phone: { count: 4 },
      whatsapp: { count: 2 },
      visit: { count: 1 },
    },
    daysSinceLastContact: 3,
    callLog: [
      {
        timestamp: "2025-04-28 11:30 AM",
        method: "Phone",
        pickedUp: "Yes",
        notes:
          "Spoke with student's father. Very interested in GNM course. Asked about hostel facilities and fee structure. Will discuss with family.",
        statusAfter: "Open",
        callbackScheduled: "2025-05-01",
      },
      {
        timestamp: "2025-04-25 03:15 PM",
        method: "WhatsApp",
        pickedUp: "N/A",
        notes:
          "Sent course brochure PDF and fee breakdown. Student read the messages and reacted with thumbs up.",
        statusAfter: "Open",
        callbackScheduled: null,
      },
      {
        timestamp: "2025-04-22 10:00 AM",
        method: "Phone",
        pickedUp: "No",
        notes: "Call did not connect — phone was busy. Will retry later.",
        statusAfter: "Open",
        callbackScheduled: "2025-04-25",
      },
      {
        timestamp: "2025-04-20 02:00 PM",
        method: "Phone",
        pickedUp: "Switched Off",
        notes:
          "Phone switched off. Sent a WhatsApp message as follow up.",
        statusAfter: "Open",
        callbackScheduled: null,
      },
      {
        timestamp: "2025-04-18 09:30 AM",
        method: "Visit",
        pickedUp: "N/A",
        notes:
          "Student visited campus with mother. Toured the nursing lab and hostel. Very impressed with infrastructure.",
        statusAfter: "Open",
        callbackScheduled: null,
      },
    ],
    scheduledCallbacks: [
      {
        date: "2025-05-01",
        setOn: "2025-04-28",
        notes: "Family discussion — follow up on admission decision",
      },
      {
        date: "2025-04-25",
        setOn: "2025-04-22",
        notes: "Retry call — was busy earlier",
      },
    ],
  };
}
