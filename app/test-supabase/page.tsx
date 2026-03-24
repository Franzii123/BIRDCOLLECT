import { supabase } from "@/lib/supabase/client";

export default async function TestSupabasePage() {
  const { data, error } = await supabase.from("sightings").select("*").limit(5);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl mb-4">Supabase Test</h1>
      <pre className="text-sm whitespace-pre-wrap">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}