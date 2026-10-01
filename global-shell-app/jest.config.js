module.exports = {
    setupFilesAfterEnv: [`${__dirname}/src/setup-tests.js`],
    testPathIgnorePatterns: ['/node_modules/', '/build/', '/.d2/'],
}
