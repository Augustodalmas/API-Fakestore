`Configuração do multer para realização de upload de imagens, armazenando localmente`

const multer = require('multer');
const path = require("path");

//Função para armazenar os arquivos dentro da pasta uploads com o nome usando a Data atual + extensão atual
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.resolve("uploads"));
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage});

module.exports = upload;