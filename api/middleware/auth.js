require('dotenv').config();
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
    // Récupérer le token pour vérifier la connexion, envoyé dans l'en-tête Authorization
    const rawHeader = req.header('Authorization');
    const token = rawHeader && rawHeader.split(' ')[1]; // only the part after "Bearer"

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    // Ici, on récupère le payload, qui est l'ID de l'utilisateur
    try {
        const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
        const decodedToken = jwt.verify(token, secretKey);
        
        req.user = decodedToken;

        // the id comes from payload from Controller
        const utilisateur = await User.findOne({ _id: decodedToken.id })

        if (!utilisateur) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
        req.role = utilisateur.role;

        next();

    } catch (error) {
        res.status(401).json({ message: error });

    }

}