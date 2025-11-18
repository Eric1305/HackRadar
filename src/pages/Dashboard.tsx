"use client";

import "@/index.css";
import HackathonTable from "@/components/table";
import NavBar from "@/components/navbar";
import SearchFilterUI from "@/components/search";
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
};

export default function Dashboard() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <section>
      <NavBar />
      <div className="pt-60">
        <SearchFilterUI
          onResultsChange={setHackathons}
          onLoadingChange={setLoading}
        />
      </div>
      <div className="px-6 pb-6">
        <HackathonTable data={hackathons} loading={loading} />
      </div>
    </section>
  );
}
