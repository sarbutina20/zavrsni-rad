import classes from "./CartButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../../../store/UI";
import cartIcon from "../UI/cartIcon.png";

const CartButton = (props) => {
  const dispatch = useDispatch();

  const toggleCartHandler = () => {
    dispatch(toggleCart());
  };

  const brojStavki = useSelector((state) => state.cart.ukupnaKolicina);

  return (
    <button className={classes.button} onClick={toggleCartHandler}>
      <div className={classes.cartButtonContent}>
        <img
          src={cartIcon}
          alt="Košarica"
          className={classes.cartIcon}
        ></img>
        <span className={classes.badge}>{brojStavki}</span>
      </div>
    </button>
  );
};

export default CartButton;
