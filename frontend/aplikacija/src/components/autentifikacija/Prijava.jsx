import { Form, redirect } from "react-router-dom";
import styles from "./autentifikacija.module.css"

export const Prijava = () => {
  return (
    <Form method="post" className={styles.loginForm}>
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
      <br></br>
      <button type="submit">Prijava</button>
    </Form>
  );
};

export const actionPrijava = async ({ request }) => {
  try {
    const podaci = await request.formData();

    const odgovor = await fetch("http://localhost:5000/api/prijava", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        KorisnickoIme: podaci.get("username"),
        Lozinka: podaci.get("password"),
      }),
    });

    if (!odgovor.ok) {
        const errorPoruka = await odgovor.json()
      throw new Error(errorPoruka.error);
    }

    const vraceniToken = await odgovor.json();
    const token = vraceniToken.token

    const expirationDate = new Date();
    //expirationDate.setHours(expirationDate.getHours() + 1);
    expirationDate.setTime(expirationDate.getTime() + 30000);
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
    
    return redirect("/");
  } catch (error) {
    throw new Error(error.message);
  }
};
