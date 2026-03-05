import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ayzrvzczssbkpzplldss.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5enJ2emN6c3Nia3B6cGxsZHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDc2MTEsImV4cCI6MjA4ODIyMzYxMX0.B5CvovCy_p0VbN8XWxe0dfqL60T2xGAaJZo0GgqaEik'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
