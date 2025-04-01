`Rotas necessárias para acessar as categorias`

const router = require('express').Router();
const userController = require('../controllers/userController');
const { roleRequired, logged } = require('../Models/roleMiddleware')

router.route("/")
    .get((req, res) => userController.getALL(req, res));

router.route("/checklogin")
    .get((req, res) => userController.checkLogin(req, res));

router.route("/logout")
    .get((req, res) => userController.logout(req, res));

router.route("/:id")
    .get((req, res) => userController.get(req, res));

router.route("/login")
    .post((req, res) => userController.login(req, res));

router.route("/")
    .post(userController.create);

router.route('/:id')
    .delete(roleRequired(['admin']), (req, res) => userController.delete(req, res));

router.route("/:id")
    .put(logged, (req, res) => userController.update(req, res));

router.route('/admin/:id')
    .put(roleRequired(['admin']), (req, res) => userController.changeRole(req, res))

router.route('/acess/:id')
    .put(roleRequired(['admin']), (req, res) => userController.changeAcess(req, res))

module.exports = router;