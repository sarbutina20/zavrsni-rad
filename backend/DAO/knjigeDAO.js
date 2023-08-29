const Baza = require("./baza.js");
const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const kljuc = process.env.NYT;

class KnjigeDAO {
  constructor() {
    this.baza = new Baza();
  }

  async dohvatiNarudzbe (korisnik) {
    const db = await this.baza.poveziSeNaBazu();
    const baza = db.database;
    const kolekcijaNarudzbi = baza.collection("narudzbe");

    try {
      const narudzbe = await kolekcijaNarudzbi.find({Korisnik_ID: new ObjectId(korisnik._id)}).toArray();
      db.prekiniVezu();
      return {narudzbe};
    } catch (error) {
      console.error("Greška pri dohvaćanju narudžbi iz baze:", error);
      return {error: "Greška pri dohvaćanju narudžbi iz baze."};
    }
  }

  async kreirajNarudzbu(narudzba, kupac) {
    const db = await this.baza.poveziSeNaBazu();
    const baza = db.database;
    const kolekcijaNarudzbi = baza.collection("narudzbe");

    const trenutniDatum = new Date();
    
    const proizvodi = JSON.parse(kupac.metadata.kosarica);
    const ukupnaCijenaStavki = narudzba.amount_total / 100;
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
      Korisnik_ID: new ObjectId(kupac.metadata.Korisnik_ID),
      ukupnaCijenaStavki: ukupnaCijenaStavki,
      adresa: narudzba.shipping_details.address,
      kontakt: narudzba.customer_details,
    };

    try {
      const povratneInfo = await kolekcijaNarudzbi.insertOne(novaNarudzba);
      db.prekiniVezu();
      return povratneInfo;
    } catch (error) {
      console.error("Greška pri dodavanju narudžbe u bazu:", error);
      return { error: "Greška pri dodavanju narudžbe u bazu." };
    }
  }

  async knjige_NYT() {
    try {
      const odgovor = await fetch(
        `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${kljuc}`
      );

      if (!odgovor.ok) {
        return { error: "Neispravan zahtjev za dohvaćanje knjiga s NYT API." };
      }

      const podaci = await odgovor.json();

      const knjige = podaci.results.books.map((knjiga) => {
        const hash = crypto
          .createHash("md5")
          .update(`${knjiga.title}${knjiga.author}${knjiga.primary_isbn13}`)
          .digest("hex");
        const generiranaCijena = (parseInt(hash, 16) % 44) + 7;

        return {
          isbn: knjiga.primary_isbn13,
          autor: knjiga.author,
          naslov: knjiga.title,
          opis: knjiga.description,
          slika: knjiga.book_image,
          cijena: generiranaCijena,
        };
      });

      return { knjige };
    } catch (error) {
      console.error("Greška pri dohvaćanju knjiga s NYT API:", error);
      return { error: "Greška pri dohvaćanju knjiga s NYT API." };
    }
  }

  async dohvatiKosaricu(korisnik) {
    const db = await this.baza.poveziSeNaBazu();
    const baza = db.database;
    const kolekcijaKosarica = baza.collection("kosarica");

    try {
      const kosarica = await kolekcijaKosarica.findOne({
        Korisnik_ID: new ObjectId(korisnik._id),
      });

      db.prekiniVezu();
      return { kosarica };
    } catch (error) {
      console.error("Greška pri dohvaćanju korisnikove košarice:", error);
      return { error: "Greška pri dohvaćanju korisnikove košarice." };
    }
  }

  async azurirajKosaricu(korisnik, kosarica) {
    const db = await this.baza.poveziSeNaBazu();
    const baza = db.database;
    const kolekcijaKosarica = baza.collection("kosarica");

    try {
      const azuriranaKosarica = await kolekcijaKosarica.updateOne(
        { Korisnik_ID: new ObjectId(korisnik._id) },
        {
          $set: {
            stavke: kosarica.stavke,
            ukupnaCijenaStavki: kosarica.ukupnaCijenaStavki,
            ukupnaKolicina: kosarica.ukupnaKolicina,
          },
        }
      );
      return { azuriranaKosarica };
    } catch (error) {
      console.error("Greška pri ažuriranju korisnikove košarice:", error);
      return { error: "Greška pri ažuriranju korisnikove košarice." };
    }
  }


}

module.exports = KnjigeDAO;



// SLJEDEĆI KOD JE KORIŠTEN PRI KORIŠTENJU OPENLIBRARY API KOJI SE VIŠE NE KORISTI
/*async knjige(nazivKategorije) {
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
  }*/
