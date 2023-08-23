import { useLoaderData } from "react-router-dom";
import Knjiga from "./knjiga";
import styles from "../knjiga/knjiga.module.css"


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
    //const nazivKategorije = "non-fiction";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTI3MzUwODksImV4cCI6MTY5MjczODY4OX0.R_oTt8clvMAU3MGZE2kx0fPSntbCFw9T5cWkC33i724";
    const odgovor = await fetch(
      `http://localhost:5000/api/knjige`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!odgovor.ok) {
      console.error(odgovor.error);
      throw new Error(odgovor.error);
    }

    const podaci = odgovor.json();
    return podaci;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
