const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema                 // Change le contraintes en dessous 
.is().min(8)                   // Longueur minimale 8
.is().max(50)                    // Longueur maximale 50
.has().uppercase()                   // Doit avoir des lettres majuscules
.has().lowercase()                  // Doit contenir des lettres minuscules
.has().digits(1)                    // Doit contenir au moins 1 chiffre
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']); // <- change ça également.

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(401).json({
            error: `Le mot de passe ne remplit pas les conditions: ${passwordSchema.validate(req.body.password, { list: true })}`
        })
    }
}