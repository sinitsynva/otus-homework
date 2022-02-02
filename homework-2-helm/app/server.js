'use strict';

//import * as Json from "elow/lib/Json/Decode"

const express = require('express');

// Constants
const PORT = 70;
const HOST = '0.0.0.0';
const STATUS = 'OK'
//DB connection
const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URI;
const pool = new Pool({
  connectionString,
});
// error const
const clientNotFound = "client not found"
const noteAllParamInReq = "missing required request parameter"
const clientAllreadyExists = "client already exists"
const oneOfParamMustBeInReq = "at least one parameter must be filled"
const badPhone = "bad phone number"
//
let user = [{ username: '',
              firstname: '',
              lastname: '',
              email: '',
              phone: ''}];

// App
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({STATUS});
});

app.get('/livenessProbe', (req, res) => {
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
      }
    });
  });


 app.post("/user",(req, res) => {
   let errMsg;
   let id;
   if (req.body.username == undefined || req.body.firstname ==undefined ||
       req.body.lastname == undefined || req.body.email == undefined ||
       req.body.phone == undefined) {
     errMsg = noteAllParamInReq;
     res.status(400).json({errMsg});
   }else if (!/[+]{1,}[0-9]{11,}/.test(req.body.phone)) {
     errMsg = badPhone;
     res.status(400).json({errMsg});
   }else {
      pool.query(`SELECT * FROM client_info WHERE username = '${req.body.username}'`, (err, resalt) =>{
       if (resalt.rows.length == 0) {
         pool.query(`insert into client_info(username, firstname, lastname, email, phone)
                    values('${req.body.username}','${req.body.firstname}','${req.body.lastname}','${req.body.email}','${req.body.phone}');`, (err, resalt) =>{
         });
         pool.query(`SELECT * FROM client_info WHERE username = '${req.body.username}'`, (err, resalt) =>{
           id = resalt.rows[0].id;
           res.status(200).json({id});
         });
       } else {
         errMsg = clientAllreadyExists;
         res.status(400).json({errMsg});
       };
     });
   };
 });

///delete/1
app.delete('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  pool.query(`SELECT * FROM client_info WHERE id = ${userId}`, (err, resalt) => {
  if (resalt.rows.length == 0) {
    let errMsg = clientNotFound;
    res.status(404).json({errMsg});
  } else {
     pool.query(`DELETE FROM client_info WHERE id = ${userId}`, (err, resalt) =>{
     });
     res.status(200).json({});
    }
  });
});

app.put("/user/:userId",(req, res) => {
  const userId = req.params.userId;
  let errMsg;
  if (req.body.username == undefined && req.body.firstname == undefined &&
      req.body.lastname == undefined && req.body.email == undefined &&
      req.body.phone == undefined) {
    errMsg = oneOfParamMustBeInReq;
    res.status(400).json({errMsg});
  } else if (req.body.phone != undefined && !/[+]{1,}[0-9]{11,}/.test(req.body.phone)) {
    errMsg = badPhone;
    res.status(400).json({errMsg});
  } else {
     pool.query(`SELECT * FROM client_info WHERE id = ${userId}`, (err, resalt) =>{
      if (resalt.rows.length == 0) {
        errMsg = clientNotFound;
        res.status(404).json({errMsg});
      } else {
        user[0].username = req.body.username ?? resalt.rows.username;
        user[0].firstname = req.body.firstname ?? resalt.rows.firstname;
        user[0].lastname = req.body.lastname ?? resalt.rows.lastname;
        user[0].email = req.body.email ?? resalt.rows.email;
        user[0].phone = req.body.phone ?? resalt.rows.phone;
        pool.query(`update  client_info
                    set username = '${user[0].username}',
                        firstname = '${user[0].firstname}',
                        lastname = '${user[0].lastname}',
                        email = '${user[0].email}',
                        phone = '${user[0].phone}'
                    where id = ${userId}`, (err, resalt) =>{
        res.status(200).json({});
       });
      };
    });
  };
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
