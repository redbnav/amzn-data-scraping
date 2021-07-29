const { default: axios } = require("axios");
const { generateEZScraperURL } = require("../../utils");

// product
exports.getProducts = async (req, res) => {
  const { productId } = req.params;
  const { apiKey } = req.query;
  console.log(productId, apiKey);
  try {
    const result = await axios.get(
      `${generateEZScraperURL(apiKey)}&url=https://amazon.com/dp/${productId}`
    );
    const data = result.data;
    res.status(200).json({ message: "requested product data", data });
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "data not found" });
  }
};

// product reviews
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const { apiKey } = req.query;

  try {
    console.log(
      `${generateEZScraperURL(
        apiKey
      )}&url=https://amazon.com/product-reviews/${productId}`
    );
    const result = await axios.get(
      `${generateEZScraperURL(
        apiKey
      )}&url=https://amazon.com/product-reviews/${productId}`
    );

    const data = result.data;
    res.status(200).json({ message: "requested product review data", data });
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "data not found" });
  }
};

// offers
exports.getProductOffers = async (req, res) => {
  const { productId } = req.params;
  const { apiKey } = req.query;
  try {
    const result = await axios.get(
      `${generateEZScraperURL(
        apiKey
      )}&url=https://amazon.com/gp/offer-listing/${productId}`
    );
    const data = result.data;
    res.status(200).json({ message: "requested product offers data", data });
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "data not found" });
  }
};

exports.searchProducts = async (req, res) => {
  const { searchKey } = req.params;
  const { apiKey } = req.query;
  try {
    const result = await axios.get(
      `${generateEZScraperURL(apiKey)}&url=https://amazon.com/s?k=${searchKey}`
    );
    const data = result.data;
    res.status(200).json({ message: "requested product offers data", data });
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "data not found" });
  }
};
