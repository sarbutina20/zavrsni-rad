import { useLoaderData } from "react-router-dom";
import Knjiga from "./knjiga";
import styles from "../knjiga/knjiga.module.css"
import {dohvatiToken} from "../autentifikacija/token"


export const PrikazKnjiga = () => {
  const dohvaceneKnjige = useLoaderData();

  return (
    <div className={styles.knjigeContainer}>
      
      {dohvaceneKnjige.knjige.map((knjiga) => (
        <Knjiga key={knjiga.isbn} knjiga={knjiga}></Knjiga>
      ))}
      
    </div>
  );
};

export async function loaderKnjige() {
  try {
    const token = dohvatiToken();
    if(!token) {
      throw new Error("Morate biti prijavljeni kako bi pristupili resursu")
    }
    
    const odgovor = await fetch(
      `http://localhost:5000/api/knjige`,
      {
        headers: {
          Authorization: token
        },
      }
    );

    if (!odgovor.ok) {
      const errorMessage = await odgovor.json()
      throw new Error(errorMessage.error);
    }

    const podaci = odgovor.json();
    return podaci;
  } catch (error) {
    throw new Error(error.message);
  }
}
