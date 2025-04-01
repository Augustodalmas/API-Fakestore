const Address = require('../Models/Address');
const User = require('../Models/User');

const addressController = {
    get: async (req, res) => {
        try {
            const id = req.params.id
            const address = await Address.findById(id)
            return res.status(200).json(address)
        } catch (error) {
            console.log(error);
        }
    },

    getByUser: async (req, res) => {
        const userID = req.session.user.id
        const address = await Address.find({
            User: { $in: [userID] }
        })
        res.status(200).json(address)
    },

    post: async (req, res) => {
        try {
            const userloggin = await User.findById(req.session.user.id)

            const newAddress = await Address.create({
                User: req.session.user.id,
                CEP: req.body.cep,
                Bairro: req.body.bairro,
                Estado: req.body.estado,
                Logradouro: req.body.logradouro,
                Numero: req.body.numero,
                Complemento: req.body.complemento,
                UF: req.body.uf,
            })
            userloggin.address.push(newAddress)
            req.session.user.address.push(newAddress._id)
            userloggin.save()
            res.status(200).json({ msg: 'Endereço cadastrado com sucesso!', newAddress })
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = addressController;
