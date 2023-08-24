import { NavLink, useRouteLoaderData } from "react-router-dom";
import { Form } from "react-router-dom";
import styles from "./Navigacija.module.css";
import CartButton from "../../components/kosarica/Cart/CartButton";

const Navigacija = () => {
  const token = useRouteLoaderData("root");

  return (
    <ul className={styles.navTraka}>
      <li className={styles.navElement}>
        <NavLink to="/" className={styles.navLink}>
          Naslovna
        </NavLink>
      </li>
      {token && (
        <li className={styles.navElement}>
          <NavLink to="/knjige" className={styles.navLink}>
            Knjige
          </NavLink>
        </li>
      )}
      {!token && (
        <li className={styles.navElement}>
          <NavLink to="/prijava" className={styles.navLink}>
            Prijava
          </NavLink>
        </li>
      )}
      {!token && (
        <li className={styles.navElement}>
          <NavLink to="/registracija" className={styles.navLink}>
            Registracija
          </NavLink>
        </li>
      )}
      {token && (
        <li>
          <Form method="post" action="/odjava">
            <button type="submit">Odjava</button>
          </Form>
        </li>
      )}
       {token && (
        <li className={styles.cartButton}>
          <CartButton></CartButton>
        </li>
      )}
    </ul>
  );
};

export default Navigacija;
