'use strict';

//import * as Json from "elow/lib/Json/Decode"

const express = require('express');

// Constants
const PORT = 70;
const HOST = '0.0.0.0';
const STATUS = 'OK'
//type
//type CreateClientReq = {
  //username: string
  //firstName: string
  //lastName: string
  //email: string
//  phone: string
//};

//const createClientReq = Json.map(
//  Json.field("username", Json.string),
//  Json.field("firstName", Json.string),
//  Json.field("lastName", Json.string),
//  Json.field("email", Json.string),
//  Json.field("phone", Json.string)
//);
// postgre connection postgresql+psycopg2://otshwrkuser:secret@postgres/OTSHWRKDB
const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URI;
const pool = new Pool({
  connectionString,
});
// error const
const clientNotFound = "client not found"

// App
const app = express();
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.get('/livenessProbe', (req, res) => {
  res.send('Ok');
});

app.get('/health', (req, res) => {
  res.status(200).json({STATUS});
});

app.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
    pool.query(`SELECT * FROM client_info WHERE id = ${userId}`, (err, resalt) => {
    if (resalt.rows.length == 0) {
      let errMsg = clientNotFound;
      res.status(404).json({errMsg});
    } else {
       const id = resalt.rows[0].id;
       const username = resalt.rows[0].username;
       const firstname = resalt.rows[0].firstname;
       const lastname = resalt.rows[0].lastname;
       const email = resalt.rows[0].email;
       const phone = resalt.rows[0].phone;
       res.status(200).json({id,
                            username,
                            firstname,
                            lastname,
                            email,
                            phone});
      //res.send(resalt.rows[0].username);
    }


      //pool.end();
    });
  });




app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
