import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, checkin, checkout, guests, message, propertyName, propertySlug } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const record = {
      name,
      email,
      phone: phone || null,
      checkin: checkin || null,
      checkout: checkout || null,
      guests: guests ? Number(guests) : null,
      message: message || null,
      property_name: propertyName || null,
      property_slug: propertySlug || null,
    };

    try {
      const supabase = createServiceClient();
      const { error } = await supabase.from("inquiries").insert(record);
      if (error) throw error;
    } catch (dbErr) {
      // Table may not exist yet (schema pending). Don't lose the lead from the user's POV.
      console.error("[inquiry] DB insert failed, lead logged:", JSON.stringify(record), dbErr);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
