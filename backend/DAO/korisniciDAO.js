const { ObjectId } = require("mongodb");
const Baza = require("./baza.js");
const bcrypt = require('bcrypt');

class KorisniciDAO {
    constructor() {
        this.baza = new Baza();
    }

    async prijava(korisnik) {
      try {
          const db = await this.baza.poveziSeNaBazu();
          const baza = db.database;


          const korisniciKolekcija = baza.collection('korisnici');
          console.log(korisniciKolekcija);


  
          const dohvaceniKorisnik = await korisniciKolekcija.findOne({ KorisnickoIme: korisnik.KorisnickoIme });
          
          if (!dohvaceniKorisnik) {
              console.log("NEma ga")
          }
  
          const lozinkaUsporedba = await bcrypt.compare(korisnik.Lozinka, dohvaceniKorisnik.Lozinka);
  
          db.prekiniVezu();
          return lozinkaUsporedba;

      } catch (error) {
          console.error('Greška pri prijavi:', error);
          throw error;
      }
  }
  

    async registracija(noviKorisnik) {
        const db = await this.baza.poveziSeNaBazu();
        const korisniciKolekcija = db.database.collection('korisnici');

        const hashiranaLozinka = await bcrypt.hash(noviKorisnik.Lozinka, 12);

        const noviKorisnikObjekt = {
            Korisnicko_Ime: noviKorisnik.Korisnicko_Ime,
            Lozinka: hashiranaLozinka,
            Email: noviKorisnik.Email,
            Uloga_ID: ObjectId("64e22057f9497eba62ed9513")
        };

        const povratneInfo = await korisniciKolekcija.insertOne(noviKorisnikObjekt);
        db.prekiniVezu();

        return povratneInfo.result.ok;
    }
}

module.exports = KorisniciDAO;
