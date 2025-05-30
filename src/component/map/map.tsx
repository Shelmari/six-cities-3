import { useEffect, useMemo, useRef } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useMap from '../../hooks/use-map';
import { LocationType, OffersType, OfferType } from '../../types/offers';
import { UrlMarker } from '../../const';

const MAP_HEIGHT = '100%';
const DEFAULT_ICON_SIZE = 40;
const ICON_ANCHOR_X = 20;
const ICON_ANCHOR_Y = 40;

type MapProps = {
  location: LocationType;
  points: OffersType;
  selectedPoint: OfferType | undefined;
};

const defaultCustomIcon = leaflet.icon({
  iconUrl: UrlMarker.Default,
  iconSize: [DEFAULT_ICON_SIZE, DEFAULT_ICON_SIZE],
  iconAnchor: [ICON_ANCHOR_X, ICON_ANCHOR_Y],
});

const currentCustomIcon = leaflet.icon({
  iconUrl: UrlMarker.Current,
  iconSize: [DEFAULT_ICON_SIZE, DEFAULT_ICON_SIZE],
  iconAnchor: [ICON_ANCHOR_X, ICON_ANCHOR_Y],
});

function Map({location, points, selectedPoint}: MapProps): JSX.Element {
  const mapRef = useRef(null);
  const map = useMap(mapRef, location);
  const markerLayer = useRef<leaflet.LayerGroup | null>(null);

  const allPoints = useMemo(() => {
    const isSelectedInPoints = points.find((point) => point.id === selectedPoint?.id);
    return selectedPoint && !isSelectedInPoints
      ? [selectedPoint, ...points]
      : points;
  }, [points, selectedPoint]);

  useEffect(() => {
    if (map) {
      if (markerLayer.current) {
        markerLayer.current.clearLayers();
      }

      markerLayer.current = leaflet.layerGroup().addTo(map);

      allPoints.forEach((point) => {
        leaflet
          .marker({
            lat: point.location.latitude,
            lng: point.location.longitude,
          }, {
            icon: (point.id === selectedPoint?.id)
              ? currentCustomIcon
              : defaultCustomIcon,
          })
          .addTo(markerLayer.current!);
      });
      map.setView([location?.latitude, location?.longitude], location.zoom);
    }
  }, [map, points, selectedPoint, location, allPoints]);

  return (
    <div style={{height: MAP_HEIGHT}} ref={mapRef}></div>
  );
}

export default Map;
