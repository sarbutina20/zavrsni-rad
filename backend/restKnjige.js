const KnjigeDAO = require("./DAO/knjigeDAO");
const kljuc = process.env.STRIPE;
const endpointSecret = process.env.WEBHOOKS
const stripe = require("stripe")(kljuc);
const konfiguracija = require("./konfiguracija.json");


exports.knjige = async function (zahtjev, odgovor) {
  
  const kdao = new KnjigeDAO();
  const korisnik = zahtjev.korisnik;
  try {
    kdao.knjige_NYT(korisnik).then((poruka) => {
      if (poruka.error) {
        odgovor.status(400).json({ error: poruka.error });
      } else {
        odgovor.status(200).json({ knjige: poruka.knjige });
      }
    });
  } catch (serverError) {
    odgovor.status(500).json({ error: serverError });
  }


};

exports.narudzbe = async function (zahtjev, odgovor) {
  const appPort = konfiguracija.appPort;

  if (zahtjev.method === "GET") {

  }

  if (zahtjev.method === "POST") {

    const narudzba = zahtjev.body.narudzba;
    const korisnik = zahtjev.korisnik;
    


    const customer = await stripe.customers.create({
      metadata: {
        Korisnik_ID: korisnik._id,
        kosarica: JSON.stringify(narudzba),
      },
    });

    const line_items = narudzba.map((knjiga) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: knjiga.naslov,
            images: [knjiga.slika],
            metadata: {
              id: knjiga.isbn.toString(),
            },
          },
          unit_amount: knjiga.cijena * 100,
        },
        quantity: knjiga.kolicina,
      };
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:${appPort}/uspjesnaTransakcija`,
      cancel_url: `http://localhost:${appPort}`,
      line_items: line_items,
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "HR"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Besplatna isporuka",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 3000,
              currency: "usd",
            },
            display_name: "Brza isporuka",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      mode: "payment",
      customer: customer.id
    });

    odgovor.status(303).send({ url: session.url });

  }
};

exports.webhooks = async (zahtjev, odgovor) => {

  narudzba = zahtjev.body.data.object;
  eventType = zahtjev.body.type;

  if (eventType === "payment_intent.succeeded") {

    const kupac = await stripe.customers.retrieve(narudzba.customer);
    
    try {
      const kdao = new KnjigeDAO();
      kdao.kreirajNarudzbu(narudzba, kupac).then((poruka) => {
        if (poruka.error) {
          odgovor.status(400).json({ error: poruka.error });
        } else {
          odgovor.sendStatus(200);
        }
      });
    } catch (serverError) {
      odgovor.status(500).json({ error: serverError });
    }
  }
};

exports.kosarica = function (zahtjev, odgovor) {
  const korisnik = zahtjev.korisnik;
  const kdao = new KnjigeDAO();

  if (zahtjev.method === "GET") {
    kdao.dohvatiKosaricu(korisnik).then((poruka) => {
      if (poruka.error) {
        odgovor.status(400).json({ error: poruka.error });
      } else {
        odgovor.status(200).json({ kosarica: poruka.kosarica });
      }
    });
  }

  else if (zahtjev.method === "PUT") {
    kdao.azurirajKosaricu(korisnik, zahtjev.body).then((poruka) => {
      if (poruka.error) {
        odgovor.status(400).json({ error: poruka.error });
      } else {
        odgovor.status(200).json({ kosarica: poruka.azuriranaKosarica });
      }
    });
  }
  else odgovor.status(405).json({ error: "Metoda nije dopuštena!" });
};

exports.bazaKnjige = function (zahtjev, odgovor) {};