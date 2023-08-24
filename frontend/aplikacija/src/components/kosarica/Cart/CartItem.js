import { useDispatch } from 'react-redux';
import classes from './CartItem.module.css';
import { addToCart, removeFromCart } from '../../../store/cartReducer';

const CartItem = ({knjiga}) => {
  const { isbn, naslov, autor, opis, cijena, ukupnaCijena, kolicina } = knjiga;

  const dispatch = useDispatch();
    

  const dodavanjeKosarica = () => {

      dispatch(addToCart({isbn, autor, naslov, opis, cijena}))
  }

  const brisanjeKosarica = () => {
    dispatch(removeFromCart({isbn}))
  }

  return (
    <li className={classes.item}>
      <header>
        <h3>{naslov}</h3>
        <div className={classes.price}>
          ${ukupnaCijena}{' '}
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

export default CartItem;
