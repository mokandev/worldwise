import { createContext, FC, ReactNode, useContext, useEffect, useReducer } from 'react';

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

interface IState {
	cities: ICity[];
	isLoading: boolean;
	currentCity: ICity | NonNullable<unknown>;
	error: string;
}

interface IAction {
	type: 'cities/loaded' | 'cities/created' | 'cities/deleted' | 'loading' | 'rejected' | 'city/loaded';
  payload?: ICity[] | ICity | number | string;
}

const initialState: IState = {
	cities: [],
	isLoading: false,
	currentCity: {} as ICity,
	error: '',
};

function reducer(state: IState, action: IAction): IState  {
	switch (action.type) {
		case 'loading':
			return {
				...state,
				isLoading: true,
			};

		case 'cities/loaded':
			return {
				...state,
				isLoading: false,
				cities: action.payload as ICity[],
			};

		case 'city/loaded':
			return {
				...state,
        isLoading: false,
				currentCity: action.payload as ICity,
			};

		case 'cities/created':
			return {
				...state,
        isLoading: false,
				cities: [...state.cities, action.payload] as ICity[],
			};

		case 'cities/deleted':
			return {
				...state,
        isLoading: false,
				cities: state.cities.filter(city => city.id !== action.payload),
			};

		case 'rejected':
			return {
				...state,
				isLoading: false,
				error: action.payload as string,
			};

		default:
			throw new Error('Unknown action type');
	}
}

const CitiesProvider: FC<ICitiesProviderProps> = ({ children }) => {
	const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState);
	async function fetchCities() {
		dispatch({ type: 'loading' });
		try {
			const res = await fetch(`${BASE_URL}/cities`);
			const data = await res.json();
			dispatch({ type: 'cities/loaded', payload: data });
		} catch {
			dispatch({ type: 'rejected', payload: 'There was an error loading data..' });
		}
	}

	useEffect(() => {
		fetchCities();
	}, []);

	const getCity = async (id: string) => {
		dispatch({ type: 'loading' });
		try {
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			dispatch({ type: 'city/loaded', payload: data });
		} catch {
			dispatch({ type: 'rejected', payload: 'There was an error loading data..' });
		}
	};

	const createCity = async (newCity: INewCity) => {
		dispatch({ type: 'loading' });
		try {
			const res = await fetch(`${BASE_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(newCity),
				headers: { 'Content-Type': 'application/json' },
			});
			const data = await res.json();

			dispatch({ type: 'cities/created', payload: data });
		} catch {
			dispatch({ type: 'rejected', payload: 'There was an error creating city..' });
		}
	};

	const deleteCity = async (id: number) => {
		try {
			dispatch({ type: 'loading' });
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: 'DELETE',
			});

			dispatch({ type: 'cities/deleted', payload: id });
		} catch (error) {
			dispatch({ type: 'rejected', payload: 'There was an error deleting city..' });
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
