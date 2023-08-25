const Baza = require("./baza.js");
const { ObjectId } = require("mongodb");
const crypto = require('crypto');


class KnjigeDAO {
  constructor() {
    this.baza = new Baza();
    this.knjigeNaslovi = "http://openlibrary.org/subjects/";
    this.knjigeSlike = "https://covers.openlibrary.org/a/id/";
  }

  async kreirajNarudzbu(narudzba, kupac) {
    const db = await this.baza.poveziSeNaBazu();
    const baza = db.database;
    const kolekcijaNarudzbi = baza.collection("narudzbe");
    const trenutniDatum = new Date();

    const proizvodi = JSON.parse(kupac.metadata.cart);
    const stavke = proizvodi.map((knjiga) => {
      return {
        isbn: knjiga.isbn,
        kolicina: knjiga.kolicina,
        autor: knjiga.autor,
        naslov: knjiga.naslov,
        ukupnaCijena: knjiga.ukupnaCijena,
        cijena: knjiga.cijena,
      };
    });
    const novaNarudzba = {
      stavke: stavke,
      datum: trenutniDatum.toISOString(),
      Korisnik_ID: new ObjectId(kupac.metadata.userId),
      ukupnaCijenaStavki: narudzba.amount_total,
      adresa: narudzba.customer_details
    };

    
    try {
      const povratneInfo = await kolekcijaNarudzbi.insertOne(novaNarudzba);
      db.prekiniVezu();
      console.log("Narudžba uspješno unesena");
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
        const generiranaCijena = Math.floor(Math.random() * (50 - 7 + 1)) + 7;

        return {
          naslov: knjiga.naslov,
          coverId: knjiga.coverId,
          cijena: parseFloat(generiranaCijena),
          slikaURL: slikaUrl,
        };
      })
    );

    return knjigeSaSlikama;
  }

  async knjige_NYT() {
    const kljuc = process.env.NYT;
    const odgovor = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${kljuc}`
    );

    if (!odgovor.ok) {
      return { error: "Neispravan zahtjev" };
    }
    const podaci = await odgovor.json();

    const knjige = podaci.results.books.map((knjiga) => {
      const hash = crypto.createHash('md5').update(`${knjiga.title}${knjiga.author}${knjiga.primary_isbn13}`).digest('hex');
    const generiranaCijena = (parseInt(hash, 16) % 44) + 7;

      return {
        isbn: knjiga.primary_isbn13,
        autor: knjiga.author,
        naslov: knjiga.title,
        opis: knjiga.description,
        slika: knjiga.book_image,
        cijena: generiranaCijena
      };
    });

    return { knjige };
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
