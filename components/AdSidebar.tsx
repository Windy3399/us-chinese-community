"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ad {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  position: string;
}

export default function AdSidebar() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch("/api/ads");
      const data = await response.json();
      if (data.success) {
        setAds(data.data.ads);
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || ads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
        >
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-auto"
          />
        </a>
      ))}
    </div>
  );
}