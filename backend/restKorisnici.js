const KorisnikDAO = require("./DAO/korisnikDAO");

exports.prijava = function (zahtjev, odgovor) {
    odgovor.json({ poruka: 'Uspješna prijava.' });
}

exports.registracija = function (zahtjev, odgovor) {
    odgovor.json({ poruka: 'Uspješna prijava.' });
    
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