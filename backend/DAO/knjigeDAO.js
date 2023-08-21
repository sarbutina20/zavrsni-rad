const Baza = require("./baza.js");
const { ObjectId } = require("mongodb");

class KnjigeDAO {
  constructor() {
    this.baza = new Baza();
    this.knjigeNaslovi = "http://openlibrary.org/subjects/";
    this.knjigeSlike = "https://covers.openlibrary.org/a/id/";
  }

  async kreirajNarudzbu(narudzba, korisnik) {
    const db = await this.baza.poveziSeNaBazu();
    const baza = db.database;
    const kolekcijaNarudzbi = baza.collection("narudzbe");
    const trenutniDatum = new Date();
    const novaNarudzba = {
      stavke: narudzba.stavke,
      ukupnaCijena: narudzba.ukupnaCijena,
      datum: trenutniDatum.toISOString(),
      Korisnik_ID: new ObjectId(korisnik._id),
    };
    try {
      const povratneInfo = await kolekcijaNarudzbi.insertOne(novaNarudzba);
      db.prekiniVezu();
      console.log("Korisnik uspješno unesen");
      return povratneInfo;
    } catch (error) {
      console.error("Greška pri dodavanju narudžbe u bazu:", error);
      return { error: "Greška pri dodavanju narudžbe u bazu." };
    }
  }

  async dohvatiSlike(knjige) {
    const knjigeSaSlikama = await Promise.all(
      knjige.map(async (knjiga) => {
        const coverId = knjiga.coverId;
        const slikaUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

        return {
          naslov: knjiga.naslov,
          coverId: knjiga.coverId,
          slikaUrl: slikaUrl,
        };
      })
    );

    return knjigeSaSlikama;
  }

  async knjige(nazivKategorije) {
    const brojDostupnihKnjiga = 30;
    const brojKnjigaPoZahtjevu = 10;

    const maxOffset = brojDostupnihKnjiga - brojKnjigaPoZahtjevu;
    const randomOffset = Math.floor(Math.random() * maxOffset);

    try {
      const odgovor = await fetch(
        this.knjigeNaslovi +
          nazivKategorije +
          `.json?limit=${brojKnjigaPoZahtjevu}&published_in=1900-2023&offset=${randomOffset}`
      );
      if (!odgovor.ok) {
        return { error: "Neispravan naziv kategorije." };
      }
      const podaci = await odgovor.json();
      const knjige = podaci.works.map((knjiga) => ({
        naslov: knjiga.title,
        coverId: knjiga.cover_id,
      }));

      return { knjige };
    } catch (error) {
      console.error("Greška pri dohvaćanju knjiga s API:", error);
      return { error: "Greška pri dohvaćanju knjiga s API." };
    }
  }
}

module.exports = KnjigeDAO;
