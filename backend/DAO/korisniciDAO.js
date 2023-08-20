const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const baza = require('./baza.js');

const KorisnikSchema = new mongoose.Schema({
  KorisnickoIme: String,
  Lozinka: String,
  Email: String,
  Uloga_ID: mongoose.Schema.Types.ObjectId,
});

const Korisnik = mongoose.model('Korisnik', KorisnikSchema);

class KorisnikDAO {
  constructor() {}

  prijava = async function (korisnik) {
    const db = await baza.poveziSeNaBazu();

    try {
      const dohvaceniKorisnik = await Korisnik.findOne({
        KorisnickoIme: korisnik.KorisnickoIme,
      });

      if (!dohvaceniKorisnik) {
        throw new Error('Korisnik ne postoji');
      }

      const lozinkaUsporedba = await bcrypt.compare(
        korisnik.Lozinka,
        dohvaceniKorisnik.Lozinka
      );

      return lozinkaUsporedba;
    } catch (error) {
      throw error;
    } finally {
      db.prekiniVezu();
    }
  };

  registracija = async function (noviKorisnik) {
    const db = await baza.poveziSeNaBazu();

    try {
      const hashiranaLozinka = await bcrypt.hash(noviKorisnik.Lozinka, 12);

      const noviKorisnikObjekt = new Korisnik({
        KorisnickoIme: noviKorisnik.Korisnicko_Ime,
        Lozinka: hashiranaLozinka,
        Email: noviKorisnik.Email,
        Uloga_ID: mongoose.Types.ObjectId('64e22057f9497eba62ed9513'),
      });

      await noviKorisnikObjekt.save();

      return true;
    } catch (error) {
      throw error;
    } finally {
      db.prekiniVezu();
    }
  };
}

module.exports = KorisnikDAO;
