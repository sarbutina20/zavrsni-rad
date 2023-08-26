import { useSelector } from "react-redux";
import { dohvatiToken } from "../autentifikacija/token";
import styles from "../UI/Modal/Modal.module.css";
const konfiguracija = require("../../konfiguracija.json");

const PayButton = () => {
  const stavke = useSelector((state) => state.cart.stavke);

  const checkoutHandler = async () => {
    const token = dohvatiToken();
    if (!token) {
      throw new Error("Morate biti prijavljeni kako bi pristupili resursu");
    }

    const stavkeBezOpisa = stavke.map((stavka) => ({
      isbn: stavka.isbn,
      autor: stavka.autor,
      naslov: stavka.naslov,
      cijena: stavka.cijena,
      ukupnaCijena: stavka.cijena,
      kolicina: stavka.kolicina,
    }));

    try {
      const odgovor = await fetch(`${konfiguracija.restAPI}narudzbe`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          narudzba: stavkeBezOpisa,
        }),
      });

      const podaci = await odgovor.json();
      window.location.href = podaci.url;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <>
      <button className={styles.navLink} onClick={() => checkoutHandler()}>
        Naruči knjige
      </button>
    </>
  );
};

export default PayButton;
