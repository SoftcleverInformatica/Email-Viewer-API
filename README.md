Para acessar o post url/email
parametros = token
exemplo de url = http://localhost:5000?token=<seu token>
body:{
  "nome": "<nome de quem enviou email>",
  "email": "<email de quem enviou>",
  "telefone": "<telefone>",
  "mensagem": "<mensagem do email>",
  "quem_enviou": "<url do site que enviou o email>"
}

Get
parametros opcional = ultimos
parametro obrigatorio = token
exemplo http://localhost:5000?ultimos=5?token=<seu token>
acessando essa rota a api ira retornar os ultimos 5 emails salvos no banco, caso não envie esse parametro, a api irá retornar todos

'''TOKEN'''
o mesmo token que foi definido no arquivo .env terá que ser passado como parametro ao fazer as requisições

COMANDO PARA CRIAR BANCO PARA TESTE

create database emails;
use emails;
CREATE TABLE email (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(255),
  mensagem TEXT,
  site_que_enviou varchar(100),
  data_e_hora datetime
);

Necessário de um arquivo .env, com as variaveis de ambiente para rodar bonitinho, veja o arquivo .env-example para ver como este arquivo precisa estar