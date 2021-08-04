const { default: axios } = require("axios");
const puppeteer = require("puppeteer");
const { getProductDetails, searchProducts } = require("../../puppeteer");
// get product info, data format same as scraper API

exports.getProducts = async (req, res) => {
  const { productId } = req.params;
  try {
    const data = await getProductDetails(productId);
    res.status(200).json({ message: "product data", data });
  } catch (e) {
    res.status(404).json({ message: "product data not found" });
  }
};

exports.searchProducts = async (req, res) => {
  const { searchkey } = req.params;
  try {
    const data = await searchProducts(searchkey);
    res.status(200).json({ message: "search results", data });
  } catch (e) {
    res.status(404).json({ message: "search failed" });
  }
};
