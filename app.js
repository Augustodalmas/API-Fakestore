`APP principal da aplicação`
//Libs
const express = require('express');
const cors = require("cors")
const listEndpoints = require('express-list-endpoints');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//Atribuição do express
const app = express();

app.use(session({
    secret: 'senha-forte',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(express.static('public'))
//configurações do express
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

//Coneção com MongoDB
const conn = require("./db/conn.js");
conn();

// Rotas
const routes = require('./routes/router.js')
app.use('/', routes);

// Static - servir as imagens
app.use("/img", express.static("uploads"))

const PORT = 3000
app.listen(PORT, function () {
    console.log(`Servidor rodando na porta ${PORT}`)
    console.log(listEndpoints(app));
})