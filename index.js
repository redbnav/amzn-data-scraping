const express = require("express");
const ezScraper = require("./modules/ez-scrape/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/ez", ezScraper);

app.listen(PORT, () => {
  console.log(`App is listening on PORT: ${PORT}`);
});
