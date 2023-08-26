import styles from "./knjiga.module.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartReducer";

const Knjiga = ({ knjiga }) => {
  const dispatch = useDispatch();

  const dodavanjeKosarica = () => {
    const { isbn, autor, naslov, opis, cijena } = knjiga;

    dispatch(addToCart({ isbn, autor, naslov, opis, cijena }));
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
