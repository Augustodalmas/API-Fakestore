`Rotas necessárias para acessar as produtos`

const router = require('express').Router();
const upload = require('../config/multer')
const productsController = require('../controllers/productController');
const { logged, roleRequired } = require('../Models/roleMiddleware');


router.route("/products")
    .post(logged, roleRequired(['gerente', 'admin', 'vendedor']), upload.array("imagem", 5), productsController.create);

router.route("/products/")
    .get((req, res) => productsController.getALL(req, res));

router.route("/products/:userID/:productID")
    .put((req, res) => productsController.rate(req, res));

router.route("/products/:id")
    .get((req, res) => productsController.get(req, res));

router.route("/products/category/:category")
    .get((req, res) => productsController.getByCategory(req, res));

router.route("/products/:id")
    .delete(logged, roleRequired(['admin']), (req, res) => productsController.delete(req, res));

router.route("/products/:id")
    .put(logged, roleRequired(['vendedor', 'gerente', 'admin']), upload.single("imagem"), productsController.update);

router.route("/pagamento")
    .post((req, res) => productsController.buy(req, res));

router.route("/pagamento")
    .get((req, res) => productsController.verifyPayment(req, res));

module.exports = router;