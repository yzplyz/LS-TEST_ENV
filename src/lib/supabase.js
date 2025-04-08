
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vsacdqqtdthwngwfgser.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYWNkcXF0ZHRod25nd2Znc2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzYxMjQsImV4cCI6MjA1OTIxMjEyNH0.Lxooa2qICCFWl-p2_DDP2rwtCpZ1JTj-p5AdxpfQMbQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
