import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";

export interface ICity {
  cityName: string
  country: string
  emoji: string
  date: string
  notes: string
  position: {
    lat: number,
    lng: number
  },
  id: number
}

interface ICitiesContext {
  cities: ICity[]
  isLoading: boolean
}

const defaultContextValue: ICitiesContext = {
  cities: [],
  isLoading: false,
};

const CitiesContext = createContext<ICitiesContext>(defaultContextValue);

const BASE_URL = "http://localhost:8000"

interface ICitiesProviderProps {
  children: ReactNode
}



const CitiesProvider: FC<ICitiesProviderProps> = ({ children }) => {
    const [cities, setCities] = useState<ICity[]>([]);
    const [isLoading, setIsLoading] = useState(false)
  
    async function fetchCities() {
      try {
        setIsLoading(true)
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        setCities(data)
  
      } catch {
        alert("There was an error loading data..")
      } finally {
        setIsLoading(false)
      }
    }
  
    useEffect(() => {
      fetchCities()
    },[])

    return (
        <CitiesContext.Provider value={{cities, isLoading}}>{children}</CitiesContext.Provider>
    )
}

const useCities = () => {
  const context = useContext(CitiesContext);
  if(context === undefined) throw new Error("CitiesContext was used outside the CitiesProvider")
  return context
}

export {CitiesProvider, useCities}