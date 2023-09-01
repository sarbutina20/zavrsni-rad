import styles from "./knjiga.module.css";
import ispunjenoSrce from "./ispunjenoSrce.png";
import neispunjenoSrce from "./neispunjenoSrce.png";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartReducer";
import { azurirajKosaricu } from "../kosarica/CartItem/CartItem";
import store from "../../store/store";
import { useNavigate } from "react-router-dom";
import { dodavanjeFavorita, brisanjeFavorita } from "../../store/favoritesReducer";

const Knjiga = ({ knjiga }) => {
  const ukupnaKolicina = useSelector((state) => state.cart.ukupnaKolicina);
  let favorites = useSelector((state) => state.favorites.favorites);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFavorite = favorites.find((favKnjiga) => favKnjiga === knjiga.isbn) !== undefined;
  if(favorites === null) favorites = localStorage.getItem("favorites");

  const toggleFavorite = () => {
    
    if (isFavorite) {
      dispatch(brisanjeFavorita(knjiga.isbn));
    } else {
      dispatch(dodavanjeFavorita(knjiga.isbn));
    }
  };


  const dodavanjeKosarica = () => {
    if (ukupnaKolicina >= 5) return alert("Maksimalno 5 knjiga u košarici");

    const { isbn, autor, naslov, opis, cijena } = knjiga;

    dispatch(addToCart({ isbn, autor, naslov, opis, cijena }));

    const trenutnaKosarica = store.getState().cart;

    azurirajKosaricu(trenutnaKosarica);
  };

  const detaljiHandler = () => {
    navigate(`/knjige/detalji`, { state: knjiga });
  };

  return (
    <div className={styles.knjiga} >
      <div onClick={detaljiHandler}>
        <h3>{knjiga.naslov}</h3>
        <h5>{knjiga.autor}</h5>
        <img src={knjiga.slika} alt={knjiga.naslov} className={styles.slikaKnjige}></img>
        <br></br>
        <h3>${knjiga.cijena}</h3>
      </div>
      <img className={styles.srceIkona} src={isFavorite ? ispunjenoSrce : neispunjenoSrce} alt={knjiga.slika} onClick={toggleFavorite}></img>
      <button onClick={dodavanjeKosarica}>Dodaj u košaricu</button>
    </div>
  );
};

export default Knjiga;
