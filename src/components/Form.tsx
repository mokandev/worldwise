// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Message from './Message';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { INewCity, useCities } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

export function convertToEmoji(countryCode: string) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

interface ICityData {
	latitude: number;
	lookupSource: string;
	longitude: number;
	localityLanguageRequested: string;
	continent: string;
	continentCode: string;
	countryName: string;
	countryCode: string;
	principalSubdivision: string;
	principalSubdivisionCode: string;
	city: string;
	locality: string;
	postcode: string;
	plusCode: string;
}

function Form() {
	const [lat, lng] = useUrlPosition();
	const { createCity, isLoading } = useCities();
	const navigate = useNavigate();

	const [cityName, setCityName] = useState('');
	const [country, setCountry] = useState('');
	const [date, setDate] = useState<Date>(new Date());
	const [notes, setNotes] = useState('');
	const [isLoadingGeocoding, setIsLoadingGeocoding] = useState<boolean>(false);
	const [emoji, setEmoji] = useState('');
	const [geocodingError, setGeocodingError] = useState('');

	useEffect(() => {
		if (!lat && !lng) return;
		async function fetchCityData() {
			try {
				setIsLoadingGeocoding(true);
				const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
				const data: ICityData = await res.json();
				if (!data.countryCode) throw new Error("That doesn't seem to be a city. Click somewhere else 😉");

				setGeocodingError('');
				setCityName(data.city || data.locality || '');
				setCountry(data.countryName);
				setEmoji(convertToEmoji(data.countryCode));
			} catch (error) {
				setGeocodingError((error as Error).message);
			} finally {
				setIsLoadingGeocoding(false);
			}
		}
		fetchCityData();
	}, [lat, lng]);

	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		if (!cityName || !date) return;

		const newCity: INewCity = {
			cityName,
			country,
			emoji,
			date,
			notes,
			position: { lat: Number(lat), lng: Number(lng) },
		};

		await createCity(newCity);
		navigate('/app/cities');
	}

	if (isLoadingGeocoding) return <Spinner />;
	if (!lat && !lng) return <Message message='Start by clicking in the map' />;
	if (geocodingError) return <Message message={geocodingError} />;

	return (
		<form className={`${styles.form}  ${isLoading ? styles.loading : ''} `} onSubmit={handleSubmit}>
			<div className={styles.row}>
				<label htmlFor='cityName'>City name</label>
				<input id='cityName' onChange={e => setCityName(e.target.value)} value={cityName} />
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor='date'>When did you go to {cityName}?</label>
				<DatePicker id='date' onChange={date => setDate(date as Date)} selected={date} dateFormat='dd/MM/yyyy' />
			</div>

			<div className={styles.row}>
				<label htmlFor='notes'>Notes about your trip to {cityName}</label>
				<textarea id='notes' onChange={e => setNotes(e.target.value)} value={notes} />
			</div>

			<div className={styles.buttons}>
				<Button onClick={handleSubmit} type='primary'>
					Add
				</Button>
				<BackButton />
			</div>
		</form>
	);
}

export default Form;
