# Criação de uma API REST

O objetivo deste repositório é ensinar passo a passo a criação de uma API REST simples com Node.js que será utilizada para o funcionamento de um CRUD feito em React + Vite.

Link do FrontEnd: ---

Primeiramente, crie uma pasta chamada ```crud-api```. Abra o terminal do *Visual Studio Code* com o comando ```Ctrl + '``` e acesse a pasta criada digitando o comando ```cd crud-api``` no terminal.

Agora que já estamos dentro da pasta, podemos começar a instalar as dependências da nossa API utilizando os seguintes comandos abaixo:

```
npm install express
npm install cors
npm install mysql2
```
ou se preferir pode instalar tudo em um único comando utilizando:

```
npm install express cors mysql2
```

<details>
  <summary>Clique para ver a explicação de cada dependência</summary>

  ```express``` é um *framework* voltado para aplicações *web* que utilizam Node.js. Geralmente é utilizado na criação de APIs ou servidores HTTP. Com o *Express* é possível criar rotas e lidar com requisições HTTP (GET, POST, PUT e DELETE)

  ```cors``` (Cross-Origin Resource Sharing) é um mecanismo de segurança utilizado pelos navegadores para controlar o acesso a recursos hospedados em domínios diferentes.

  Exemplo: Se esta API estiver rodando em `http://localhost:3000` e o *frontend* estiver em `http://localhost:3001`, o navegador irá bloquear as requisições, a menos que o servidor (API) permita explicitamente essa origem usando **CORS**.

  ```mysql2``` é um *client* para conectar seu *backend* Node.js a um banco de dados MySQL ou MariaDB.
</details>

## Estrutura de Pastas

Dentro de ```crud-api``` crie 3 novas pastas para organizar a API, sendo elas:

```database``` onde ficará o arquivo ```db.js``` responsável pela conexão com o banco de dados.

```server``` onde ficará o arquivo ```server.js``` responsável por inicializar o servidor da API.

```routes``` onde ficará p arquivo ```users.js``` responsável por definir os *endpoints* da API para manipular dados de usuários no banco.

## Conectando com o banco

No arquivo ```db.js``` adicione o seguinte código:

```
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1996',
  database: 'db_crudFatec',
});

export default connection
```











