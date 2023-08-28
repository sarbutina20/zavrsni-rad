import { useLoaderData } from "react-router-dom";
import Knjiga from "./knjiga";
import styles from "../knjiga/knjiga.module.css";
import { dohvatiToken } from "../autentifikacija/token";
const konfiguracija = require("../../konfiguracija.json");

export const PrikazKnjiga = () => {
  const dohvaceneKnjige = useLoaderData();

  return (
    <div className={styles.knjigeContainer}>
      {dohvaceneKnjige.map((knjiga) => (
        <Knjiga key={knjiga.isbn} knjiga={knjiga}></Knjiga>
      ))}
    </div>
  );
};

export async function loaderKnjige() {
  const token = dohvatiToken();
  if (!token) {
    throw new Error("Morate biti prijavljeni kako bi pristupili resursu");
  }

  const spremljeneKnjigeString = localStorage.getItem("knjige");
  if (spremljeneKnjigeString) {
    const spremljeneKnjige = JSON.parse(spremljeneKnjigeString);
    return spremljeneKnjige;
  }
  
  try {

    const odgovor = await fetch(`${konfiguracija.restAPI}knjige`, {
      headers: {
        Authorization: token,
      },
    });

    const podaci = await odgovor.json();

    if (!odgovor.ok) {
      throw new Error(podaci.error);
    }

    const spremljeniPodaci = JSON.stringify(podaci.knjige);
    localStorage.setItem("knjige", spremljeniPodaci);

    return podaci.knjige;
  } catch (error) {
    throw new Error(error);
  }
}
