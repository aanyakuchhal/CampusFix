"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDatabase() {
  const [result, setResult] = useState<string>("Testing...");
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from("complaints")
        .select("id, title, status, priority")
        .limit(10);

      if (error) {
        console.error(error);
        setResult(`ERROR: ${error.message}`);
        return;
      }

      setRows(data ?? []);
      setResult(`SUCCESS — ${data?.length ?? 0} complaints found`);
    }

    test();
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Supabase Test</h1>

      <p>{result}</p>

      <pre>
        {JSON.stringify(rows, null, 2)}
      </pre>
    </main>
  );
}