import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import pg from 'pg'
const { Pool } = pg

const app = express();

// Basic Configuration
const port = 3000;

const pool  = new Pool({
  user: `${process.env.USER_LOGIN}`,
  password: `${process.env.USER_PASSWORD}`,
  host: 'db',
  port: 5432,
  database: 'url_shortener',
})

await pool.connect()

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
