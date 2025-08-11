
// const { createServer } = require('node:http');
// const app = require('./api/app');
// const hostname = '127.0.0.1';

// const port = 3000;

// const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World !!!');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

const { createServer } = require('node:http');
const app = require('./api/app');
const connectDB = require('./api/db');
require('dotenv').config();

connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/RareFarm');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

