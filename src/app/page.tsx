"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CountrySelect from "@/components/CountrySelect";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saveId, setSaveId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("utopik_save_id");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setSaveId(saved);
  }, []);

  const handleCountrySelect = async (countryName: string, leaderProfile: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryName, leaderProfile }),
      });

      if (!res.ok) {
        throw new Error("Oyun başlatılamadı");
      }

      const data = await res.json();
      router.push(`/game?id=${data.game.id}`);
    } catch (error) {
      console.error("Hata:", error);
      setLoading(false);
      alert("Oyun başlatılırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleContinue = () => {
    if (saveId) {
      setLoading(true);
      router.push(`/game?id=${saveId}`);
    }
  };

  return <CountrySelect onSelect={handleCountrySelect} onContinue={handleContinue} saveId={saveId} loading={loading} />;
}
