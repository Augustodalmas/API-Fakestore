`Responsável pela conexão com o banco de dados mongoDB`

const mongoose = require('mongoose')

//Função responsavel pela conexão no banco de dados fakestore que se encontra no MongoDB
async function main() {
    const PORT = 27017
    try {
        await mongoose.connect('mongodb://mongodb:27017/fakestore')
        console.log(`conectou ao banco MongoDB na porta ${PORT}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = main