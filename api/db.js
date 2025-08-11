const mongoose = require('mongoose');

const connectDB = async (mongoURI) => {
   
        await mongoose.connect(mongoURI)
        .then(() => console.log('Successfully connected to MongoDB  :) !!!'))
        .catch((err) => console.error('Error connecting to MongoDB:', err));
  

    }

module.exports = connectDB;
