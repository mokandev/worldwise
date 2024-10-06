import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

export interface ICity {
	cityName: string;
	country: string;
	emoji: string;
	date: Date;
	notes: string;
	position: {
		lat: number;
		lng: number;
	};
	id: number;
}

export interface INewCity {
	cityName: string;
	country: string;
	emoji: string;
	date: Date;
	notes: string;
	position: {
		lat: number;
		lng: number;
	};
}

interface ICitiesContext {
	cities: ICity[];
	isLoading: boolean;
	currentCity: ICity | NonNullable<unknown>;
	getCity: (id: string) => Promise<void>;
	createCity: (newCity: INewCity) => Promise<void>;
	deleteCity: (id: number) => Promise<void>;
}

const defaultContextValue: ICitiesContext = {
	cities: [],
	isLoading: false,
	currentCity: {},
	getCity: async () => {},
	createCity: async () => {},
	deleteCity: async () => {},
};

const CitiesContext = createContext<ICitiesContext>(defaultContextValue);

const BASE_URL = 'http://localhost:8000';

interface ICitiesProviderProps {
	children: ReactNode;
}

const CitiesProvider: FC<ICitiesProviderProps> = ({ children }) => {
	const [cities, setCities] = useState<ICity[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

	async function fetchCities() {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities`);
			const data = await res.json();
			setCities(data);
		} catch {
			alert('There was an error loading data..');
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchCities();
	}, []);

	const getCity = async (id: string) => {
		setCurrentCity({});
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			setCurrentCity(data);
		} catch {
			alert('There was an error loading data..');
		} finally {
			setIsLoading(false);
		}
	};

	const createCity = async (newCity: INewCity) => {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(newCity),
				headers: { 'Content-Type': 'application/json' },
			});
			const data = await res.json();

			setCities(cities => [...cities, data]);
		} catch {
			alert('There was an error creating city..');
		} finally {
			setIsLoading(false);
		}
	};

	const deleteCity = async (id: number) => {
		try {
			setIsLoading(true);
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: 'DELETE',
			});

			setCities(cities => cities.filter(city => city.id !== id));
		} catch (error) {
			alert('There was an error deleting city..');
		} finally {
			setIsLoading(false);
		}
	};

	return <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity, createCity, deleteCity }}>{children}</CitiesContext.Provider>;
};

const useCities = () => {
	const context = useContext(CitiesContext);
	if (context === undefined) throw new Error('CitiesContext was used outside the CitiesProvider');
	return context;
};

export { CitiesProvider, useCities };
