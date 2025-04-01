`Rotas necessárias para acessar as categorias`

const router = require('express').Router();

const categoriesController = require('../controllers/categoriesController');
const { logged, roleRequired } = require('../Models/roleMiddleware')

router.route("/categories")
    .get((req, res) => categoriesController.getALL(req, res));

router.route("/categories/:id")
    .get((req, res) => categoriesController.get(req, res));

router.route("/categories")
    .post(logged, roleRequired(['gerente', 'admin']), categoriesController.create);

router.route("/categories/:id")
    .delete(logged, roleRequired(['admin']), (req, res) => categoriesController.delete(req, res));

router.route("/categories/:id")
    .put(logged, roleRequired(['gerente', 'admin']), (req, res) => categoriesController.update(req, res));

module.exports = router;