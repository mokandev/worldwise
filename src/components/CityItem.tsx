import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { ICity, useCities } from '../contexts/CitiesContext';

interface ICityItemProps {
	city: ICity;
}

const formatDate = (date: Date) =>
	new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(new Date(date));

export default function CityItem({ city }: ICityItemProps) {
	const { currentCity, deleteCity } = useCities();

	const { id: currentCityId } = currentCity as ICity;
	const { cityName, emoji, date, id, position } = city;

	async function handleDelete(e: React.SyntheticEvent) {
		e.preventDefault();

		await deleteCity(city.id);
	}

	return (
		<li>
			<Link to={`${id}?lat=${position.lat}&lng=${position.lng}`} className={`${styles.cityItem}  ${id === currentCityId ? styles['cityItem--active'] : ''}`}>
				<span className={styles.emoji}>{emoji}</span>
				<h3 className={styles.name}>{cityName}</h3>
				<time className={styles.date}>{formatDate(date)}</time>
				<button className={styles.deleteBtn} onClick={handleDelete}>
					&times;{' '}
				</button>
			</Link>
		</li>
	);
}
