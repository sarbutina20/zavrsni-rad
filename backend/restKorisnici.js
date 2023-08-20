const korisniciDAO = require("./DAO/korisniciDAO");

exports.prijava = function (zahtjev, odgovor) {
    const kdao = new korisniciDAO();
    let korisnik = zahtjev.body;
    kdao.prijava(korisnik).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
}

exports.registracija = function (zahtjev, odgovor) {
    const kdao = new korisniciDAO();
    let korisnik = zahtjev.body;
    kdao.registracija(korisnik).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
 
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