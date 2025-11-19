import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";

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

type MapProps = {
  data: Hackathon[];
};

export default function MapComponent({ data }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  // Initialize the map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-96.0, 37.8], // roughly center of US
      zoom: 3,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
  }, []);

  // Update markers whenever data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new maplibregl.LngLatBounds();
    let hasValidMarker = false;

    data.forEach((hack) => {
      if (hack.latitude == null || hack.longitude == null) return;

      hasValidMarker = true;

      const popupHtml = `
        <div>
          <strong>${hack.name}</strong><br/>
          ${(hack.city ?? "")}${
        hack.city && hack.state_region ? ", " : ""
      }${hack.state_region ?? ""}<br/>
          ${hack.country ?? ""}<br/>
          ${hack.start_date} → ${hack.end_date}
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 16 }).setHTML(popupHtml);

      const marker = new maplibregl.Marker({ color: "#62ed05" })
        .setLngLat([hack.longitude, hack.latitude])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([hack.longitude, hack.latitude]);
    });

    if (hasValidMarker && !bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 8,
        duration: 0, // avoid long animations on filter changes
      });
    }
  }, [data]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
