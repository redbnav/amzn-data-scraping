const { getProducts, searchProducts } = require("../controller");

const router = require("express").Router();

router.get("/products/:productId", getProducts);
// router.get("/products/:productId/offers", getProductOffers);
// router.get("/products/:productId/reviews", getProductReviews);
router.get("/search/:searchKey", searchProducts);
module.exports = router;
