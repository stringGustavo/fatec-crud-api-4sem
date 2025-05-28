# Criação de uma API REST

Este repositório tem como objetivo ensinar, passo a passo, a criação de uma API REST simples, que servirá de *backend* para um CRUD de cadastro de usuários, desenvolvido com React + Vite no *frontend* e Node.js no *backend*.


### Acesse aqui o [Repositório do FrontEnd](https://github.com/stringGustavo/fatec-crud-front-4sem)
<br>

## Criando o Projeto e Instalando Dependências

Primeiramente, crie uma pasta chamada ```crud-api```. Abra o terminal do *Visual Studio Code* com o comando ```Ctrl + '``` e acesse a pasta criada digitando o comando ```cd crud-api``` no terminal.

Agora que já estamos dentro da pasta, podemos começar a instalar as dependências da nossa API utilizando os seguintes comandos abaixo:

```bash
npm install express
npm install cors
npm install mysql2
```
ou se preferir pode instalar tudo em um único comando utilizando:

```bash
npm install express cors mysql2
```

Para conferir se as dependências foram instaladas corretamente, procure pelo arquivo ```package.json```, ele deve ter algo parecido com isso:
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "mysql2": "^3.14.1"
  },
  "type": "module" // Indica que o projeto está usando ES Module e não CommonJS.
}
```

<details>
  <summary>Clique para ver a explicação de cada dependência</summary>

  ```express``` é um *framework* voltado para aplicações *web* que utilizam Node.js. Geralmente é utilizado na criação de APIs ou servidores HTTP. Com o *Express* é possível criar rotas e lidar com requisições HTTP (GET, POST, PUT e DELETE)

  ```cors``` *(Cross-Origin Resource Sharing)* é um mecanismo de segurança utilizado pelos navegadores para controlar o acesso a recursos hospedados em domínios diferentes.

  Exemplo: Se esta API estiver rodando em `http://localhost:3000` e o *frontend* estiver em `http://localhost:3001`, o navegador irá bloquear as requisições, a menos que o servidor (API) permita explicitamente essa origem usando **CORS**.

  ```mysql2``` é um *client* para conectar seu *backend* Node.js a um banco de dados MySQL.
</details>

## Estrutura de Pastas

Dentro de ```crud-api``` crie 3 novas pastas para organizar a API, sendo elas:

```database``` onde ficará o arquivo ```db.js``` responsável pela conexão com o banco de dados.

```server``` onde ficará o arquivo ```server.js``` responsável por inicializar o servidor da API.

```routes``` onde ficará o arquivo ```users.js``` responsável por definir os *endpoints* da API para manipular dados de usuários no banco.

## Criando e exportando a conexão com o banco

No arquivo ```db.js``` adicione o seguinte código abaixo.

```js
import mysql from 'mysql2/promise'; // Importação da versão do mysql2 que funciona com Promises e pode ser usada com async/await.

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000', // Insira aqui a sua senha do MySQL Workbench. Caso não tenha senha, apague o campo password ou deixe vazio.
  database: 'db_crud', // Insira aqui o nome do banco que você criou.
});

export default connection;
```

## Script do banco de dados utilizado
```sql
CREATE DATABASE `db_crud`;

USE `db_crud`;

CREATE TABLE IF NOT EXISTS `use_users` (
  use_id INT PRIMARY KEY AUTO_INCREMENT,
  use_name VARCHAR(255) NOT NULL,
  use_email VARCHAR(255) NOT NULL UNIQUE,
  use_birth DATE NOT NULL,
  use_register DATETIME NOT NULL,
  use_status TINYINT DEFAULT 1
);
```

## Criando os endpoints da API

No arquivo ```users.js``` adicione o seguinte código abaixo.

```js
import express from 'express'; // Importação do express.
import db from '../database/db.js' // Importação da conexão com o banco feita acima.

const router = express.Router(); // Cria o módulo de rotas do express.
```

<details>
<summary>Informações Adicionais</summary>

  A palavra reservada ```async``` do javascript é utilizada para dizer que uma função é assíncrona, ou seja, ela não bloqueia a execução do restante do código. Dentro de uma função assíncrona
  podemos encontrar outra palavra reservada chamada ```await``` que pausa a execução dentro de uma função ```async``` até a *promise* ser resolvida. No caso do código dos *endpoints* abaixo, o ```await``` vai "esperar"
  uma resposta da função ```db.execute()``` para continuar a execução dos métodos HTTP.
  
  ```req``` (request): A requisição feita pelo cliente.
  
  ```res``` (response): A resposta que o servidor vai enviar de volta.
</details>

<details>
  <summary>Endpoint: POST</summary>

  No protocolo HTTP, POST é utilizado para executar ações em um servidor ou inserir dados no banco de dados.

