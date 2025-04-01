`Centralizador de rodas`

const router = require('express').Router();

const productsRouter = require('./products');
const categoriesRoute = require("./categories");
const userRouter = require("./user");
const cartRouter = require("./carts");
const addressRouter = require("./address");

router.use("/products", categoriesRoute)
router.use("/", productsRouter)
router.use("/user", userRouter)
router.use('/cart', cartRouter)
router.use('/address', addressRouter)

module.exports = router