import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, LocateFixed, X } from "lucide-react";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type MapPickerProps = {
  onConfirm: (address: string) => void;
  onClose: () => void;
};

const TEL_AVIV: L.LatLngTuple = [32.0853, 34.7818];

const pinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type NominatimAddress = {
  road?: string;
  pedestrian?: string;
  house_number?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
};

function formatAddress(data: { address?: NominatimAddress; display_name?: string }) {
  const a = data.address;

  if (!a) return data.display_name ?? "";

  const street = [a.road ?? a.pedestrian, a.house_number].filter(Boolean).join(" ");
  const city = a.city ?? a.town ?? a.village ?? "";
  const formatted = [street || a.neighbourhood || a.suburb, city].filter(Boolean).join(", ");

  return formatted || data.display_name || "";
}

export default function MapPicker({ onConfirm, onClose }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const requestId = useRef(0);

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function resolveAddress(latlng: L.LatLng) {
    const id = ++requestId.current;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=en&lat=${latlng.lat}&lon=${latlng.lng}`,
      );

      if (!response.ok) throw new Error();

      const data = await response.json();

      if (id !== requestId.current) return;

      setAddress(formatAddress(data));
    } catch {
      if (id !== requestId.current) return;

      setAddress("");
      setError("Could not find an address for this spot. Try moving the pin.");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView(TEL_AVIV, 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker(TEL_AVIV, { draggable: true, icon: pinIcon }).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    marker.on("dragend", () => resolveAddress(marker.getLatLng()));
    map.on("click", (event: L.LeafletMouseEvent) => {
      marker.setLatLng(event.latlng);
      resolveAddress(event.latlng);
    });

    resolveAddress(marker.getLatLng());

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  function locateMe() {
    if (!navigator.geolocation) {
      setError("Location is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latlng = L.latLng(coords.latitude, coords.longitude);

        markerRef.current?.setLatLng(latlng);
        mapRef.current?.setView(latlng, 17);
        resolveAddress(latlng);
      },
      () => setError("Could not get your location. Move the pin manually."),
    );
  }

  return (
    <div className="map-picker-backdrop" role="dialog" aria-modal="true" aria-label="Pick a location on the map">
      <div className="map-picker">
        <header className="map-picker-header">
          <section>
            <h3>Choose location</h3>
            <p>Click the map or drag the pin to the exact spot.</p>
          </section>
          <button type="button" className="map-picker-icon-btn" onClick={onClose} aria-label="Close map">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="map-picker-map" ref={containerRef} />

        <footer className="map-picker-footer">
          <p className="map-picker-address" aria-live="polite">
            {loading ? "Finding address…" : error || address || "Move the pin to select an address"}
          </p>
          <section className="map-picker-actions">
            <button type="button" className="resident-secondary-btn" onClick={locateMe}>
              <LocateFixed size={15} aria-hidden="true" /> My location
            </button>
            <button
              type="button"
              className="resident-primary-btn"
              disabled={loading || !address}
              onClick={() => onConfirm(address)}>
              <Check size={15} aria-hidden="true" /> Use this address
            </button>
          </section>
        </footer>
      </div>
    </div>
  );
}