```js
// Disponibilizando o método POST no endpoint '/users/create'
router.post('/create', async (req, res) => {
  const { use_name, use_email, use_birth, use_register } = req.body; // Utilizando desestruturação para preencher o corpo (body) da requisição com as informações vindas do Frontend.

  try {
    const [result] = await db.execute(
      `INSERT INTO use_users (use_name, use_email, use_birth, use_register) VALUES (?, ?, ?, ?)`, // Query SQL que será enviada para o banco.
      [use_name, use_email, use_birth, use_register] // Valores que irão preencher em ordem cada '?' do 'VALUES'.
    );

    res.status(201).json({ id: result.insertId }); // Se tudo der certo, retorna o código 201 'Created' e um json com o id que foi criado/inserido.
  }
  catch (err) {
    res.status(500).json({ error: err.message }); // Se algo der errado, retorna o código 500 'Server Internal Error' e uma mensagem de erro.
  }
});
```
</details>

<details>
  <summary>Endpoint: GET</summary>

  No protocolo HTTP, GET é utilizado para solicitar dados de um servidor.

```js
// Disponibilizando o método GET no endpoint '/users/selectAll'.
router.get('/selectAll', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM use_users WHERE use_status = 1 ORDER BY use_id DESC'); // DESC para mostrar os usuários por ordem decrescente.

    res.json(rows); // Retorna os dados encotrados.
  }
  catch (err) {
    res.status(500).json({ error: err.message }); // Se algo der errado, retorna o código 500 'Server Internal Error' e uma mensagem de erro.
  }
});
```
</details>

<details>
  <summary>Endpoint: PUT</summary>

  No protocolo HTTP, PUT é utilizado para atualizar ou criar um recurso no servidor.

```js
// Disponibilizando o método PUT no endpoint '/users/update/:id'
router.put('/update/:id', async (req, res) => { // Neste caso, além do corpo (body) da requsição o endpoint precisa de um parâmetro ':id' para saber qual usuário no banco será atualizado.
  const { use_name, use_email, use_birth } = req.body; // Utilizando desestruturação para preencher o corpo (body) da requisição com as informações vindas do Frontend.
  
  try {
    const [result] = await db.execute(
      `UPDATE use_users SET use_name = ?, use_email = ?, use_birth = ? WHERE use_id = ?`,
      [use_name, use_email, use_birth, req.params.id] // Valores que irão preencher em ordem cada '?'.
    );
    res.json({ updated: result.affectedRows }); // Retorna um json monstrando quantas linhas foram afetadas.
  }
  catch (err) {
    res.status(500).json({ error: err.message }); // Se algo der errado, retorna o código 500 'Server Internal Error' e uma mensagem de erro.
  }
});
```
</details>

<details>
  <summary>Endpoint: DELETE</summary>

  No protocolo HTTP, DELETE é utilizado para deletar recursos de um servidor.

```js
// Disponibilizando o método DELETE no endpoint '/users/delete/:id'
router.delete('/delete/:id', async (req, res) => { // Neste caso, não precisamos do corpo (body) da requisição, mas o endpoint ainda precisa do parâmetro ':id' para saber qual usuário será deletado no banco.
  try {
    const [result] = await db.execute('DELETE FROM use_users WHERE use_id = ?', [req.params.id]); // req.params.id contém o valor do id enviado na request do Frontend.

    res.json({ deleted: result.affectedRows }); // Retorna um json mostrando quantas linhas foram afetadas.
  }
  catch (err) {
    res.status(500).json({ error: err.message }); // Se algo der errado, retorna o código 500 'Server Internal Error' e uma mensagem de erro.
  }
});
```
</details>

Não esqueça de exportar o modúlo no final do arquivo ```users.js```!
```js
export default router; // Exporta o módulo, permitindo que ele seja importado em outros arquivos do projeto.
```

## Inicializando o servidor da API

No arquivo  ```server.js``` dentro da pasta ```server``` adicione o código:

```js
import express from 'express'; // Importação do Express.
import userRoutes from '../routes/users.js'; // Importação da rota users.js que foi criada acima.
import cors from 'cors'; // Importação do CORS.

const port = 3000; // Definindo a porta que a API vai rodar.
const app = express(); // Instânciando o Express.

app.use(cors()); // Habilita CORS para permitir requisições de outras origens.
app.use(express.json()); // Utilização do Middleware do Express que interpreta o corpo das requisições HTTP no formato JSON. Responsável por popular o req.body.
app.use('/users', userRoutes); // Define que todas as rotas dentro do userRoutes vão “começar” com /users.

// Inicia o servidor Express na porta definida (3000).
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

```
