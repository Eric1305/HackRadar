import React from "react";
import HackathonTable from "@/components/table";
import { useFavorites } from "@/components/favoritesctx";
import NavBar from "@/components/navbar";

export default function StarredPage() {
  const { favorites } = useFavorites();
  return (
     <div className="w-screen h-screen flex flex-col relative justify-center items-center gap-7 ">
      <NavBar />
      <HackathonTable data={favorites} loading={false} />
    </div>
  );
}