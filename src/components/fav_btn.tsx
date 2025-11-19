import React from "react";
import { useFavorites, type Hackathon } from "./favoritesctx";

export default function FavoriteButton({ hackathon }: { hackathon: Hackathon }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const id = hackathon.hackathon_id ?? hackathon.id;
  const on = isFavorite(id);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggleFavorite(hackathon);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={on ? "Unfavorite" : "Favorite"}
      title={on ? "Unfavorite" : "Favorite"}
      className="px-2 text-yellow-400"
    >
      {on ? "★" : "☆"}
    </button>
  );
}