import { useSelector } from 'react-redux';
import Card from '../UI/Card';
import classes from './Cart.module.css';
import CartItem from './CartItem';

const Cart = (props) => {
  
  const stavke = useSelector(state => state.cart.stavke)
  console.log(stavke);
  const ukupnaCijenaStavki = useSelector(state => state.cart.ukupnaCijenaStavki)
  const ukupnaKolicina = useSelector(state => state.cart.ukupnaKolicina)
  
  return (
    <Card className={classes.cart}>
      <h2>Vaša košarica</h2>
      {stavke && <ul>
        {stavke.map((knjiga) => (
          <CartItem key={knjiga.isbn} knjiga={knjiga}></CartItem>
        ))}
        <li>Ukupna cijena svih stavki: ${ukupnaCijenaStavki}</li>
        <li>Ukupna količina stavki: {ukupnaKolicina}</li>
      </ul>}
      {!stavke && <p>Nema knjiga u košarici!</p>}
      
    </Card>
  );
};

export default Cart;
