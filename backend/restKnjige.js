const KnjigeDAO = require("./DAO/knjigeDAO");
const kljuc = process.env.STRIPE
const stripe = require('stripe')(kljuc)
const konfiguracija = require('./konfiguracija.json');

exports.knjige = async function (zahtjev, odgovor) {
    const kdao = new KnjigeDAO();
    //let nazivKategorije = zahtjev.query.naziv;
    
    try {
        const poruka = await kdao.knjige_NYT();
        if (poruka.error) {
            odgovor.status(400).json({ error: poruka.error });
        } else {
            //const knjigeSaSlikama = await kdao.dohvatiSlike(poruka.knjige);
            odgovor.status(200).json({ knjige: poruka.knjige });
        }
    } catch (serverError) {
        odgovor.status(500).json({ error: serverError });
    }
}




exports.bazaKnjige = function (zahtjev, odgovor) {
   
    
}

exports.narudzbe = async function (zahtjev, odgovor) {
    const kdao = new KnjigeDAO();
    const appPort = konfiguracija.appPort

    if (zahtjev.method === 'GET') {

    }
    if (zahtjev.method === 'POST') {
        const narudzba = zahtjev.body.narudzba
        const korisnik = zahtjev.korisnik

        const line_items = narudzba.map((knjiga) => {
            return {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: knjiga.naslov,
                    images: [knjiga.slika],
                    description: knjiga.opis,
                    metadata: {
                      id: knjiga.isbn,
                      autor: knjiga.autor
                    },
                  },
                  unit_amount: knjiga.cijena * 100,
                },
                quantity: knjiga.kolicina,
              };
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `http://localhost:${appPort}/uspjesnaTransakcija`,
            cancel_url: `http://localhost:${appPort}`,
          });
        
          //odgovor.redirect(303, session.url);
          odgovor.send({ url: session.url });
          

        /*try {
            kdao.kreirajNarudzbu(narudzba, korisnik).then((poruka) => {
                if(poruka.error) {
                    odgovor.status(400).json({error:poruka.error})
                }
                else {
                    odgovor.sendStatus(200);
                }
            });
        } catch (serverError) {
            odgovor.status(500).json({error:serverError})
        }
    }
    else {
        odgovor.status(500).json({ error: "Kriva vrsta zahtjeva je poslana." });*/
    }
    
}