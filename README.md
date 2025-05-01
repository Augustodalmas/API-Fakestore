
# 🛒 API-Fakestore

Esta é uma API RESTful para uma loja fictícia, desenvolvida como parte de um treinamento profissional. Este backend fornece endpoints para gerenciamento de produtos, usuários, categorias e autenticação, servindo como base para uma aplicação frontend em React.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JWT para autenticação
- EJS para renderização de views (se aplicável)

## 📁 Estrutura do Projeto

A estrutura do projeto está organizada da seguinte forma:

```
API-Fakestore/
├── app.js
├── package.json
├── config/
│   └── db.js
├── controllers/
├── models/
├── routes/
├── views/
├── utils/
├── locales/
├── db/
├── Helpers/
└── node_modules/
```

## 🔧 Instalação e Execução

1. Clone o repositório:

   ```bash
   git clone https://github.com/Augustodalmas/API-Fakestore.git
   cd API-Fakestore
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Inicie o servidor:

   ```bash
   npm run dev
   ```

   O servidor estará disponível em `http://localhost:3000`.

## 📌 Endpoints Principais

A API oferece os seguintes endpoints:

- **Produtos**:
  - `GET /products` – Lista todos os produtos
  - `GET /products/:id` – Detalhes de um produto específico
  - `POST /products` – Cria um novo produto
  - `PUT /products/:id` – Atualiza um produto existente
  - `DELETE /products/:id` – Remove um produto

- **Usuários**:
  - `GET /users` – Lista todos os usuários
  - `GET /users/:id` – Detalhes de um usuário específico
  - `POST /users` – Cria um novo usuário
  - `PUT /users/:id` – Atualiza um usuário existente
  - `DELETE /users/:id` – Remove um usuário

- **Autenticação**:
  - `POST /auth/login` – Realiza o login e retorna um token JWT

- **Categorias**:
  - `GET /categories` – Lista todas as categorias
  - `GET /categories/:id` – Detalhes de uma categoria específica
