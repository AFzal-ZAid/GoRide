import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Ride } from '../../contexts/RideContext';

interface RideMapProps {
  ride: Ride;
}

// Temporary Mapbox token for demo purposes
// In a real app, you would use an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const RideMap: React.FC<RideMapProps> = ({ ride }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ride.pickup.lng, ride.pickup.lat],
      zoom: 12,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers
    const pickupMarker = new mapboxgl.Marker({ color: '#2196F3' })
      .setLngLat([ride.pickup.lng, ride.pickup.lat])
      .addTo(map.current);
      
    const dropoffMarker = new mapboxgl.Marker({ color: '#1976D2' })
      .setLngLat([ride.dropoff.lng, ride.dropoff.lat])
      .addTo(map.current);

    // Fit map to show both markers
    const bounds = new mapboxgl.LngLatBounds()
      .extend([ride.pickup.lng, ride.pickup.lat])
      .extend([ride.dropoff.lng, ride.dropoff.lat]);
      
    map.current.fitBounds(bounds, { padding: 70, maxZoom: 15 });

    // Draw route (simplified for demo)
    map.current.on('load', () => {
      if (!map.current) return;
      
      // Simple direct line between points for demo
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [ride.pickup.lng, ride.pickup.lat],
              [ride.dropoff.lng, ride.dropoff.lat],
            ],
          },
        },
      });
      
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#1976D2',
          'line-width': 4,
          'line-opacity': 0.75,
        },
      });
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [ride]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default RideMap;