import styles from "./knjiga.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartReducer";
import { azurirajKosaricu } from "../kosarica/CartItem/CartItem";
import store from "../../store/store";

const Knjiga = ({ knjiga }) => {
  const ukupnaKolicina = useSelector((state) => state.cart.ukupnaKolicina);
  const dispatch = useDispatch();

  const dodavanjeKosarica = () => {
    
    if(ukupnaKolicina >= 5) return alert("Maksimalno 5 knjiga u košarici");

    const { isbn, autor, naslov, opis, cijena } = knjiga;

    dispatch(addToCart({ isbn, autor, naslov, opis, cijena }));

    const trenutnaKosarica = store.getState().cart;

    azurirajKosaricu(trenutnaKosarica);

  };

  return (
    <div className={styles.knjiga}>
      <h3>{knjiga.naslov}</h3>
      <h5>{knjiga.autor}</h5>
      <img src={knjiga.slika} alt={knjiga.naslov}></img>
      <br></br>
      <h3>${knjiga.cijena}</h3>

      <button onClick={dodavanjeKosarica}>Dodaj u košaricu</button>
    </div>
  );
};

export default Knjiga;
