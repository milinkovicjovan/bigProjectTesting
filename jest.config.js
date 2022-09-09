module.exports = {
  roots: ["<rootDir>/src/", "<rootDir>/src/__tests__"],
  setupFilesAfterEnv: [require.resolve("./tests/setup-tests.js")],
  moduleFileExtensions: ["js", "json", "vue"],
  testEnvironment: "jest-environment-jsdom",
  transform: {
    ".*\\.(js)$": "babel-jest",
    ".*\\.(vue)$": "vue-jest",
  },
};
