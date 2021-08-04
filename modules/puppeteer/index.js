const puppeteer = require("puppeteer");

exports.getProductDetails = async (productId) => {
  let data = {};
  let custContEle;
  let customizationOptions = {};
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.amazon.com/dp/${productId}`);
  // data.name
  const prodName = await (
    await (
      await page.$("[id*='_feature_div'] #productTitle")
    ).getProperty("innerText")
  ).jsonValue();

  // data.product info
  const prodInfo = await page.$("#dpx-product-details_feature_div");

  // product info details
  const productInfoDetails = (await prodInfo)
    ? prodInfo.$$eval("tr", (ele) => {
        return ele.map((el) => ({
          [el.querySelector("th").innerText]: el.querySelector("td").innerText,
        }));
      })
    : {};

  const brandInfo = await page.$("#bylineInfo_feature_div");
  const brand = await (await brandInfo.getProperty("innerText")).jsonValue();

  const brandURL = await (
    await (await brandInfo.$("a")).getProperty("href")
  ).jsonValue();

  // product description
  const productDescriptionEle = await page.$("#productDescription p");
  const productDescription = await (productDescriptionEle
    ? (await productDescriptionEle.getProperty("innerText")).jsonValue()
    : "");

  // list_price
  const listPrice = "";

  // price
  const priceEle = await page.$("#priceblock_ourprice");
  const price = (await priceEle)
    ? await (await priceEle.getProperty("innerText")).jsonValue()
    : "";

  // availability_status
  const availabilityStatus = "";

  //images list
  const images = await page.$$eval(".imageThumbnail img", (ele) =>
    ele.map((e) => (e ? e.getAttribute("src") : null))
  );

  // "product_category": "",
  const productCategory = "";

  // average_rating
  const averageRatingEle = await await page.$("#averageCustomerReviews");
  const averageRating = await (
    await (await averageRatingEle.$(".a-icon-alt")).getProperty("innerText")
  ).jsonValue();
  const avgRate = averageRating.substr(0, 3);

  // small description
  const smallDescEle = await page.$("#featurebullets_feature_div");
  const smallDesc = await (smallDescEle
    ? (await smallDescEle.getProperty("innerText")).jsonValue()
    : "");

  // total reviews
  const totalReviews = await (
    await (
      await averageRatingEle.$("#acrCustomerReviewText")
    ).getProperty("innerText")
  ).jsonValue();
  const totReviews = totalReviews.split(" ")[0];

  // total_questions_answered
  const totalQueAnsdEle = await page.$("#ask_feature_div .a-size-base");
  const totalQueAnsd = await (totalQueAnsdEle
    ? (await totalQueAnsdEle.getProperty("innerText")).jsonValue()
    : "");

  // select all possible customization options using queryselector wild card with "variation"

  const customizationContainerEle = await page.$("#twisterContainer");
  if (customizationContainerEle) {
    custContEle = await customizationContainerEle.$$eval(
      `[id*="variation"]`,
      (ele) =>
        ele.map((el) => {
          const labelText = el.querySelector(".a-row .a-form-label").innerText;
          const label = labelText.replace(/[^a-z]/gi, "");
          if (el.querySelector("ul")) {
            d = Array.from(el.querySelector("ul").querySelectorAll("li")).map(
              (e) => {
                return {
                  value:
                    e.innerText ||
                    e.querySelector("img").getAttribute("alt") ||
                    "",
                  is_selected:
                    e.getAttribute("class") === "swatchSelect" ? true : false,
                  url: e.getAttribute("data-dp-url")
                    ? `https://amazon.com${e.getAttribute("data-dp-url")}`
                    : "",
                  img: e.querySelector("img")
                    ? e.querySelector("img").getAttribute("src")
                    : "",
                };
              }
            );
          }
          if (el.querySelector("select")) {
            d = Array.from(
              el.querySelector("select").querySelectorAll("option")
            ).map((e) => {
              return {
                asin: e.getAttribute("value").split(",")[1],
                is_selected: e["selected"],
                value: e.getAttribute("data-a-html-content"),
              };
            });
            d = d.filter((e) => e.asin);
          }
          return { [label]: d };
        })
    );
  }
  (await custContEle)
    ? custContEle.forEach((e) => Object.assign(customizationOptions, e))
    : custContEle;

  //

  data["name"] = prodName;
  data["product_information"] = productInfoDetails;
  data["brand"] = brand;
  data["brand_url"] = brandURL;
  data["full_description"] = productDescription;
  data["pricing"] = price;
  data["last_price"] = listPrice;
  data["availability_status"] = availabilityStatus;
  data["images"] = images;
  data["product_category"] = productCategory;
  data["average_rating"] = avgRate;
  data["small_description"] = smallDesc;
  data["total_reviews"] = totReviews;
  data["total_answered_questions"] = totalQueAnsd;
  data["model"] = "";
  data["customization_options"] = customizationOptions;

  data["seller_id"] = null;
  data["seller_name"] = null;
  data["fulfilled_by_amazon"] = null;
  data["fast_track_message"] = "";
  data["aplus_present"] = false;

  await page.waitForTimeout(300);
  await browser.close();
  return data;
};

exports.searchProducts = async (searchKey) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.amazon.com/s?k=${searchKey}`);

  // need to optimise code here
  const searchResults = await page.$$eval(".s-result-item.s-asin", (ele) =>
    ele.map((e) => ({
      type: Array.from(e.classList).includes("AdHolder")
        ? "sponsored_product"
        : "search_product",
      availability_quantity: null,
      has_prime: e.querySelector(".s-prime .a-icon-prime") ? true : false,
      image: e.querySelector("img").src ? e.querySelector("img").src : "",
      is_amazon_choice: e.querySelector(`[aria-label*="Choice"`) ? true : false,
      is_limited_deal: e.querySelector("[id*='BEST_DEAL_'") ? true : false,
      is_best_seller: null, // TODO
      name: e.querySelector("h2>a>span")
        ? e.querySelector("h2>a>span").innerHTML
        : "",
      price: e.querySelector(".a-price>span")
        ? e.querySelector(".a-price>span").innerText.replace(/[$]/g, "")
        : "",
      price_string: e.querySelector(".a-price>span")
        ? e.querySelector(".a-price>span").innerText
        : "",
      price_symbol: e.querySelector(".a-price-symbol")
        ? e.querySelector(".a-price-symbol").innerText
        : "",
      spec: {},
      stars: e.querySelector(".a-row.a-size-small .a-declarative")
        ? e
            .querySelector(".a-row.a-size-small .a-declarative")
            .innerText.split(" ")[0]
        : "",
      total_reviews: e.querySelector(".a-row.a-size-small .a-size-base")
        ? e.querySelector(".a-row.a-size-small .a-size-base").innerText
        : "",
      url: e.querySelector("h2>a") ? e.querySelector("h2>a").href : "",
    }))
  );
  const pagesEle = await page.$$eval(".s-result-item .a-pagination li", (e) =>
    e.map((l) => l.innerText).filter((l) => !isNaN(l))
  );
  const pageLink = await page.$eval(
    ".s-result-item .a-pagination li.a-selected",
    (e) => e.querySelector("a").href
  );

  const pages = [];
  for (let i = 1; i <= pagesEle[pagesEle.length - 1]; i++) {
    pages.push(`${pageLink}&page=${i}`);
  }
  browser.close();
  return {
    results: searchResults.filter((e) => e.type === "search_product"),
    ads: searchResults.filter((e) => e.type === "sponsored_product"),
    pages,
  };
};
