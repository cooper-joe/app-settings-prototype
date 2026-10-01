const path = require('path')

// @dhis2/cli-app-scripts' package.json "exports" only lists "." and "./init",
// so requiring the "./config/jest.config.js" subpath directly is blocked by
// Node's exports enforcement. Resolve the package's real entry file instead,
// then reach the config directory with a plain filesystem path, which exports
// enforcement doesn't apply to.
const cliAppScriptsEntry = require.resolve('@dhis2/cli-app-scripts')
const defaultJestConfig = require(
    path.join(path.dirname(cliAppScriptsEntry), '..', 'config', 'jest.config.js')
)

// d2-app-scripts test shallow-merges { ...defaultJestConfig, ...appJestConfig,
// ...pkgJestConfig }, so this file's moduleNameMapper fully replaces the
// default's (CSS, file and styled-jsx mocks) unless we spread it back in here.
module.exports = {
    moduleNameMapper: {
        ...defaultJestConfig.moduleNameMapper,
        // Jest's resolver doesn't read package.json "exports", so it can't
        // find this subpath on its own.
        '^@dhis2/app-runtime/experimental$': require.resolve(
            '@dhis2/app-runtime/experimental'
        ),
    },
}
