`Rotas necessárias para acessar as categorias`

const router = require('express').Router();

const cartController = require('../controllers/cartController');
const pdfcreate = require('../utils/pdf')
const { logged, roleRequired } = require('../Models/roleMiddleware')

router.route("/")
    .get(logged, (req, res) => cartController.getALL(req, res));

router.route("/mycart")
    .get(logged, (req, res) => cartController.get(req, res));

router.route("/mycart/remove")
    .delete(logged, (req, res) => cartController.delete(req, res));

router.route("/:id")
    .get(logged, (req, res) => cartController.getById(req, res));

router.route("/user/:user")
    .get(logged, (req, res) => cartController.getByUser(req, res));

router.route("/:id")
    .delete(logged, (req, res) => cartController.close_cart(req, res));

router.route("/")
    .post(logged, (req, res) => cartController.post(req, res));

router.route("/pdf/:id").get(logged, (req, res) => pdfcreate.generatePDF(req, res));

module.exports = router;