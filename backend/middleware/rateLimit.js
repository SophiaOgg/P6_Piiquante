const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({ 
   
    windowMs: 15* 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Trop de tentatives de connexion ont été effectuées à partir de cette IP, veuillez réessayer ultérieurement"
})


module.exports = { loginLimiter }