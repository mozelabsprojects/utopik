"use client";

import React from "react";

export interface PartyLogoData {
  id: string;
  name: string;
  defaultColor: string;
  iconName: string;
}

export class PartyLogoList {
  static LOGOS: PartyLogoData[] = [
    { id: "logo_eagle", name: "Özgürlük & Kartal", defaultColor: "#3b82f6", iconName: "eagle" },
    { id: "logo_phoenix", name: "Yeniden Doğuş (Anka)", defaultColor: "#a855f7", iconName: "phoenix" },
    { id: "logo_sun", name: "Aydınlık & Gelecek", defaultColor: "#f59e0b", iconName: "sun" },
    { id: "logo_shield", name: "İstikrar & Kalkan", defaultColor: "#0284c7", iconName: "shield" },
    { id: "logo_tech", name: "Sanayi & İlerleme", defaultColor: "#06b6d4", iconName: "tech" },
    { id: "logo_peace", name: "Ekoloji & Barış", defaultColor: "#10b981", iconName: "peace" },
    { id: "logo_scales", name: "Adalet & Hukuk", defaultColor: "#6366f1", iconName: "scales" },
    { id: "logo_lion", name: "Egemenlik & Birlik", defaultColor: "#ef4444", iconName: "lion" },
  ];
}

interface PartyLogoProps {
  logoId: string;
  color?: string;
  size?: number; // size in px
  className?: string;
  showBg?: boolean;
}

export default function PartyLogo({
  logoId,
  color = "#3b82f6",
  size = 32,
  className = "",
  showBg = true,
}: PartyLogoProps) {
  // Support legacy IDs if any exist in saved states
  let activeId = logoId;
  if (logoId === "logo_bulb") activeId = "logo_sun";
  if (logoId === "logo_arrows") activeId = "logo_eagle";
  if (logoId === "logo_crescent") activeId = "logo_peace";

  const logoInfo = PartyLogoList.LOGOS.find((l) => l.id === activeId) || PartyLogoList.LOGOS[0];
  const activeColor = color || logoInfo.defaultColor;

  const renderSvgIcon = () => {
    switch (logoInfo.iconName) {
      case "eagle":
        // Stylized Eagle Winged Emblem
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M12 3L4 9v4c0 5.5 3.8 10.1 8 11 4.2-.9 8-5.5 8-11V9l-8-6z" fill={activeColor} fillOpacity="0.15" stroke={activeColor} />
            <path d="M12 6l-4 4h3v4h2v-4h3l-4-4z" fill={activeColor} />
            <path d="M7 11l-3 2v2l3-1v-3zM17 11l3 2v2l-3-1v-3z" fill={activeColor} />
          </svg>
        );

      case "phoenix":
        // Rising Phoenix wings
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M12 22s-4-3-4-8c0-3.5 2-6 4-9 2 3 4 5.5 4 9 0 5-4 8-4 8z" fill={activeColor} fillOpacity="0.2" />
            <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" fill={activeColor} />
            <path d="M5 10c2-2 4-2 7 0M19 10c-2-2-4-2-7 0" />
            <path d="M3 14c3-2 6-1 9 2M21 14c-3-2-6-1-9 2" />
          </svg>
        );

      case "sun":
        // Radiant Sun & Crown
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <circle cx="12" cy="12" r="5" fill={activeColor} fillOpacity="0.25" stroke={activeColor} />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke={activeColor} strokeWidth="2" />
          </svg>
        );

      case "shield":
        // Shield & Star
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={activeColor} fillOpacity="0.2" />
            <path d="M12 7l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5L12 7z" fill={activeColor} stroke="none" />
          </svg>
        );

      case "tech":
        // Gear & Atom / Progress
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <circle cx="12" cy="12" r="3" fill={activeColor} />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        );

      case "peace":
        // Leaf / Tree / Ecology
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 9 0 5-4 9-10 9z" fill={activeColor} fillOpacity="0.2" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke={activeColor} strokeWidth="2" />
          </svg>
        );

      case "scales":
        // Scales of Justice
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M12 3v18M5 3h14M5 7l-3 7h6L5 7zM19 7l-3 7h6l-3-7zM2 14c0 1.5 1.3 3 3 3s3-1.5 3-3M16 14c0 1.5 1.3 3 3 3s3-1.5 3-3M8 21h8" stroke={activeColor} strokeWidth="1.8" />
          </svg>
        );

      case "lion":
        // Lion / Crown Sovereign
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M5 18l-2-6 5 2 4-6 4 6 5-2-2 6H5z" fill={activeColor} fillOpacity="0.25" />
            <circle cx="12" cy="19" r="2" fill={activeColor} />
            <path d="M12 4v4M8 6l8 0" stroke={activeColor} />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="2" className="w-full h-full">
            <circle cx="12" cy="12" r="9" fill={activeColor} fillOpacity="0.2" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full transition-transform ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: showBg ? `${activeColor}15` : "transparent",
        borderColor: showBg ? `${activeColor}60` : "transparent",
        borderWidth: showBg ? 1.5 : 0,
        padding: Math.max(2, Math.round(size * 0.15)),
      }}
    >
      {renderSvgIcon()}
    </div>
  );
}
