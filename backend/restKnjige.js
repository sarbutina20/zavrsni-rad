const KnjigeDAO = require("./DAO/knjigeDAO");

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

exports.narudzbe = function (zahtjev, odgovor) {
    const kdao = new KnjigeDAO();

    if (zahtjev.method === 'GET') {

    }
    if (zahtjev.method === 'POST') {
        const narudzba = zahtjev.body
        const korisnik = zahtjev.korisnik
        try {
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
        odgovor.status(500).json({ error: "Kriva vrsta zahtjeva je poslana." });
    }
    
}