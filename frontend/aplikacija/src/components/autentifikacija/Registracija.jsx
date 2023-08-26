import { Form, redirect } from "react-router-dom";
import styles from "./autentifikacija.module.css"
const konfiguracija = require("../../konfiguracija.json")

const Registracija = () => {
    return (
    <Form method="post" action="/registracija" className={styles.loginForm}>
      <label htmlFor="username">Korisničko ime </label>
      <input name="username" id="username" autoComplete="off" required></input>
      <br></br>
      <label htmlFor="password">Lozinka </label>
      <input
        name="password"
        id="password"
        type="password"
        autoComplete="new-password"
        required
      ></input>
        <label htmlFor="email">Email </label>
        <input name="email" id="email" autoComplete="off" required></input>
      <br></br>
      <button type="submit">Registracija</button>
    </Form>
    )
}


export async function actionRegistracija({ request }) {
    try {
        const podaci = await request.formData();
    
        const odgovor = await fetch(`${konfiguracija.restAPI}registracija`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            KorisnickoIme: podaci.get("username"),
            Lozinka: podaci.get("password"),
            Email: podaci.get("email")
          }),
        });
    
        if (!odgovor.ok) {
            const errorPoruka = await odgovor.json()
          throw new Error(errorPoruka.error);
        }

        return redirect("/prijava");
    } catch (error) {
        throw new Error(error.message);
    }
}

export default Registracija;