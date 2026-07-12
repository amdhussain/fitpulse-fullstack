const config = require("./config");
const connectDB = require("./config/db");
const app = require("./app");

const PORT = config.port;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  });
});
