import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ""; // Use service key for webhooks to bypass RLS

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
