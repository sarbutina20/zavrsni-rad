const mongoose = require('mongoose');

module.exports = {
    poveziSeNaBazu: async function () {
        const url = process.env.MONGODB;
        
        try {
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Povezan s bazom podataka');

            const db = mongoose.connection;

            return {
                baza: db,
                prekiniVezu: async () => {
                    await mongoose.disconnect();
                    console.log('Veza s bazom prekinuta');
                }
            };
        } catch (error) {
            console.error('Greška pri povezivanju s bazom podataka', error);
        }
    }
}
