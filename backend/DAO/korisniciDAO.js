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

      const dohvaceniKorisnik = await dohvatiKorisnika(
        baza,
        korisnik.KorisnickoIme
      );

      if (!dohvaceniKorisnik) {
        console.error("Ne postoji korisnik s takvim korisničkim imenom.");
        db.prekiniVezu();
        return { error: "Ne postoji korisnik s takvim korisničkim imenom." };
      }

      const lozinkaUsporedba = await provjeriLozinku(
        korisnik.Lozinka,
        dohvaceniKorisnik.Lozinka
      );

      if (lozinkaUsporedba) {
        const uloga = await dohvatiUlogu(baza, dohvaceniKorisnik.Uloga_ID);
        const kosarica = await dohvatiKosaricu(baza, dohvaceniKorisnik._id);
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
      return { error: "Greška pri prijavi." };
    }
  }

  async registracija(noviKorisnik) {
    const db = await this.baza.poveziSeNaBazu();
    const baza = db.database;

    const hashiranaLozinka = await bcrypt.hash(noviKorisnik.Lozinka, 12);

    try {
      const noviKorisnikObjekt = {
        KorisnickoIme: noviKorisnik.KorisnickoIme,
        Lozinka: hashiranaLozinka,
        Email: noviKorisnik.Email,
        Uloga_ID: new ObjectId("64e22057f9497eba62ed9513"),
      };

      const povratneInfo = await dodavanjeNovogKorisnika(
        baza,
        noviKorisnikObjekt
      );

      if (!povratneInfo.error) {
        await stvoriKosaricu(baza, povratneInfo.insertedId);
      }

      db.prekiniVezu();
      console.log("Korisnik uspješno dodan.");

      return povratneInfo;

    } catch (error) {
      db.prekiniVezu();
      console.error("Greška pri registraciji:", error);
      return { error: "Greška pri registraciji." };
    }
  }
  
}

async function stvoriKosaricu(baza, korisnikId) {
  const novaKosarica = {
    stavke: [],
    ukupnaCijenaStavki: 0,
    ukupnaKolicina: 0,
    Korisnik_ID: korisnikId,
  };

  try {
    const stvaranjeKosarice = await baza.kosariceKolekcija.insertOne(
      novaKosarica
    );
    return stvaranjeKosarice;
  } catch (error) {
    return { error: "Greška pri stvaranju košarice." };
  }
}

async function dodavanjeNovogKorisnika(baza, noviKorisnikObjekt) {
  try {
    const povratneInfo = await baza.korisniciKolekcija.insertOne(
      noviKorisnikObjekt
    );
    return povratneInfo;
  } catch (error) {
    if (error.code === 11000) {
      console.error("Korisničko ime već postoji.");
      return { error: "Korisničko ime već postoji." };
    } else {
      console.error("Greška pri unosu korisnika:", error);
      return { error: "Greška pri unosu korisnika." };
    }
  }
}

async function provjeriLozinku(lozinka, hash) {
  return await bcrypt.compare(lozinka, hash);
}

async function dohvatiUlogu(baza, ulogaId) {
  return await baza.collection("uloge").findOne({ _id: ulogaId });
}

async function dohvatiKorisnika(baza, korisnickoIme) {
  return await baza
    .collection("korisnici")
    .findOne({ KorisnickoIme: korisnickoIme });
}

async function dohvatiKosaricu(baza, korisnikId) {
  return await baza.collection("kosarica").findOne({ Korisnik_ID: korisnikId });
}

module.exports = KorisniciDAO;
