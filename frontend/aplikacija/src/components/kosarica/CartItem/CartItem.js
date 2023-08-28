import { useDispatch } from "react-redux";
import classes from "./CartItem.module.css";
import { addToCart, removeFromCart } from "../../../store/cartReducer";
import { dohvatiToken } from "../../autentifikacija/token";
import store from "../../../store/store";
const konfiguracija = require("../../../konfiguracija");

const CartItem = ({ knjiga }) => {
  const { isbn, naslov, autor, opis, cijena, ukupnaCijena, kolicina } = knjiga;

  const dispatch = useDispatch();

  const dodavanjeKosarica = () => {
    dispatch(addToCart({ isbn, autor, naslov, opis, cijena }));

    const trenutnaKosarica = store.getState().cart;
    

    azurirajKosaricu(trenutnaKosarica);
  };

  const brisanjeKosarica = () => {
    dispatch(removeFromCart({ isbn }));

    const trenutnaKosarica = store.getState().cart;
    

    azurirajKosaricu(trenutnaKosarica);
  };

  return (
    <li className={classes.item}>
      <header>
        <h3>{naslov}</h3>
        <div className={classes.price}>
          ${ukupnaCijena}{" "}
          <span className={classes.itemprice}>(${cijena} / po knjizi)</span>
        </div>
      </header>
      <div className={classes.details}>
        <div className={classes.quantity}>
          x <span>{kolicina}</span>
        </div>
        <div className={classes.actions}>
          <button onClick={brisanjeKosarica}>-</button>
          <button onClick={dodavanjeKosarica}>+</button>
        </div>
      </div>
    </li>
  );
};

export const azurirajKosaricu = async (kosarica) => {
  const token = dohvatiToken();
  if (!token) {
    throw new Error("Morate biti prijavljeni kako bi pristupili resursu");
  }
  try {
    const odgovor = await fetch(`${konfiguracija.restAPI}kosarica`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(kosarica),
    });

    const podaci = await odgovor.json();
    

    if (!odgovor.ok) {
      throw new Error(podaci.error);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export default CartItem;
