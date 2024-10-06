import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { LatLngTuple } from 'leaflet';
import { ICity, useCities } from '../contexts/CitiesContext';
export default function Map() {
	const navigate = useNavigate();
	const [mapPosition, setMapPosition] = useState<LatLngTuple>([40, 0]);
	const [searchParams] = useSearchParams();
	const { cities } = useCities();

	const mapLat = Number(searchParams.get('lat'));
	const mapLng = Number(searchParams.get('lng'));

	useEffect(() => {
		if (mapLat && mapLng) {
			setMapPosition([mapLat, mapLng]);
		}
	}, [mapLat, mapLng]);

	return (
		<div className={styles.mapContainer}>
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
			navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
		},
	});
	return null;
}
