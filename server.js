require("dotenv").config();

const http = require("http");
const { createClient } = require("@supabase/supabase-js");
const { analyzeComplaint } = require("./analyze-complaint");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DEPARTMENT_IDS = {
  Maintenance: "da19045a-5660-46d9-a6d0-8172a26aed25",
  IT: "271c52d5-23dc-4641-bf33-f65c8b46ae92",
  "IT Helpdesk": "271c52d5-23dc-4641-bf33-f65c8b46ae92",
  "Hostel Administration": "6107539f-b003-49ce-a48a-bdc8f56d88fe",
  Electrical: "f472cb7f-22ff-4625-992f-4333367644ea",
  Housekeeping: "1f443037-adcb-4774-9a86-c81e26cde612",
};

const PORT = 3001;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/analyze") {
    res.writeHead(404, {
      "Content-Type": "application/json",
      ...corsHeaders,
    });

    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      if (!data.description) {
        res.writeHead(400, {
          "Content-Type": "application/json",
          ...corsHeaders,
        });

        res.end(JSON.stringify({
          error: "description is required",
        }));

        return;
      }

      const result = analyzeComplaint({
        description: data.description,
        imageUrl: data.imageUrl || null,
        location: data.location || null,
      });

      const departmentId =
        DEPARTMENT_IDS[result.department] ||
        DEPARTMENT_IDS.Maintenance;

      if (!departmentId) {
        res.writeHead(400, {
          "Content-Type": "application/json",
          ...corsHeaders,
        });

        res.end(JSON.stringify({
          error: `Unknown department: ${result.department}`,
        }));

        return;
      }

      const { data: complaint, error } = await supabase
        .from("complaints")
        .insert({
          title: result.email_subject,
          description: data.description,
          image_url: data.imageUrl || null,
          category: result.category,
          subcategory: result.subcategory,
          location: result.location,
          priority: result.priority,
          department_id: departmentId,
          status: "SUBMITTED",
          ai_summary: result.summary,
          ai_suggested_action: result.suggested_action,
          generated_email_subject: result.email_subject,
          generated_email_body: result.email_body,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);

        res.writeHead(500, {
          "Content-Type": "application/json",
          ...corsHeaders,
        });

        res.end(JSON.stringify({
          error: "Failed to save complaint",
          details: error.message,
        }));

        return;
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
        ...corsHeaders,
      });

      res.end(JSON.stringify({
        complaint,
        ai: result,
      }));
    } catch (error) {
      console.error(error);

      res.writeHead(500, {
        "Content-Type": "application/json",
        ...corsHeaders,
      });

      res.end(JSON.stringify({
        error: "Invalid request",
      }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`AI service running at http://localhost:${PORT}`);
});