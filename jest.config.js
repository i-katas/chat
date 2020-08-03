module.exports = {
    "setupFilesAfterEnv": ["jest-enzyme"],
    "testEnvironment": "enzyme",
    "roots": ['src/main/js', 'src/test/js'],
    "testRegex": '.*\\.test.jsx?$',
    "moduleDirectories": ['node_modules', 'src/main/js'],
    "testTimeout": 1000
}
