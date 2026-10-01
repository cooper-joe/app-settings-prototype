const defaultJestConfig = require('@dhis2/cli-app-scripts/config/jest.config.js')

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
