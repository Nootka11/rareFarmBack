require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

  //Esto solo deja entrar a los orígenes definidos en whitelist.
  const whitelist = ['http://localhost:3000','http://localhost:5173', 'https://rarefarm.netlify.app'];
  
  var corsOptionsDelegate = function (req, callback) {
     const origin = req.header('Origin');
  console.log('CORS Origin:', origin);
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }

const allRoutes = require('./routes/allroutes');

app.use(cors(corsOptionsDelegate))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('api/uploads'));
app.use('/api/', allRoutes);



  module.exports = app;