import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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

interface ICitiesContext {
  cities: ICity[];
  isLoading: boolean;
  currentCity: ICity | NonNullable<unknown>,
  getCity: (id: string) => Promise<void>;
}

const defaultContextValue: ICitiesContext = {
  cities: [],
  isLoading: false,
  currentCity: {},
  getCity: async () => {},
};

const CitiesContext = createContext<ICitiesContext>(defaultContextValue);

const BASE_URL = "http://localhost:8000";

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
      alert("There was an error loading data..");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCities();
  }, []);

  const getCity = async (id: string) => {
    setCurrentCity({})
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("There was an error loading data..");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
};

export { CitiesProvider, useCities };
