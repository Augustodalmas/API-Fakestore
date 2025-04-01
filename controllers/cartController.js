const Cart = require('../Models/Cart');
const Product = require('../Models/Products');
const User = require('../Models/User');

const cartController = {
    getALL: async (req, res) => {
        try {
            const carts = await Cart.find().populate('user', 'username').populate('product', 'title');
            res.json(carts);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro no servidor!" });
        }
    },

    get: async (req, res) => {
        if (!req.session.user) {
            return res.status(404);
        }
        const id = req.session.user.id;
        const user = await User.findOne({
            $or: [
                { _id: id }
            ]
        });
        const cart = await Cart.findOne({
            user: user._id,
            status: false
        });

        const productCount = {};
        if (cart) {
            cart.product.forEach(productId => {
                productCount[productId] = (productCount[productId] || 0) + 1;
            });
        }

        const products = await Product.find({
            _id: { $in: Object.keys(productCount) }
        });

        let restructuredProducts = products.map(product => ({
            title: req.cookies.lang === 'pt-BR' ? product.title.title_pt : req.cookies.lang === 'en-US' ? product.title.title_en : product.title.title_es,
            image: product.imagem,
            price: product.price,
            count: productCount[product._id],
            id: product.id
        }));

        const restructured = {
            id: cart._id,
            user: user.username,
            products: restructuredProducts,
        };
        res.status(200).json({ cart: restructured });
    },

    getById: async (req, res) => {
        if (!req.session.user) {
            return res.status(404);
        }
        const id = req.session.user.id;
        const user = await User.findOne({
            $or: [
                { _id: id }
            ]
        });
        const cart = await Cart.findOne({
            _id: req.params.id,
        });

        const productCount = {};
        if (cart) {
            cart.product.forEach(productId => {
                productCount[productId] = (productCount[productId] || 0) + 1;
            });
        }

        const products = await Product.find({
            _id: { $in: Object.keys(productCount) }
        });

        let restructuredProducts = products.map(product => ({
            title: req.cookies.lang === 'pt-BR' ? product.title.title_pt : req.cookies.lang === 'en-US' ? product.title.title_en : product.title.title_es,
            image: product.imagem,
            price: product.price,
            count: productCount[product._id],
            id: product.id
        }));

        const restructured = {
            user: user.username,
            products: restructuredProducts,
        };
        res.status(200).json({ cart: restructured });
    },

    getByUser: async (req, res) => {
        const id = req.session.user.id
        const user = await User.findOne({
            $or: [
                { _id: id }
            ]
        });
        const carts = await Cart.find({ user: user, status: true })


        res.status(200).json(carts)
    },

    post: async (req, res) => {
        try {
            let user = await User.findOne({
                $or: [
                    { username: req.session.user.username }
                ]
            });

            let cart = await Cart.findOne({ user: user._id, status: false });

            if (!cart) {
                cart = await Cart.create({
                    user: user._id,
                    product: [req.body.product],
                    status: false
                });
            } else {

                const value = await Product.findOne({ _id: req.body.product })
                cart.product.push(req.body.product);
                if (cart.totalprice && value.price) {
                    cart.totalprice += value.price;
                } else {
                    cart.totalprice = value.price;
                }
                await cart.save();
            }

            res.status(201).json({ msg: 'Produto adicionado com sucesso!', cart: cart });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Erro ao adicionar produto ao carrinho' });
        }
    },

    delete: async (req, res) => {
        try {
            let user = await User.findOne({
                $or: [
                    { username: req.session.user.username }
                ]
            });

            let cart = await Cart.findOne({ user: user._id, status: false });

            const value = await Product.findOne({ _id: req.body.product })
            if (cart.totalprice && value.price) {
                cart.totalprice -= value.price;
            }

            const index = cart.product.indexOf(req.body.product)
            cart.product.splice(index, 1)
            await cart.save()
            res.status(201).json({ msg: 'Produto removido com sucesso!', cart: cart });
        } catch (error) {
            console.log(error);

        }
    },

    close_cart: async (req, res) => {
        try {
            let user = await User.findOne({
                $or: [
                    { username: req.session.user.username }
                ]
            });

            let cart = await Cart.findOne({ user: user._id, status: false });

            if (!cart) {
                return res.status(404).json({ msg: "Carrinho não encontrado!" });
            }

            // cart.totalprice =
            cart.status = true;
            cart.data_fechamento = Date.now()
            user.history.push(cart);
            await user.save();
            await cart.save();

            // Criar novo carrinho para o usuário
            const newCart = await Cart.create({
                user: user._id,
                product: [],
                status: false,
                totalprice: 0
            });

            res.status(200).json({ msg: "Carrinho atualizado e novo carrinho criado com sucesso!", newCart });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro ao atualizar o carrinho", error: error.message });
        }
    },
};

module.exports = cartController;
