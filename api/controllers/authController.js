require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists.' });

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res, next) => {
    try {
        console.log('hola')
        //Cherche l'utilisateur dans base de données
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            return res.status(401).json({
                //Normalement ne doit pas avoir cette info : L'utilisateur n'existe pas,
                message: 'Paire identifiant/mot de passe incorrect'
            });
        }
        // Comparaison des mot de passe encryptées, true ou false
        const mdpValid = await bcrypt.compare(req.body.password, user.password)
        if (!mdpValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' })
        }

        //Si tout va bien, l'utilisateur existe et le mdp est valide
        const expiresInSeconds = 24 * 60 * 60; // 24 heures
        // const token = jwt.sign(
        //     { userId: user._id },
        //     'RANDOM_TOKEN_SECRET',
        //     { expiresIn: expiresInSeconds }
        // );

        // Generar token JWT
        const payload = { id: user._id, username: user.username };
        const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
        const token = jwt.sign(payload, secretKey, { expiresIn: expiresInSeconds });


        res.status(200).json({
            userId: user._id,
            role: user.role,
            userName: user.username,
            token,
            expiresIn: expiresInSeconds
        });

    } catch (error) {
        res.status(500).json({  
            error: error.message,
            stack: error.stack   
            })
        }
};
