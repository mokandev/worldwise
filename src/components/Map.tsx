import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useState } from 'react';
import { LatLngTuple } from 'leaflet';
import { ICity, useCities } from '../contexts/CitiesContext';
export default function Map() {
	const navigate = useNavigate();
	const [mapPosition, setMapPosition] = useState<LatLngTuple>([40, 0]);
	const [searchParams, setSearchParams] = useSearchParams();
	const { cities } = useCities();

	const lat = searchParams.get('lat');
	const lng = searchParams.get('lng');

	return (
		<div className={styles.mapContainer} onClick={() => navigate('form')}>
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
			</MapContainer>
		</div>
	);
}
