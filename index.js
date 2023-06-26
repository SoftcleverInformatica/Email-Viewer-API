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

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conexão com o banco de dados estabelecida!');
});


app.get('/', (req, res) => {
  const ultimos = req.query.ultimos
  const token = req.query.token
  if (token != TOKEN){
    res.status(404).send({"erro":"token não informado ou incorreto"})
    return
  } 
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
});

app.post('/email', (req, res) => {
  const token = req.query.token
  if (token != TOKEN){
    res.status(404).send({"erro":"token não informado ou incorreto"})
    return
  } 
  const { nome, email, telefone, mensagem, quem_enviou } = req.body;
  const sql = 'INSERT INTO email (nome, email, telefone, mensagem, data_e_hora, site_que_enviou) VALUES (?, ?, ?, ?, ?, ?)';
  const data_e_hora = new Date()
  const values = [nome, email, telefone, mensagem, data_e_hora, quem_enviou];
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }

    res.status(200).send('Email salvo com sucesso!!');
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
