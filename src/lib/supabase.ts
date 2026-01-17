import { createClient } from "@supabase/supabase-js";
import { assertConfig, config } from "../config";

assertConfig();
export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);
