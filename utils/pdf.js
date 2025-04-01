// const fs = require('fs');
const pdf = require('html-pdf');
const ejs = require('ejs');
const Cart = require('../Models/Cart');
const User = require('../Models/User');
const Product = require('../Models/Products');
const Address = require('../Models/Address');
const { error } = require('../Models/JOI/JOIproducts');

const generatePDF = async (req, res) => {

    try {


        const id = req.session.user.id;
        const user = await User.findOne({
            $or: [
                { _id: id }
            ]
        });
        const cart = await Cart.findOne({
            _id: req.params.id
        });

        if (!cart) {
            return res.status(404).json({ msg: "Carrinho não encontrado!" });
        }

        const productCount = {};
        if (cart) {
            cart.product.forEach(productId => {
                productCount[productId] = (productCount[productId] || 0) + 1;
            });
        }

        const products = await Product.find({
            _id: { $in: Object.keys(productCount) }
        });

        const priceTotalperProduct = products.map(prod => ({
            total: productCount[prod._id] * prod.price
        }));

        const productsdata = products.map((prod, index) => ({
            title: prod.title.title_pt,
            count: productCount[prod._id],
            total: priceTotalperProduct[index].total,
            imagem: prod.imagem,
            price: prod.price
        }));

        const totalPrice = productsdata.reduce((sum, prod) => sum + prod.total, 0);

        const formattedDate = new Date(cart.data_fechamento).toLocaleDateString('pt-BR');

        const AddressUser = await Address.findById(user.favorite_address)

        const data = {
            cart: cart._id,
            user: user,
            address: AddressUser,
            products: productsdata,
            date: formattedDate,
            total: totalPrice
        };

        ejs.renderFile('./views/nota-fiscal.ejs', data, (err, html) => {
            if (err) {
                console.log(err);

                return res.status(500).json({ msg: "Erro ao renderizar o template, usuario sem endereço", error: err.message });
            }

            const options = {
                type: 'pdf',
                format: 'A4',
                orientation: 'portrait'
            };

            pdf.create(html, options).toFile(`C:/Users/augusdal/Downloads/Nota-Fiscal-${cart._id}.pdf`, function (err, result) {

                if (err) {
                    return res.status(500).json({ msg: "Erro ao gerar PDF", error: err.message });
                }
                return res.status(200).json({ msg: "PDF gerado com sucesso!" });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Erro ao gerar PDF", error: error.message });
    }
};

module.exports = { generatePDF };
