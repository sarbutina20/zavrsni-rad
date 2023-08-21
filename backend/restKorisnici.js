const korisniciDAO = require("./DAO/korisniciDAO");

exports.prijava = function (zahtjev, odgovor) {
    const kdao = new korisniciDAO();
    let korisnik = zahtjev.body;
    try {
        kdao.prijava(korisnik).then((poruka) => {
            if(poruka.error) {
                odgovor.status(400).json({error:poruka.error})
            }
            else {
                odgovor.status(200).json({ token: poruka.token });
            }
        });
    } catch (serverError) {
        odgovor.status(500).json({error:serverError})
    }
    
}

exports.registracija = function (zahtjev, odgovor) {
    const kdao = new korisniciDAO();
    let korisnik = zahtjev.body;

    try {
        kdao.registracija(korisnik).then((poruka) => {
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

exports.korisnik = function (zahtjev, odgovor) {
    const korisnikId = zahtjev.params.id; // Pretpostavljamo da koristite ID iz URL-a
    const demoKorisnik = {
        id: korisnikId,
        ime: 'John Doe',
        email: 'john@example.com'
    };
    odgovor.json({ korisnik: demoKorisnik });
    
}