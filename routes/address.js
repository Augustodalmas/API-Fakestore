const router = require('express').Router();

const addressController = require('../controllers/AddressController');
const { logged, roleRequired } = require('../Models/roleMiddleware')

router.route("/:id")
    .get((req, res) => addressController.get(req, res));

router.route("/user/:id")
    .get((req, res) => addressController.getByUser(req, res));

router.route("/")
    .post((req, res) => addressController.post(req, res));


module.exports = router;