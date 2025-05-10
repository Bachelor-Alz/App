const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the .env file
if (process.env.NODE_ENV === "integration") {
  dotenv.config({ path: path.resolve(__dirname, ".env") });
}

module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  globals: {
    "process.env": process.env,
  },
  testPathIgnorePatterns:
    process.env.NODE_ENV === "integration"
      ? ["/node_modules/"]
      : ["/node_modules/", "/__tests__/integration/"],
};
