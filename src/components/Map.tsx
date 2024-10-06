import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { LatLngTuple } from 'leaflet';
import { ICity, useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeoLocations';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';
export default function Map() {
	const [mapPosition, setMapPosition] = useState<LatLngTuple>([40, 0]);
	const { cities } = useCities();
	const { isLoading: isLoadingPosition, getPosition, position: geoLocationPosition } = useGeolocation();
	const [mapLat, mapLng] = useUrlPosition();

	useEffect(() => {
		if (mapLat && mapLng) {
			setMapPosition([Number(mapLat), Number(mapLng)]);
		}
	}, [mapLat, mapLng]);

	useEffect(() => {
		if (geoLocationPosition) {
			setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
		}
	}, [geoLocationPosition]);

	return (
		<div className={styles.mapContainer}>
			{!geoLocationPosition && (
				<Button type='position' onClick={getPosition}>
					{isLoadingPosition ? 'Loading..' : 'Use Your Position'}
				</Button>
			)}
			<MapContainer className={styles.map} center={mapPosition} zoom={13} scrollWheelZoom={true}>
				<TileLayer url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
				{cities.map((city: ICity) => (
					<Marker position={[city.position.lat, city.position.lng]} key={city.id}>
						<Popup>
							<span>{city.emoji}</span>
							<span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	);
}

interface IChangeCenterProps {
	position: LatLngTuple;
}

function ChangeCenter({ position }: IChangeCenterProps) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();
	useMapEvents({
		click: e => {
			navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
		},
	});
	return null;
}
