import {useSelector } from "react-redux";
import {dohvatiToken} from "../autentifikacija/token"
import styles from "../UI/Modal.module.css"


const PayButton = ({ cartItems }) => {
  const stavke = useSelector((state) => state.cart.stavke);

  const handleCheckout = async () => {
    const token = dohvatiToken();
      if (!token) {
        throw new Error("Morate biti prijavljeni kako bi pristupili resursu");
      }

      const stavkeBezOpisa = stavke.map(stavka => ({
        isbn: stavka.isbn,
        autor: stavka.autor,
        naslov: stavka.naslov,
        cijena: stavka.cijena,
        ukupnaCijena: stavka.cijena,
        kolicina: stavka.kolicina
      }))

    try {
      const odgovor = await fetch("http://localhost:5000/api/narudzbe", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          narudzba: stavkeBezOpisa
        }),
      });
  
      const podaci = await odgovor.json()
      const url = podaci.url;

      
      
      window.location.href = url;
    } catch (error) {
      throw new Error(error.message)
    }
    
  };

  return (
    <>
      <button className={styles.navLink} onClick={() => handleCheckout()}>Naruči knjige</button>
    </>
  );
};

export default PayButton;
