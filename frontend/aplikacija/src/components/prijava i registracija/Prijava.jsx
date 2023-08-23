import { Form, redirect } from "react-router-dom";

export const Prijava = () => {
  return (
    <Form method="post">
      <label htmlFor="username">Korisničko ime: </label>
      <input name="username" id="username" autoComplete="off" required></input>
      <br></br>
      <label htmlFor="password">Lozinka: </label>
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
        const errorPoruka = odgovor.json()
      throw new Error(errorPoruka);
    }

    const vraceniToken = await odgovor.json();
    const token = vraceniToken.token

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
    
    return redirect("/");
  } catch (error) {
    console.error(error);
    throw new Error("Prijava nije uspjela");
  }
};
