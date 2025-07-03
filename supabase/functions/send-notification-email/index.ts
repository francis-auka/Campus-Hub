
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// CORS headers for browser compatibility
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract data from the webhook payload
    const payload = await req.json();
    const { record, type } = payload;

    if (!record) {
      return new Response(
        JSON.stringify({ error: "No record in webhook payload" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get recipient info
    const { data: recipient, error: recipientError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", record.recipient_id)
      .single();

    if (recipientError) {
      throw new Error(`Error fetching recipient: ${recipientError.message}`);
    }

    // Get sender info
    const { data: sender, error: senderError } = await supabaseAdmin
      .from("profiles")
      .select("name")
      .eq("id", record.sender_id)
      .single();

    if (senderError) {
      throw new Error(`Error fetching sender: ${senderError.message}`);
    }

    // Get hustle info
    const { data: hustle, error: hustleError } = await supabaseAdmin
      .from("hustles")
      .select("title")
      .eq("id", record.hustle_id)
      .single();

    if (hustleError) {
      throw new Error(`Error fetching hustle: ${hustleError.message}`);
    }

    // Get user's email from auth.users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      record.recipient_id
    );

    if (userError || !userData?.user) {
      throw new Error(`Error fetching user: ${userError?.message || "User not found"}`);
    }

    const userEmail = userData.user.email;

    if (!userEmail) {
      throw new Error("User email not found");
    }

    // Prepare email content
    const emailSubject = "New message on CampusHustle";
    const emailContent = `
      <h2>Hello ${recipient.name},</h2>
      <p>You have a new message from <strong>${sender.name}</strong> regarding your hustle task: <strong>${hustle.title}</strong>.</p>
      <p>Message preview: "${record.message.substring(0, 100)}${record.message.length > 100 ? '...' : ''}"</p>
      <p>Log in to your CampusHustle account to respond.</p>
      <p>Best regards,<br>The CampusHustle Team</p>
    `;

    // For now, we'll just log the email that would be sent
    // In a real implementation, you would integrate with an email service like Resend, SendGrid, etc.
    console.log(`Would send email to: ${userEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Content: ${emailContent}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email notification processed", 
        debug: { recipient: userEmail, subject: emailSubject } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing email notification:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
