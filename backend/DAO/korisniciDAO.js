const { ObjectId } = require("mongodb");
const Baza = require("./baza.js");
const bcrypt = require("bcrypt");
const jwt = require("../jwt.js");

class KorisniciDAO {
  constructor() {
    this.baza = new Baza();
  }

  async prijava(korisnik) {
    try {
      const db = await this.baza.poveziSeNaBazu();
      const baza = db.database;
      const korisniciKolekcija = baza.collection("korisnici");
      const ulogeKolekcija = baza.collection("uloge");
      const kosaricaKolekcija = baza.collection("kosarica")

      const dohvaceniKorisnik = await korisniciKolekcija.findOne({
        KorisnickoIme: korisnik.KorisnickoIme,
      });

      if (!dohvaceniKorisnik) {
        console.error("Ne postoji korisnik s takvim korisničkim imenom.");
        db.prekiniVezu();
        return { error: "Ne postoji korisnik s takvim korisničkim imenom." };
      }

      const lozinkaUsporedba = await bcrypt.compare(
        korisnik.Lozinka,
        dohvaceniKorisnik.Lozinka
      );

      if (lozinkaUsporedba) {
        const uloga = await ulogeKolekcija.findOne({
          _id: dohvaceniKorisnik.Uloga_ID,
        });

        const kosarica = await kosaricaKolekcija.findOne({
          Korisnik_ID: korisnik._id,
        });
        
        const token = await jwt.kreirajToken({
          korisnik: dohvaceniKorisnik,
          Uloga: uloga,
          _id: dohvaceniKorisnik._id,
        });
        
        db.prekiniVezu();
        return { token, kosarica };
      } else {
        db.prekiniVezu();
        return { error: "Neispravna lozinka." };
      }
    } catch (error) {
      db.prekiniVezu();
      console.error("Greška pri prijavi:", error);
      return { error: "Greška pri prijavi" };
    }
  }

  async registracija(noviKorisnik) {
    const db = await this.baza.poveziSeNaBazu();
    const korisniciKolekcija = db.database.collection("korisnici");
    const hashiranaLozinka = await bcrypt.hash(noviKorisnik.Lozinka, 12);

    try {
      const noviKorisnikObjekt = {
        KorisnickoIme: noviKorisnik.KorisnickoIme,
        Lozinka: hashiranaLozinka,
        Email: noviKorisnik.Email,
        Uloga_ID: new ObjectId("64e22057f9497eba62ed9513"),
      };
      const povratneInfo = await korisniciKolekcija.insertOne(
        noviKorisnikObjekt
      );
      db.prekiniVezu();
      console.log("Korisnik uspješno unesen");
      return povratneInfo;
    } catch (error) {
      db.prekiniVezu();
      if (error.code === 11000) {
        console.warn("Korisničko ime već postoji.");
        return { error: "Korisničko ime već postoji." };
      } else {
        console.error("Greška pri unosu korisnika:", error);
        return { error: "Greška pri unosu korisnika:" };
      }
    }

    if (povratneInfo) return true;
  }
}

module.exports = KorisniciDAO;
