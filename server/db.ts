// Supabase REST API configuration
export const supabase = {
  url: 'https://ahembadjzomvymqrujto.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZW1iYWRqem9tdnltcXJ1anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjQ3NzgsImV4cCI6MjA3MTcwMDc3OH0.w95g_j5SzM3ltI7DKEoE0D0R9dcGNFjlU2Jo6o0S2uM'
};

// Helper function for Supabase REST API calls
export async function supabaseRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${supabase.url}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      'apikey': supabase.key,
      'Authorization': `Bearer ${supabase.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}