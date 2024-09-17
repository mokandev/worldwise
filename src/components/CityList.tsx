import { ICity } from "../App";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

interface ICityListProps {
  isLoading: Boolean;
  cities: ICity[];
}

export default function CityList({ cities, isLoading }: ICityListProps) {
  if (isLoading) return <Spinner />;

  if(!cities.length) return <Message message="Add your first city by clicking in a city on the map" />
  return <ul className={styles.cityList}>{
    cities.map((city: ICity) => <CityItem city={city} key={city.id} />)
  }</ul>;
}
