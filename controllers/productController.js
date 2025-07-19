`Controlador de metodos http de produtos, get, post, put e delete`

const Product = require("../Models/Products");
const User = require("../Models/User");
const Category = require("../Models/Categories");
const validationUser = require("../Models/JOI/JOIproducts");
const { messages } = require("joi-translation-pt-br");
const Cart = require("../Models/Cart");
const { name } = require("ejs");
const stripe = require('stripe')('sk_test_51Q6bO9RsMpUUe6PW59pPbeasiX9lY3vP4G0Pve4HmEf5eRkbcveu2WaHQ3Iq1gb2NRFSYjNqLLX2ywfd7adjUUGy00SiGr8osR')



//Função controladora de metodos
const productsController = {
    //Retorna todos os dados de produtos
    getALL: async (req, res) => {
        let restructured = []
        try {
            if (req.cookies.lang === 'pt-BR') {
                //Recebe os produtos removendo o _ID de category e de rating
                const products = await Product.find().populate({ path: 'category', select: 'name_pt -_id' })
                    .select('-rating._id');
                //Reestruturação dos dados para ficar conforme o desejado
                restructured = products.map(product => ({
                    id: product._id,
                    title: product.title.title_pt,
                    price: product.price,
                    description: product.description.description_pt,
                    category: product.category.name_pt,
                    imagem: product.imagem,
                    rating: {
                        rate: product.rating.rate.toFixed(2),
                        count: product.rating.count,
                    }

                }))
            } else if (req.cookies.lang === 'en-US') {
                const products = await Product.find().populate({ path: 'category', select: 'name_en -_id' })
                    .select('-rating._id');
                restructured = products.map(product => ({
                    id: product._id,
                    title: product.title.title_en,
                    price: product.price,
                    description: product.description.description_en,
                    category: product.category.name_en,
                    imagem: product.imagem,
                    rating: {
                        rate: product.rating.rate.toFixed(2),
                        count: product.rating.count,
                    }
                }))
            } else {
                const products = await Product.find().populate({ path: 'category', select: 'name_es -_id' })
                    .select('-rating._id');
                restructured = products.map(product => ({
                    id: product._id,
                    title: product.title.title_es,
                    price: product.price,
                    description: product.description.description_es,
                    category: product.category.name_es,
                    imagem: product.imagem,
                    rating: {
                        rate: product.rating.rate.toFixed(2),
                        count: product.rating.count,
                    }
                }))
            }
            //Função que deveria retornar os itens pelo ID, mas está pelo rate
            if (req.query.sort) {
                if (req.query.sort === "asc") {
                    const ascProduct = restructured.sort((a, b) => a.rating.rate - b.rating.rate)
                    let pageCount = Math.ceil(ascProduct.length / 9)
                    let page = parseInt(req.query.p)
                    if (!page) { page = 1 }
                    if (page > pageCount) {
                        page = pageCount
                    }
                    res.json({
                        'page': page,
                        'pageCount': pageCount,
                        'products': ascProduct.slice(page * 9 - 9, page * 9)
                    });
                } else if (req.query.sort === "desc") {
                    const descProduct = restructured.sort((a, b) => b.rating.rate - a.rating.rate)
                    let pageCount = Math.ceil(descProduct.length / 9)
                    let page = parseInt(req.query.p)
                    if (!page) { page = 1 }
                    if (page > pageCount) {
                        page = pageCount
                    }
                    res.json({
                        'page': page,
                        'pageCount': pageCount,
                        'products': descProduct.slice(page * 9 - 9, page * 9)
                    });
                } else {
                    let pageCount = Math.ceil(restructured.length / 9)
                    let page = parseInt(req.query.p)
                    if (!page) { page = 1 }
                    if (page > pageCount) {
                        page = pageCount
                    }
                    res.json({
                        'page': page,
                        'pageCount': pageCount,
                        'products': restructured.slice(page * 9 - 9, page * 9)
                    });
                }
            } else {
                let pageCount = Math.ceil(restructured.length / 9)
                let page = parseInt(req.query.p)
                if (!page) { page = 1 }
                if (page > pageCount) {
                    page = pageCount
                }
                res.json({
                    'page': page,
                    'pageCount': pageCount,
                    'products': restructured.slice(page * 9 - 9, page * 9)
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },
    //Retorna um produto baseado pelo seu ID
    get: async (req, res) => {
        let productSelect = []
        try {
            const id = req.params.id;
            if (id.length !== 24 && id.length !== 12) {
                res.status(404).json({ msg: "ID encontrado Inválido" });
                return;
            }
            if (req.cookies.update === "1") {
                const product = await Product.findById(id).select('-rating._id')
                    .populate({ path: 'category', select: 'name_pt name_en name_es -_id' })
                //Reestruturação dos dados para ficar conforme o desejado
                productSelect = ({
                    id: product._id,
                    title_pt: product.title.title_pt,
                    title_en: product.title.title_en,
                    title_es: product.title.title_es,
                    price: product.price,
                    description_pt: product.description.description_pt,
                    description_en: product.description.description_en,
                    description_es: product.description.description_es,
                    categorypt: product.category.name_pt,
                    categoryen: product.category.name_en,
                    categoryes: product.category.name_es,
                    imagem: product.imagem,
                    rating: {
                        rate: product.rating.rate.toFixed(2),
                        count: product.rating.count,
                    }
                })
            } else {
                if (req.cookies.lang === 'pt-BR') {
                    const product = await Product.findById(id).select('-rating._id')
                        .populate({ path: 'category', select: 'name_pt -_id' })
                    //Reestruturação dos dados para ficar conforme o desejado
                    productSelect = ({
                        id: product._id,
                        title: product.title.title_pt,
                        price: product.price,
                        description: product.description.description_pt,
                        category: product.category.name_pt,
                        imagem: product.imagem,
                        rating: {
                            rate: product.rating.rate.toFixed(2),
                            count: product.rating.count,
                        }
                    })
                } else if (req.cookies.lang === 'en-US') {
                    const product = await Product.findById(id).select('-rating._id')
                        .populate({ path: 'category', select: 'name_en -_id' })
                    //Reestruturação dos dados para ficar conforme o desejado
                    productSelect = ({
                        id: product._id,
                        title: product.title.title_en,
                        price: product.price,
                        description: product.description.description_en,
                        category: product.category.name_en,
                        imagem: product.imagem,
                        rating: {
                            rate: product.rating.rate.toFixed(2),
                            count: product.rating.count,
                        }
                    })
                } else {
                    const product = await Product.findById(id).select('-rating._id')
                        .populate({ path: 'category', select: 'name_es -_id' })
                    //Reestruturação dos dados para ficar conforme o desejado
                    productSelect = ({
                        id: product._id,
                        title: product.title.title_es,
                        price: product.price,
                        description: product.description.description_es,
                        category: product.category.name_es,
                        imagem: product.imagem,
                        rating: {
                            rate: product.rating.rate.toFixed(2),
                            count: product.rating.count,
                        }
                    })
                }
            }
            if (productSelect === null) {
                res.status(404).json({ msg: "Produto não encontrado!" });
                return;
            }
            res.json(productSelect)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },
    //Retorna os produtos baseados pela sua categoria
    getByCategory: async (req, res) => {
        let restructured = []
        try {
            //Pega o nome da categoria pelos parametros da URL
            const categoryName = req.params.category;

            if (req.cookies.lang === "pt-BR") {
                //Producra dentro do banco em Category se ele existe
                const categoryModel = await Category.findOne({ name_pt: categoryName });
                if (!categoryModel) {
                    return res.status(404).json({ message: 'Categoria não encontrada' });
                }
                //Faz a pesquisa dentro de produtos, baseando-se pelo ID da categoria
                const products = await Product.find({ category: categoryModel._id });

                //Reestruturação dos dados para ficar conforme o desejado
                restructured = products.map(product => ({
                    id: product._id,
                    title: product.title.title_pt,
                    price: product.price,
                    description: product.description.description_pt,
                    category: categoryModel.name_pt,
                    imagem: product.imagem,
                    rating: {
                        rate: product.rating.rate.toFixed(2),
                        count: product.rating.count,
                    }
                }));
                res.json(restructured);
            } else if (req.cookies.lang === "en-US") {
                const categoryModel = await Category.findOne({ name_en: categoryName });
                if (!categoryModel) {
                    return res.status(404).json({ message: 'Categoria não encontrada' });
                }
                const products = await Product.find({ category: categoryModel._id });
                restructured = products.map(product => ({
                    id: product._id,
                    title: product.title.title_en,
                    price: product.price,
                    description: product.description.description_en,
                    category: categoryModel.name_en,
                    imagem: product.imagem,
                    rating: {
                        rate: product.rating.rate.toFixed(2),
                        count: product.rating.count,
                    }
                }));
                res.json(restructured);
            } else if (req.cookies.lang === "es") {
                const categoryModel = await Category.findOne({ name_es: categoryName });
                if (!categoryModel) {
                    return res.status(404).json({ message: 'Categoria não encontrada' });
                }
                const products = await Product.find({ category: categoryModel._id });
                restructured = products.map(product => ({
                    id: product._id,
                    title: product.title.title_es,
                    price: product.price,
                    description: product.description.description_es,
                    category: categoryModel.name_es,
                    imagem: product.imagem,
                    rating: {
                        rate: product.rating.rate.toFixed(2),
                        count: product.rating.count,
                    }
                }));
                res.json(restructured);
            } else {
                return res.status(404).json({ msg: "Cookies indefinidos" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },
    //Criação de produtos
    create: async (req, res) => {
        const category_select = req.body.category.toLowerCase()
        let category = await Category.findOne({
            $or: [
                { name_pt: category_select },
                { name_en: category_select },
                { name_es: category_select }
            ]

        });

        try {
            if (req.files === undefined && req.body.imagem === undefined) {
                return res.status(422).send({ msg: "Imagem é obrigatória" })
            }
            try {
                const validation = validationUser.validate(req.body, { abortEarly: false, messages });
                if (validation.error) {
                    const erros = validation.error.details.map(detail => detail.message)
                    return res.status(422).send(erros)
                }
            } catch (e) {
                console.log(e)
            }

            const imagens = req.files ? req.files.map(file => file.filename) : [req.body.imagem]
            console.log(req.body);

            const product = await Product.create({
                title: {
                    title_pt: req.body.title.title_pt,
                    title_en: req.body.title.title_en,
                    title_es: req.body.title.title_es
                },
                price: Number(req.body.price),
                description: {
                    description_pt: req.body.description.description_pt,
                    description_en: req.body.description.description_en,
                    description_es: req.body.description.description_es
                },
                category: category._id,
                imagem: imagens,
                rating: {
                    rate: parseFloat(0),
                    count: parseInt(0),
                },
                id_stripe: '',
                id_stripe_prod: ''
            });

            const stripe_product = await stripe.products.create({
                name: req.body.title.title_pt,
                description: req.body.description.description_pt,
                images: [req.body.imagem],
                default_price_data: {
                    unit_amount: req.body.price * 100,
                    currency: 'brl',
                },
                expand: ['default_price'],
            });
            product.id_stripe = stripe_product.default_price.id
            product.id_stripe_prod = stripe_product.id
            product.save()

            res.status(201).json({ product, msg: "Produto criado com sucesso!", status: 201 })
        } catch (error) {
            console.log("Erro ao criar produto:", error);
            return res.status(500).json({ msg: "Erro ao criar produto", error: error.message });
        }
    },
    //Metodo para deletar uma produto baseado pelo ID
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            if (id.length !== 24 && id.length !== 12) {
                res.status(404).json({ msg: "ID encontrado Inválido" });
                return;
            }
            const deleteProduct = await Product.findByIdAndDelete(id)
            const deleteStripeProd = await stripe.products.update(deleteProduct.id_stripe_prod, { active: false })
            const deleteStripePrice = await stripe.prices.update(deleteProduct.id_stripe, { active: false })
            if (deleteProduct === null) {
                res.status(404).json({ msg: "Produto não encontrado!" });
                return;
            }
            if (req.cookies.lang === "pt-BR") {
                return res.status(200).json({ deleteProduct, msg: "Produto deletado com sucesso!" })
            } else if (req.cookies.lang === 'en-US') {
                return res.status(200).json({ deleteProduct, msg: "Product deleted successfully!" })
            } else {
                return res.status(200).json({ deleteProduct, msg: "¡Producto eliminado exitosamente!" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: "Erro ao deletar o produto", error: error.message });
        }
    },
    //Metodo para atualizar alguma informação de produto
    update: async (req, res) => {
        const category_select = req.body.category.toLowerCase();
        let category = await Category.findOne({
            $or: [
                { name_pt: category_select },
                { name_en: category_select },
                { name_es: category_select }
            ]
        });

        if (!category) {
            return res.status(404).json({ msg: "Categoria não encontrada!" });
        }

        try {
            const id = req.params.id;
            if (id.length !== 24 && id.length !== 12) {
                return res.status(404).json({ msg: "ID encontrado Inválido" });
            }

            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return res.status(404).json({ msg: "Produto não encontrado!" });
            }

            const updatedProduct = {
                title: {
                    title_pt: req.body.title?.title_pt || existingProduct.title.title_pt,
                    title_en: req.body.title?.title_en || existingProduct.title.title_en,
                    title_es: req.body.title?.title_es || existingProduct.title.title_es
                },
                price: req.body.price || existingProduct.price,
                description: {
                    description_pt: req.body.description?.description_pt || existingProduct.description.description_pt,
                    description_en: req.body.description?.description_en || existingProduct.description.description_en,
                    description_es: req.body.description?.description_es || existingProduct.description.description_es
                },
                category: category._id,
                imagem: req.file ? req.file.filename : existingProduct.imagem,
            };

            const updateProduct = await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
            if (!updateProduct) {
                return res.status(404).json({ msg: "Produto não encontrado!" });
            }
            const newPrice = await stripe.prices.create({
                unit_amount: req.body.price * 100 || existingProduct.price * 100,
                currency: 'brl',
                product: updateProduct.id_stripe_prod,
            });

            const prods = await stripe.products.update(updateProduct.id_stripe_prod, {
                name: req.body.title?.title_pt || existingProduct.title.title_pt,
                description: req.body.description?.description_pt || existingProduct.description.description_pt,
                default_price: updateProduct.id_stripe
            })
            if (req.cookies.lang === "pt-BR") {
                return res.status(200).json({ msg: "Produto atualizado com sucesso!", product: updateProduct });
            } else if (req.cookies.lang === 'en-US') {
                return res.status(200).json({ msg: "Product updated successfully!", product: updateProduct });
            } else {
                return res.status(200).json({ msg: "¡Producto actualizado correctamente!", product: updateProduct });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro ao atualizar o produto", error: error.message });
        }
    },

    rate: async (req, res) => {
        try {
            const userID = req.params.userID
            const productID = req.params.productID

            const user = await User.findById(userID).populate({
                path: 'history',
                populate: { path: 'product', model: 'Product' }
            });

            if (!user) {
                return res.status(404).json({ msg: "Usuário não encontrado!" });
            }

            const purchasedProduct = user.history.some(cart =>
                cart.product.some(product => product._id.toString() === productID)
            );

            if (purchasedProduct) {
                const product = await Product.findById(productID);
                if (!product) {
                    return res.status(404).json({ msg: "Produto não encontrado!" });
                }

                user.products_reviewed.push(product)
                req.session.user.products_reviewed.push(product.id)
                await user.save()
                const newRating = (product.rating.rate * product.rating.count + req.body.rating.rate) / (product.rating.count + 1);

                const updatedProduct = await Product.findByIdAndUpdate(productID, {
                    $set: { 'rating.rate': newRating },
                    $inc: { 'rating.count': 1 }
                }, { new: true });
                if (req.cookies.lang === "pt-BR") {
                    return res.status(200).json({ msg: 'Avaliação feita com sucesso!', product: updatedProduct, status: 200 });
                } else if (req.cookies.lang === 'en-US') {
                    return res.status(200).json({ msg: 'Assessment completed successfully!', product: updatedProduct, status: 200 });
                } else {
                    return res.status(200).json({ msg: '¡Evaluación completada con éxito!', product: updatedProduct, status: 200 });
                }
            } else {
                return res.status(403).json({ msg: 'Você não tem permissão para avaliar este produto.', canRate: false });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro no servidor!" });
        }
    },

    buy: async (req, res) => {
        let user = await User.findOne({
            $or: [
                { username: req.session.user.username }
            ]
        });

        let cart = await Cart.findOne({ user: user._id, status: false });
        const productCount = {};
        if (cart) {
            cart.product.forEach(productId => {
                productCount[productId] = (productCount[productId] || 0) + 1;
            });
        }

        const products = await Product.find({
            _id: { $in: Object.keys(productCount) }
        });

        const listItens = products.map((product) => ({
            price: product.id_stripe,
            quantity: productCount[product._id],
        }))
        const session = await stripe.checkout.sessions.create({
            line_items: listItens,
            mode: 'payment',
            success_url: "http://localhost:5173",
            cancel_url: "http://localhost:5173"
        })
        req.session.stripe_id = session.id
        res.status(201).json({ id: session.url })
    },

    verifyPayment: async (req, res) => {
        try {
            const sessionID = req.session.stripe_id

            if (!sessionID) {
                return res.status(400).json({ error: 'ID da sessão não fornecido' });
            }
            const session = await stripe.checkout.sessions.retrieve(sessionID);

            if (session.payment_status === 'paid') {
                req.session.stripe_id = undefined
                return res.status(200).json({ success: true });
            } else {
                return res.status(200).json({ success: false });
            }
        } catch (error) {
            console.log(error);

        }
    }
};

module.exports = productsController;

