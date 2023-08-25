require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const restKorisnici = require("./restKorisnici.js");
const restKnjige = require("./restKnjige.js");
const konfiguracija = require("./konfiguracija.json");
const { MongoClient } = require("mongodb");
const jwt = require("./jwt.js");

const app = express();
const port = konfiguracija.port;

function pokreniServer() {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  pripremaPutanja();

  app.use((zahtjev, odgovor) => {
    odgovor.status(404);
    let poruka = { greska: "Stranica nije pronađena!" };
    odgovor.json(poruka);
  });

  app.listen(port, () => {
    console.log(`Server pokrenut na portu: ${port}`);
  });
}

const pripremaPutanja = () => {

  app.post("/api/prijava", restKorisnici.prijava);
  app.post("/api/registracija", restKorisnici.registracija);

  app.get("/api/korisnici/:id", jwt.verificirajToken, restKorisnici.korisnik);

  app.get("/api/knjige", jwt.verificirajToken, restKnjige.knjige);

  app.get("/api/bazaKnjige", jwt.verificirajToken, restKnjige.bazaKnjige);

  app.get("/api/narudzbe", jwt.verificirajToken, restKnjige.narudzbe);
  app.post("/api/narudzbe", jwt.verificirajToken, restKnjige.narudzbe);
  app.post("/api/stripe/webhook",express.raw({ type: "application/json" }),restKnjige.webhooks);
};

pokreniServer();
