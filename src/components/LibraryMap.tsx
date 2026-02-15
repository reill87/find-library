"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    L: any;
  }
}

interface MapLibrary {
  libName: string;
  latitude: string;
  longitude: string;
  address: string;
  loanAvailable?: boolean;
}

interface LibraryMapProps {
  libraries: MapLibrary[];
}

export default function LibraryMap({ libraries }: LibraryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  const validLibs = libraries.filter(
    (l) =>
      l.latitude &&
      l.longitude &&
      parseFloat(l.latitude) !== 0 &&
      parseFloat(l.longitude) !== 0
  );

  useEffect(() => {
    if (!visible || !mapRef.current || validLibs.length === 0) return;

    function initMap() {
      if (!mapRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const L = window.L;
      const firstLib = validLibs[0];
      const map = L.map(mapRef.current).setView(
        [parseFloat(firstLib.latitude), parseFloat(firstLib.longitude)],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const bounds: [number, number][] = [];
      validLibs.forEach((lib) => {
        const lat = parseFloat(lib.latitude);
        const lng = parseFloat(lib.longitude);
        bounds.push([lat, lng]);

        const color = lib.loanAvailable ? "#16a34a" : "#6b7280";
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(
            `<b>${lib.libName}</b><br><span style="font-size:12px;color:#666">${lib.address}</span>`
          );
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }

      mapInstanceRef.current = map;
    }

    if (window.L) {
      initMap();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [visible, validLibs]);

  if (validLibs.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setVisible(!visible)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {visible ? "지도 닫기" : "지도에서 보기"}
      </button>

      {visible && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
          <div ref={mapRef} style={{ height: "300px", width: "100%" }} />
          <div className="flex items-center gap-4 px-3 py-1.5 bg-gray-50 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600" />
              대출 가능
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-500" />
              대출 불가
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
