import { useDispatch, useSelector } from "react-redux";
import CartItem from "../kosarica/Cart/CartItem";
import { toggleCart } from "../../store/UI";
import { useEffect } from "react";

const Checkout = () => {
  const stavke = useSelector((state) => state.cart.stavke);
  const ukupnaCijena = useSelector((state) => state.cart.ukupnaCijenaStavki);
  const ukupnaKolicina = useSelector((state) => state.cart.ukupnaKolicina);
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(toggleCart())
  }, [])

  return (
    <>
    {stavke.length > 0 && <div>
      <h1>Stavke računa</h1>
      {stavke.map((knjiga) => {
        return <CartItem key={knjiga.isbn} knjiga={knjiga}></CartItem>;
      })}
      <br></br>
      <h3>Ukupna količina knjiga: {ukupnaKolicina}</h3>
      <h3>Ukupna cijena računa: ${ukupnaCijena}</h3>
      </div>}
      {stavke.length === 0 && <h3>Niste dodali nijednu knjigu u košaricu!</h3>}
    </>
  );
};

export default Checkout;
