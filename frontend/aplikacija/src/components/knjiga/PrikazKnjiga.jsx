import { useLoaderData } from "react-router-dom";
import Knjiga from "./knjiga";
import styles from "../knjiga/knjiga.module.css"
import {dohvatiToken} from "../autentifikacija/token"


export const PrikazKnjiga = () => {
  const dohvaceneKnjige = useLoaderData();

  return (
    <div className={styles.knjigeContainer}>
      
      {dohvaceneKnjige.knjige.map((knjiga) => (
        <Knjiga key={knjiga.slika} knjiga={knjiga}></Knjiga>
      ))}
      
    </div>
  );
};

export async function loaderKnjige() {
  try {
    /*const token = dohvatiToken();
    if(!token) {
      throw new Error("Morate biti prijavljeni kako bi pristupili resursu")
    } */
    
    const odgovor = await fetch(
      `http://localhost:5000/api/knjige`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!odgovor.ok) {
      throw new Error(odgovor.error);
    }

    const podaci = odgovor.json();
    return podaci;
  } catch (error) {
    throw new Error(error.message);
  }
}
