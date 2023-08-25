import {useSelector } from "react-redux";
import {dohvatiToken} from "../autentifikacija/token"


const PayButton = ({ cartItems }) => {
  const narudzba = useSelector((state) => state.cart.stavke);

  const handleCheckout = async () => {
    const token = dohvatiToken();
      if (!token) {
        throw new Error("Morate biti prijavljeni kako bi pristupili resursu");
      }

    try {
      const odgovor = await fetch("http://localhost:5000/api/narudzbe", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          narudzba: narudzba
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
      <button onClick={() => handleCheckout()}>Naruči knjige</button>
    </>
  );
};

export default PayButton;
