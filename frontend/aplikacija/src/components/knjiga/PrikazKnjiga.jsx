import { useLoaderData } from "react-router-dom";
import Knjiga from "./knjiga";
import styles from "../knjiga/knjiga.module.css";
import { dohvatiToken } from "../autentifikacija/token";
import { useState } from "react";
const konfiguracija = require("../../konfiguracija.json");

export const PrikazKnjiga = () => {
  const [dohvaceneKnjige, setDohvaceneKnjige] = useState(useLoaderData());
  const [odabranaLista, setOdabranaLista] = useState("Food and Fitness");
  const [pretraga, setPretraga] = useState("");

  const vrsteListi = [
    "Food and Fitness",
    "E-Book Fiction",
    "Young Adult",
    "Animals",
    "Business Books",
  ];

  const upravljanjeOdabranomListom = async (vrsta) => {
    if (vrsta === odabranaLista) return;
    setOdabranaLista(vrsta);
    const lokalnoSpremiste = JSON.parse(
      localStorage.getItem(JSON.stringify(vrsta))
    );
    if (lokalnoSpremiste) {
      setDohvaceneKnjige(lokalnoSpremiste);
    } else {
      const prvoDohvacanje = await loaderKnjige(vrsta);
      setDohvaceneKnjige(prvoDohvacanje);
    }
  };

  const filtrirajKnjige = (knjige) => {
    if (pretraga === "") {
      return knjige;
    }

    return knjige.filter((knjiga) =>
      knjiga.naslov.toLowerCase().includes(pretraga.toLowerCase())
    );
  };

  return (
    <div>
      <div className={styles.headerContainer}>
        <h1>Kategorije: </h1>
        {vrsteListi.map((vrsta) => (
          <button
            key={vrsta}
            className={styles.button}
            onClick={() => upravljanjeOdabranomListom(vrsta)}
          >
            {vrsta}
          </button>
        ))}
      </div>
      <div className={styles.searchContainer}>
        <label htmlFor="pretraga">Pretraži knjige po naslovu: </label>
        <input
          id="pretraga"
          type="text"
          placeholder="Pretraži knjige"
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
        />
      </div>
      <div className={styles.knjigeContainer}>
        {filtrirajKnjige(dohvaceneKnjige).map((knjiga) => (
          <Knjiga key={knjiga.isbn} knjiga={knjiga}></Knjiga>
        ))}
      </div>
    </div>
  );
};

export async function loaderKnjige(vrsta) {
  const token = dohvatiToken();
  if (!token) {
    throw new Error("Morate biti prijavljeni kako bi pristupili resursu");
  }

  const spremljeneKnjigeString = localStorage.getItem(JSON.stringify(vrsta));
  if (spremljeneKnjigeString) {
    const spremljeneKnjige = JSON.parse(spremljeneKnjigeString);
    return spremljeneKnjige;
  } else if (typeof vrsta !== "string") {
    const spremljeneKnjigeString = localStorage.getItem(
      JSON.stringify("Food and Fitness")
    );
    if (spremljeneKnjigeString) {
      const spremljeneKnjige = JSON.parse(spremljeneKnjigeString);
      return spremljeneKnjige;
    }
  }

  let lista = "food-and-fitness";
  switch (vrsta) {
    case "Food and Fitness":
      lista = "food-and-fitness";
      break;
    case "E-Book Fiction":
      lista = "e-book-fiction";
      break;
    case "Young Adult":
      lista = "young-adult";
      break;
    case "Animals":
      lista = "animals";
      break;
    case "Business Books":
      lista = "business-books";
      break;
    default:
      lista = "food-and-fitness";
      break;
  }

  try {
    const odgovor = await fetch(
      `${konfiguracija.restAPI}knjige?lista=${lista}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const podaci = await odgovor.json();

    if (!odgovor.ok) {
      throw new Error(podaci.error);
    }

    const spremljeniPodaci = JSON.stringify(podaci.knjige);

    if (typeof vrsta === "string")
      localStorage.setItem(JSON.stringify(vrsta), spremljeniPodaci);
    else
      localStorage.setItem(
        JSON.stringify("Food and Fitness"),
        spremljeniPodaci
      );

    return podaci.knjige;
  } catch (error) {
    throw new Error(error);
  }
}
