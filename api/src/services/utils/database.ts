import { createClient } from "@supabase/supabase-js";
import { Database } from "../../models/db/database.models";

const supabaseUrl = "https://dvhkhihwfgyeyodldfir.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aGtoaWh3Zmd5ZXlvZGxkZmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMTg1MDgsImV4cCI6MjAzMzg5NDUwOH0.yFe41FUw0i5XUaX3rzGjr05VbtFoqzoyAXvHGGjMCDY";

export default createClient<Database>(supabaseUrl, supabaseKey);
