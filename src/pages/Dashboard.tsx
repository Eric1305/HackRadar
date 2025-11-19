"use client";

import "@/index.css";
import HackathonTable from "@/components/table";
import NavBar from "@/components/navbar";
import SearchFilterUI from "@/components/search";
import MapComponent from "@/components/map";
import { useState } from "react";

type Hackathon = {
  hackathon_id: number;
  name: string;
  state_region: string;
  start_date: string;
  end_date: string;
  city?: string;
  country?: string;
  timezone?: string;
  latitude: number | null;
  longitude: number | null;
};

export default function Dashboard() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);

  // Normalize latitude/longitude to numbers
  const handleResultsChange = (results: Hackathon[]) => {
    const cleaned = results.map((h: any) => ({
      ...h,
      latitude:
        h.latitude !== null && h.latitude !== undefined
          ? Number(h.latitude)
          : null,
      longitude:
        h.longitude !== null && h.longitude !== undefined
          ? Number(h.longitude)
          : null,
    }));
    setHackathons(cleaned);
  };

  return (
    <section>
      <NavBar />
      <div className="pt-32 px-6 pb-6">
        {/* Map on the left, Search + Table stacked on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT: Map */}
          <div className="w-full h-[550px] border border-[#62ed05]/40 rounded-lg overflow-hidden">
            <MapComponent data={hackathons} />
          </div>

          {/* RIGHT: Search on top, table underneath */}
          <div className="flex flex-col gap-6">
            <SearchFilterUI
              onResultsChange={handleResultsChange}
              onLoadingChange={setLoading}
            />
            <HackathonTable data={hackathons} loading={loading} />
          </div>
        </div>
      </div>
    </section>
  );
}
