import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Location } from '../../contexts/RideContext';

interface BookingMapProps {
  pickup: Location | null;
  dropoff: Location | null;
  onLocationSelect: (type: 'pickup' | 'dropoff', location: Location) => void;
}

// Temporary Mapbox token for demo purposes
// In a real app, you would use an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const BookingMap: React.FC<BookingMapProps> = ({ pickup, dropoff, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const pickupMarker = useRef<mapboxgl.Marker | null>(null);
  const dropoffMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: pickup ? [pickup.lng, pickup.lat] : [-74.0060, 40.7128], // Default to NYC
      zoom: 12,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geocoder control (simplified for demo)
    // In a real app, you would use Mapbox Geocoder

    // Add click handler for setting locations
    map.current.on('click', (e) => {
      const coordinates = e.lngLat;
      const location: Location = {
        lat: coordinates.lat,
        lng: coordinates.lng,
        address: `Location at ${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`,
      };
      
      // If pickup is not set, set pickup, otherwise set dropoff
      if (!pickup) {
        onLocationSelect('pickup', location);
      } else if (!dropoff) {
        onLocationSelect('dropoff', location);
      }
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current) return;
    
    // Update pickup marker
    if (pickup) {
      if (pickupMarker.current) {
        pickupMarker.current.setLngLat([pickup.lng, pickup.lat]);
      } else {
        pickupMarker.current = new mapboxgl.Marker({ color: '#2196F3' })
          .setLngLat([pickup.lng, pickup.lat])
          .addTo(map.current);
      }
    }
    
    // Update dropoff marker
    if (dropoff) {
      if (dropoffMarker.current) {
        dropoffMarker.current.setLngLat([dropoff.lng, dropoff.lat]);
      } else {
        dropoffMarker.current = new mapboxgl.Marker({ color: '#1976D2' })
          .setLngLat([dropoff.lng, dropoff.lat])
          .addTo(map.current);
      }
    }
    
    // If both locations are set, fit map to show both
    if (pickup && dropoff && map.current) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend([pickup.lng, pickup.lat])
        .extend([dropoff.lng, dropoff.lat]);
        
      map.current.fitBounds(bounds, { padding: 70, maxZoom: 15 });
      
      // Draw route (simplified for demo)
      if (map.current.getSource('route')) {
        // Update existing source
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [pickup.lng, pickup.lat],
              [dropoff.lng, dropoff.lat],
            ],
          },
        });
      } else {
        // Create new source and layer
        map.current.on('load', () => {
          if (!map.current || !pickup || !dropoff) return;
          
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [pickup.lng, pickup.lat],
                  [dropoff.lng, dropoff.lat],
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
      }
    }
  }, [pickup, dropoff]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default BookingMap;