const express = require("express");
const morgan = require("morgan");
const ezScraper = require("./modules/ez-scrape/routes");
const customScraper = require("./modules/gp-scrape/routes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("combined"));

app.use(express.json());

app.use("/api/ez", ezScraper);
app.use("/api/custom", customScraper);

app.listen(PORT, () => {
  console.log(`App is listening on PORT: ${PORT}`);
});
