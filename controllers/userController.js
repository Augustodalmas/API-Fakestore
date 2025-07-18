`Controlador de metodos http de categorias, get, post, put e delete`

const Cart = require("../Models/Cart");
const validation = require("../Models/JOI/JOIusers");
const User = require("../Models/User");
const { messages } = require("joi-translation-pt-br")
const { criptoAssim, criptografando, descriptografando } = require('../utils/crypto');
const jwt = require('jsonwebtoken');
const createUserToken = require("../Helpers/create-user-token");
const getToken = require('../Helpers/get-token')
const fs = require('fs');
const { log } = require("console");


const userController = {

    getALL: async (req, res) => {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: 'Erro no servidor' });
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;
            if (id.length !== 24 && id.length !== 12) {
                res.status(404).json({ msg: "ID encontrado Inválido" });
                return;
            }
            const singleUser = await User.findById(id)
            if (singleUser === null) {
                res.status(404).json({ msg: "Conta não encontrada!" });
                return;
            }
            res.json(singleUser)
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: 'Erro no servidor' });
        }
    },

    login: async (req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.password1;
            const user = await User.findOne({ username: username });
            if (user) {
                if (user.tentativas < 1) {
                    user.block = true
                    user.save()
                    return res.status(403).json({ msg: 'Usuário bloqueado. Entre em contato com o suporte.', success: false });
                }
                if (user.block === false) {
                    fs.readFile(`${__dirname}/../Keys/${user.username}private.pem`, async function (erro, data) {
                        if (erro) {
                            return res.status(403).json({ msg: 'Dados inválidos', success: false });
                        }
                        try {
                            const private = await descriptografando(user.password1, data.toString(), req.body.password1);
                            if (private === password) {
                                req.session.user = {
                                    id: user._id,
                                    username: user.username,
                                    role: user.role,
                                    data_nascimento: user.data_nascimento,
                                    email: user.email,
                                    name: user.name,
                                    address: user.address,
                                    telefone: user.telefone,
                                    favorite_address: user.favorite_address,
                                    products_reviewed: user.products_reviewed,
                                    block: user.block
                                };
                                user.tentativas = 4;
                                user.save()
                                return await createUserToken(user, req, res);
                            } else {
                                return res.json({ msg: 'Usuário bloqueado!' })
                            }
                        } catch (error) {
                            user.tentativas -= 1;
                            user.save()
                            return res.status(403).json({ msg: `Dados inválidos. Restam ${user.tentativas} tentativas.`, success: false });
                        }
                    });
                } else {
                    return res.status(403).json({ msg: 'Usuário bloqueado.' })
                }
            }
            else {
                user.tentativas -= 1;
                user.save()
                return res.status(403).json({ msg: `Usuário não encontrado. Restam ${user.tentativas} tentativas.`, success: false });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Erro no servidor', success: false });
        }
    },

    checkLogin: async (req, res) => {
        let currentUser

        if (req.headers.authorization) {
            if (req.session.user) {
                try {
                    const token = await getToken(req)
                    const decoded = jwt.verify(token, 'coxinha123')
                    currentUser = await User.findById(decoded.id)
                    currentUser.password1 = undefined
                    currentUser.password2 = undefined
                    return res.status(200).json({ msg: "usuario logado!", user: currentUser, status: 200 })
                } catch (error) {
                    return res.status(404).json({ msg: 'Usuário não encontrado' })
                }
            }
        } else {
            req.session.user = null
        }
        return res.status(403)
    },

    logout: async (req, res) => {
        if (req.session.user) {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).send('Erro ao remover a sessão.');
                }
                res.send('Sessão removida com sucesso!');
            });
        } else {
            res.status(404).send('Nenhuma sessão para remover.');
        }
    },

    create: async (req, res) => {
        try {
            const userExists = await User.findOne({ "username": req.body.username });
            if (userExists) {
                return res.status(409).json({ msg: "Usuário já existe!" });
            }

            const validationUser = validation.validate(req.body, { abortEarly: false, messages });
            if (validationUser.error) {
                const errors = validationUser.error.details.map(detail => detail.message);
                return res.status(422).send({ errors });
            }

            const keys = await criptoAssim(req.body.password1);
            const publicpass = await criptografando(req.body.password1, keys.publicKey)
            fs.writeFile(`${__dirname}/../Keys/${req.body.username}private.pem`, keys.privateKey, function (erro) { if (erro) { throw erro } })

            const newUser = new User({
                username: req.body.username,
                name: req.body.name,
                password1: publicpass,
                password2: publicpass,
                role: req.body.vendedor || 'comprador',
                email: 'sem email cadastrado',
                data_nascimento: 1 / 1 / 1900,
                address: [],
                products_reviewed: [],
                favorite_address: '000000000000000000000000',
                telefone: '000000000',
                public: keys.publicKey,
                block: false,
                tentativas: 4
            });

            req.session.user = {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
                data_nascimento: newUser.data_nascimento,
                email: newUser.email, name: newUser.name,
                address: newUser.address,
                telefone: newUser.telefone,
                favorite_address: newUser.favorite_address,
                products_reviewed: newUser.products_reviewed
            };

            const newCart = new Cart({
                user: newUser._id,
                product: [],
                status: false
            });

            await newCart.save();
            await newUser.save();
            return await createUserToken(newUser, req, res)
        } catch (error) {
            console.error("Erro ao criar Conta:", error);
            return res.status(500).json({ msg: "Erro ao criar Conta", error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            if (id.length !== 24 && id.length !== 12) {
                res.status(404).json({ msg: "ID encontrado Inválido" });
                return;
            }
            const deleteUser = await User.findByIdAndDelete(id)
            if (deleteUser === null) {
                res.status(404).json({ msg: "Conta não encontrada!" });
                return;
            }
            res.status(200).json({ deleteUser, msg: "Conta deletada com sucesso!" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: "Erro ao deletar uma conta", error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id;

            const users = {
                name: req.body.name,
                email: req.body.email,
                data_nascimento: req.body.data_nascimento,
                telefone: req.body.telefone,
                favorite_address: req.body.favorite_address
            };

            if (id.length !== 24 && id.length !== 12) {
                res.status(404).json({ msg: "ID encontrado Inválido" });
                return;
            }

            const updateUser = await User.findByIdAndUpdate(id, users, { new: true }); // 'new: true' retorna o documento atualizado.
            if (updateUser === null) {
                res.status(404).json({ msg: "Conta não encontrada!" });
                return;
            }

            if (req.session.user && req.session.user.id === id) {
                req.session.user = {
                    id: updateUser.id,
                    username: updateUser.username,
                    role: updateUser.role,
                    data_nascimento: updateUser.data_nascimento,
                    email: updateUser.email,
                    name: updateUser.name,
                    address: updateUser.address,
                    telefone: updateUser.telefone,
                    favorite_address: updateUser.favorite_address
                };
            }

            res.status(200).json({ msg: "Conta atualizada com sucesso!", user: updateUser });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro ao atualizar a conta", error: error.message });
        }
    },

    changeRole: async (req, res) => {
        const id = req.params.id;

        const users = {
            role: req.body.role
        };

        if (id.length !== 24 && id.length !== 12) {
            res.status(404).json({ msg: "ID encontrado Inválido" });
            return;
        }

        const updateUser = await User.findByIdAndUpdate(id, users, { new: true }); // 'new: true' retorna o documento atualizado.
        if (updateUser === null) {
            res.status(404).json({ msg: "Conta não encontrada!" });
            return;
        }

        if (req.session.user && req.session.user.id === id) {
            req.session.user = {
                id: updateUser.id,
                username: updateUser.username,
                role: updateUser.role,
                data_nascimento: updateUser.data_nascimento,
                email: updateUser.email,
                name: updateUser.name,
                address: updateUser.address,
                telefone: updateUser.telefone,
                favorite_address: updateUser.favorite_address
            };
        }
    },

    changeAcess: async (req, res) => {
        const id = req.params.id;

        const users = {
            block: req.body.block,
            tentativas: 3
        };

        if (id.length !== 24 && id.length !== 12) {
            res.status(404).json({ msg: "ID encontrado Inválido" });
            return;
        }

        const updateUser = await User.findByIdAndUpdate(id, users, { new: true });
        if (updateUser === null) {
            res.status(404).json({ msg: "Conta não encontrada!" });
            return;
        }

        if (req.session.user && req.session.user.id === id) {
            req.session.user = {
                id: updateUser.id,
                username: updateUser.username,
                role: updateUser.role,
                data_nascimento: updateUser.data_nascimento,
                email: updateUser.email,
                name: updateUser.name,
                address: updateUser.address,
                telefone: updateUser.telefone,
                favorite_address: updateUser.favorite_address
            };
        }
    }
};

module.exports = userController;