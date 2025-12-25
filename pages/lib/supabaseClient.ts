
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjtbosqolgykjgvzhsnh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdGJvc3FvbGd5a2pndnpoc25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NDIzMjIsImV4cCI6MjA4MDIxODMyMn0.6f4_g3P32syx1BFke9LCDx5BstQncF4iDeh6XpiwdCg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
