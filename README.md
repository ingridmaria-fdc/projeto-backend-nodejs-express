# Projeto Backend com Node.js e Express

Este projeto backend foi desenvolvido com **Node.js**, **Express** e **Sequelize**, e oferece uma API RESTful com autenticação via JWT, conexão com MySQL, e documentação via Swagger.

> Criado por: **Ingrid Maria** 

## Documentação da API

A documentação Swagger está disponível após iniciar o servidor:

Acesse: **[`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)**

## Setup do Ambiente

### Pré-requisitos

- Node.js (v18 ou superior)
- MySQL rodando localmente ou via Docker
- Git instalado

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/ingridmaria-fdc/projeto-backend-nodejs-express.git
cd projeto-backend-nodejs-express
```

2. Instale as dependências:
```bash

npm install
```

3. Crie o arquivo .env na raiz do projeto com o seguinte conteúdo:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root0102
DB_NAME=project_backend_db
DB_PORT=3300
PORT=3000
```
4. Execute o projeto:
```bash

npm run dev
```
### Usuário Padrão
Use o seguinte usuário para autenticar e obter um token JWT válido:
```json
{
  "email": "admin@email.com",
  "password": "123@456"
}
```
