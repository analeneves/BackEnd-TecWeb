const {json} = require("body-parser");
var express = require("express");
var jwt = require("jsonwebtoken");
var cors = require('cors');
var app = express();

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "tecweb"
});

app.use(cors());
app.use(express.json());

app.post('/auth', (req,resp)  =>{
    var user = req.body;
    console.log(user)
    
    connection.query("SELECT * FROM usuario WHERE nome = ? and senha = ?", [user.nome, user.senha], (err, result) => {
    var usuario = result[0];
    if(result.lenght == 0){
      resp.status(401);
      resp.send({token: null, usuario: null, success: false});
    } else {
      let token = jwt.sign({id: usuario.nome}, 'tecweb', {expiresIn: 6000});
      resp.status(200);
      resp.send({token: token, usuario: usuario, success: true});
    }
  });
});



verifica_token = (req, resp, next) => {
  var token = req.headers['x-acess-token'];

  if(!token) {
    resp.status(401);
  }
  jwt.verify(token, 'tecweb', (err, docoded) => {

    req.usuario = decoded.id;
    next();
  });
}

app.get("/med",(req,resp) =>{
  var med = req.body;
  console.log("GET-Med");

  connection.query("SELECT * FROM med",(err,result) =>{
      if(err){
          console.log(err);
          resp.status(500).end();

      }else{
          resp.status(200);
          resp.json(result)
          
      }
  });

});

app.post('/med', function(req, resp){
    var med = req.body;
    console.log("POST - Med");
    console.log(JSON.stringify(med));
    connection.query("INSERT INTO med SET ?", [med], (err, result) => {
      if(err){
        console.log(err);
        resp.status(500).end();
      }else{
        resp.status(200);
        resp.json(result.insertedId);
      }
    });
});

app.get("/med/:medId", (req, resp) =>{
    var medId = req.params.medId;
    console.log("GET - MedId " + medId);

    connection.query("SELECT * FROM med WHERE idmed=?",[medId], (err,result) =>  {
        if(err){
            console.log(err);
            resp.status(500).end();

        }else{
            resp.status(200);
            resp.json(result)
        }
    });
});

app.put("/med/:medId",(req,resp) => {
  var medId = req.params.medId
  resp.send("Successful Operation")
  console.log("PUT - MedId: " + medId);
  console.log(medId)
  var med = req.body;

  connection.query("UPDATE demandas SET ? WHERE idmed=?",[med,medId],(err,result) =>{
      if(err){
          console.log(err);
          resp.status(500).end();
      }else{
          resp.status(200);
          resp.json(result)
      }
  });
});

app.delete('/med/:medId', (req, resp) =>{
    var medId = req.params.medId;

    resp.send("Successful Operation")
    console.log("DELETE - MedId " + medId);

    connection.query("DELETE FROM med WHERE medId=?",[medId],(err,result) =>{

      if(err){
          console.log(err);
          resp.status(500).end();

      }else{
          resp.status(200);
          resp.json(result) 
      }
    });
});

app.listen(3000, function() {
    console.log('App listen on port 3000!');
});