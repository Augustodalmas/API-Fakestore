const bcrypt = require('bcrypt');
const crypto = require('crypto');

// async function hashPassword(password) {
//     const saltRounds = 10;
//     const hash = await bcrypt.hash(password, saltRounds);
//     return hash;
// }

// async function comparePasswords(plainPassword, hashedPassword) {
//     const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
//     return isMatch;
// }

async function criptoAssim(passphrase) {
    function generateKeyPair(passphrase) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096, // Tamanho da chave
            publicKeyEncoding: {
                type: 'spki', // Codificação do padrão de chave pública
                format: 'pem' // Formato PEM
            },
            privateKeyEncoding: {
                type: 'pkcs8', // Codificação do padrão de chave privada
                format: 'pem', // Formato PEM
                cipher: 'aes-256-cbc', // Algoritmo de cifra
                passphrase: passphrase // Senha para proteção da chave privada
            },
        });
        return {
            publicKey,
            privateKey
        };
    }
    try {
        const keys = generateKeyPair(passphrase);
        return keys;
    } catch (error) {
        console.error('Erro ao gerar as chaves:', error);
    }
}

async function criptografando(senha, keyPu) {
    const encrypt = (senha, keyPu) => {
        const buffer = Buffer.from(senha, 'utf8');
        return crypto.publicEncrypt(keyPu, buffer).toString('base64');
    };

    try {
        const encryptedSenha = encrypt(senha, keyPu);
        return encryptedSenha;
    } catch (error) {
        console.error("Erro durante a criptografia:", error.message);
        throw error;
    }
}

async function descriptografando(criptoSenha, keyPv, senha) {
    const decrypt = (criptoSenha, keyPv, senha) => {
        const buffer = Buffer.from(criptoSenha, 'base64');
        return crypto.privateDecrypt({ key: keyPv, passphrase: senha }, buffer).toString('utf8');
    };

    try {
        const decryptedSenha = decrypt(criptoSenha, keyPv, senha);
        return decryptedSenha;
    } catch (error) {
        console.error("Erro durante a descriptografia:", error.message);
        throw error;
    }
}

module.exports = { criptoAssim, criptografando, descriptografando };