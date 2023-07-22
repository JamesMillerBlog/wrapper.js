module.exports = {
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testPathIgnorePatterns : [
    "./build/"
  ]
}
