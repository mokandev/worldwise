import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './pages/AppLayout';
import Homepage from './pages/Homepage';
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login';
import CityList from './components/CityList';
import { useEffect, useState } from 'react';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';

const BASE_URL = 'http://localhost:8000';

export interface ICity {
	cityName: string;
	country: string;
	emoji: string;
	date: string;
	notes: string;
	position: {
		lat: number;
		lng: number;
	};
	id: number;
}

export default function App() {
	const [cities, setCities] = useState<ICity[]>([]);
	const [isLoading, setIsLoading] = useState(false);

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

	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Homepage />} />
				<Route path='product' element={<Product />} />
				<Route path='pricing' element={<Pricing />} />
				<Route path='login' element={<Login />} />
				<Route path='app' element={<AppLayout />}>
					<Route index element={<CityList cities={cities} isLoading={isLoading} />} />
					<Route path='cities' element={<CityList cities={cities} isLoading={isLoading} />} />
          <Route path="cities/:id" element={<City />} />
					<Route path='countries' element={<CountryList cities={cities} isLoading={isLoading} />} />
					<Route path='form' element={<Form />} />
				</Route>
				<Route path='*' element={<PageNotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
