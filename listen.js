const app = require("./app");
const PORT = process.env.PORT || require("./config").PORT;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});
