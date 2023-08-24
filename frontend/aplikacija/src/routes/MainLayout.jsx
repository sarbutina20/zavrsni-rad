import { Outlet } from "react-router-dom";
import Navigacija from "./Navigacija/Navigacija";
import { useSelector } from "react-redux";
import Cart from "../components/kosarica/Cart/Cart";


export default function MainLayout() {
  const showCart = useSelector(state => state.UI.showCart)
  return (
    <>
      
      <Navigacija></Navigacija>
      {showCart && <Cart></Cart>}
      <Outlet></Outlet>
    </>
  );
}
