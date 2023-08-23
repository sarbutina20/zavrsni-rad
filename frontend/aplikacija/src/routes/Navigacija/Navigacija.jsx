import { NavLink } from "react-router-dom";
import styles from "./Navigacija.module.css";

const Navigacija = () => {
  return (
    <ul className={styles.navTraka}>
      <li className={styles.navElement}>
        <NavLink to="/" className={styles.navLink}>
          Naslovna
        </NavLink>
      </li>
      <li className={styles.navElement}>
        <NavLink to="/knjige" className={styles.navLink}>
          Knjige
        </NavLink>
      </li>
      <li className={styles.navElement}>
        <NavLink to="/prijava" className={styles.navLink}>
          Prijava
        </NavLink>
      </li>
      <li className={styles.navElement}>
        <NavLink to="/registracija" className={styles.navLink}>
          Registracija
        </NavLink>
      </li>
    </ul>
  );
};

export default Navigacija;
