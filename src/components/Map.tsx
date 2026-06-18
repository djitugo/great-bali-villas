"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
  href?: string;
}

export function Map({
  markers,
  center,
  zoom = 13,
  className,
  circle = false,
}: {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  circle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    let onResize: (() => void) | null = null;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;

      const c: [number, number] = center || (markers[0] ? [markers[0].lat, markers[0].lng] : [-8.65, 115.16]);
      const map = L.map(ref.current, {
        center: c,
        zoom,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      const pin = L.divIcon({
        className: "gbv-pin-wrap",
        html:
          '<span class="gbv-pin"><svg viewBox="0 0 24 32" width="26" height="34" fill="none">' +
          '<path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.5 12 32 12 32s12-11.5 12-20.1C24 5.3 18.6 0 12 0Z" fill="#141414"/>' +
          '<circle cx="12" cy="11.7" r="4.2" fill="#fff"/></svg></span>',
        iconSize: [26, 34],
        iconAnchor: [13, 34],
        popupAnchor: [0, -32],
      });

      const pts: [number, number][] = [];
      markers.forEach((m) => {
        pts.push([m.lat, m.lng]);
        const mk = L.marker([m.lat, m.lng], { icon: pin }).addTo(map);
        if (m.label) {
          const html = m.href
            ? `<a href="${m.href}" style="font-weight:600;color:#141414;text-decoration:none">${m.label}</a>`
            : `<span style="font-weight:600">${m.label}</span>`;
          mk.bindPopup(html, { closeButton: false });
        }
        if (m.href) mk.on("click", () => { window.location.href = m.href!; });
      });

      if (circle && markers[0]) {
        L.circle([markers[0].lat, markers[0].lng], {
          radius: 700,
          color: "#141414",
          weight: 1,
          opacity: 0.25,
          fillColor: "#141414",
          fillOpacity: 0.06,
        }).addTo(map);
      }

      if (!center && markers.length > 1) {
        map.fitBounds(L.latLngBounds(pts).pad(0.2));
      }

      onResize = () => map.invalidateSize();
      window.addEventListener("resize", onResize);
      setTimeout(() => map.invalidateSize(), 120);
    })();

    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener("resize", onResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} className={className} aria-label="Map" />;
}
