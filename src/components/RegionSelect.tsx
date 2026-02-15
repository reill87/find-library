"use client";

import { REGIONS, DETAIL_REGIONS } from "@/lib/regions";

interface RegionSelectProps {
  region: string;
  dtlRegion: string;
  onRegionChange: (region: string) => void;
  onDtlRegionChange: (dtlRegion: string) => void;
}

export default function RegionSelect({
  region,
  dtlRegion,
  onRegionChange,
  onDtlRegionChange,
}: RegionSelectProps) {
  const detailRegions = region ? DETAIL_REGIONS[region] ?? [] : [];

  return (
    <div className="flex gap-3">
      <select
        value={region}
        onChange={(e) => {
          onRegionChange(e.target.value);
          onDtlRegionChange("");
        }}
        className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">전체 지역</option>
        {REGIONS.map((r) => (
          <option key={r.code} value={r.code}>
            {r.name}
          </option>
        ))}
      </select>

      {detailRegions.length > 0 && (
        <select
          value={dtlRegion}
          onChange={(e) => onDtlRegionChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">전체 시/군/구</option>
          {detailRegions.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
