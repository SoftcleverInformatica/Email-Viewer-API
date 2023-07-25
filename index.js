const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');
const moment = require('moment-timezone');

//Carregando variaveis de ambiente
const TOKEN = process.env.TOKEN;

const app = express();
const port = 5000;

Headers = [
  {key: 'Access-Control-Allow-Credentials', value: '*'},
  {key: 'Acsess-Control-Allow-Origin', value: '*'}
]

app.use(cors());
app.use(express.json()); // Middleware para parsing do corpo das requisições como JSON

function connectToDB() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
}


app.get('/', (req, res) => {
  const ultimos = req.query.ultimos
  const token = req.query.token
  if (token != TOKEN){
    res.status(404).send({"erro":"token não informado ou incorreto"})
    return
  } 
  const db = connectToDB();
  let sql = 'SELECT * FROM email';
  if (ultimos){
    sql += ` ORDER BY id DESC LIMIT ${ultimos}`
  }
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    //fiz isso por causa que ele estava puxando a data do banco de dados errado
    const emails = result.map((email) => {
      const data_e_horaUTC = moment.utc(email.data_e_hora);
      const data_e_horaLocal = data_e_horaUTC.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
      return { ...email, data_e_hora: data_e_horaLocal };
    });

    res.send(emails);
  });
  db.end()
});

app.post('/email', (req, res) => {
  const token = req.query.token
  if (token != TOKEN){
    res.status(404).send({"erro":"token não informado ou incorreto"})
    return
  } 
  const db = connectToDB();
  const { nome, email, telefone, mensagem, empresa, quem_enviou } = req.body;
  const sql = 'INSERT INTO email (nome, email, telefone, mensagem, data_e_hora, site_que_enviou, empresa) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const data_e_hora = new Date()
  const values = [nome, email, telefone, mensagem, data_e_hora, quem_enviou, empresa];
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }

    res.status(200).send({'mensagem':'Email salvo com sucesso!!'});
  });
  db.end()
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
