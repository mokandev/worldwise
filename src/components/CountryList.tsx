import { useCities } from "../contexts/CitiesContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";


interface ICountry {
  country: string
  emoji: string
  id: number
}

export default function CountryList() {
  const {cities, isLoading} = useCities();

  if (isLoading) return <Spinner />;

  const countries: ICountry[] = cities.reduce<ICountry[]>(
    (arr, city) => {
      if (!arr.some((el) => el.country === city.country)) {
        return [
          ...arr,
          {
            country: city.country,
            emoji: city.emoji,
            id: city.id, 
          },
        ];
      }
      return arr;
    },
    [] 
  );


  if (!cities.length)
    return (
      <Message message="Add your first city by clicking in a city on the map" />
    );
  return (
    <ul className={styles.countryList}>
      {countries.map((country: ICountry) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}
