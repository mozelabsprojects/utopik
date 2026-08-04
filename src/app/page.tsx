"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CountrySelect from "@/components/CountrySelect";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  return <CountrySelect onSelect={handleCountrySelect} loading={loading} />;
}
