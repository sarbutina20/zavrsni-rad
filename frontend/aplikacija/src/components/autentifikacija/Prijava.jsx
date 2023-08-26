import { Form, redirect, useActionData } from "react-router-dom";
import styles from "./autentifikacija.module.css";
import Button from "../UI/Button/Button";
import { validacijaPrijava } from "../../validacija";

const konfiguracija = require("../../konfiguracija.json");

export const Prijava = () => {
  const errorPoruke = useActionData();
  return (
    <>
      {errorPoruke && (
        <div className={styles.errorPoruka}>
          <h3>Pogreška!</h3>
          {errorPoruke.map((errorPoruka, index) => (
            <p key={index}>{errorPoruka}</p>
          ))}
        </div>
      )}
      <Form method="post" className={styles.loginForm}>
        <label htmlFor="username">Korisničko ime </label>
        <input
          name="username"
          id="username"
          autoComplete="off"
          required
        ></input>
        <br></br>
        <label htmlFor="password">Lozinka </label>
        <input
          name="password"
          id="password"
          type="password"
          autoComplete="new-password"
          required
        ></input>
        <br></br>
        <Button>Prijava</Button>
      </Form>
    </>
  );
};

export const actionPrijava = async ({ request }) => {
  try {
    const podaci = await request.formData();

    const KorisnickoIme = podaci.get("username");
    const Lozinka = podaci.get("password");

    const validacijaPodataka = validacijaPrijava({
      KorisnickoIme,
      Lozinka,
    });
    if (validacijaPodataka) return validacijaPodataka;

    const odgovor = await fetch(`${konfiguracija.restAPI}prijava`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        KorisnickoIme,
        Lozinka,
      }),
    });

    if (!odgovor.ok) {
      const errorPoruka = await odgovor.json();
      const polje = [errorPoruka.error];
      return polje;
    }

    const vraceniOdgovor = await odgovor.json();
    const token = vraceniOdgovor.token;

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/;`;

    return redirect("/");
  } catch (error) {
    throw new Error(error.message);
  }
};
