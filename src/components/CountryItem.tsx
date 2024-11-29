import styles from "./CountryItem.module.css";
import { ICountry } from "./CountryList";

interface ICountryItemProps {
  country: ICountry
}

function CountryItem({ country }: ICountryItemProps) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
