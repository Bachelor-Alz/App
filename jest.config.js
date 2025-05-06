module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  testPathIgnorePatterns:
    process.env.NODE_ENV === "integration"
      ? ["/node_modules/"]
      : ["/node_modules/", "/__tests__/integration/"],
};
