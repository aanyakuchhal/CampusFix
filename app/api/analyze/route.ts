import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { analyzeComplaint } from "../../../analyze-complaint";

export const runtime = "nodejs";

const DEPARTMENT_IDS: Record<string, string> = {
  Maintenance: "da19045a-5660-46d9-a6d0-8172a26aed25",
  IT: "271c52d5-23dc-4641-bf33-f65c8b46ae92",
  "IT Helpdesk": "271c52d5-23dc-4641-bf33-f65c8b46ae92",
  "Hostel Administration": "6107539f-b003-49ce-a48a-bdc8f56d88fe",
  Electrical: "f472cb7f-22ff-4625-992f-4333367644ea",
  Housekeeping: "1f443037-adcb-4774-9a86-c81e26cde612",
};

export async function POST(request: Request) {
  try {
    const { description, location, imageUrl } = await request.json();

    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        { error: "description is required" },
        { status: 400 }
      );
    }

    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      console.error("Missing server-side Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(url, serviceKey);

    const result = analyzeComplaint({
      description: description.trim(),
      imageUrl: imageUrl || null,
      location: location || null,
    });

    const departmentId =
      DEPARTMENT_IDS[result.department] || DEPARTMENT_IDS.Maintenance;

    const { data: complaint, error } = await supabase
      .from("complaints")
      .insert({
        title: result.email_subject,
        description: description.trim(),
        image_url: imageUrl || null,
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
      console.error("Supabase insert error:", error.message);
      return NextResponse.json(
        { error: "Failed to save complaint" },
        { status: 500 }
      );
    }

    return NextResponse.json({ complaint, ai: result });
  } catch (error) {
    console.error("Complaint analysis failed:", error);
    return NextResponse.json(
      { error: "Invalid request or analysis failed" },
      { status: 500 }
    );
  }
}