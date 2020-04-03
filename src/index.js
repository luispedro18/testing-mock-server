const mockServerClient = require('mockserver-client').mockServerClient
const path = require('path')
const { getFileExtension } = require('./utils')
const expectationsFromHARFile = require('./expectationsFromHARFile')
const expectationsFromJSONFile = require('./expectationsFromJSONFile')
const { getExpectationsList } = require('./getExpectationsList')

let mappedExpectations = []

const expectationListFile = process.argv[2] || 'sample_expectations.yml'

const expectationsList = getExpectationsList(path.resolve(__dirname, '..', 'data', `${expectationListFile}`))

expectationsList.map(({ fileName, regex = '*', requestPath = '/', method = 'GET', statusCode = 200 }) => {
    const filePath = path.resolve(__dirname, '..', 'mocks', fileName)
    const fileExtension = getFileExtension(filePath)
    let expectations = []

    switch (fileExtension) {
        case 'har':
            expectations = expectationsFromHARFile(filePath, regex)
            break;
        case 'json':
            expectations = expectationsFromJSONFile(filePath, requestPath, method, statusCode)
            break;
    }

    mappedExpectations = mappedExpectations.concat(expectations)
})

const addExpectations = expectations => expectations.map(expectation => {
    mockServerClient("localhost", 1080).mockAnyResponse({
        "httpRequest": expectation.mockRequest,
        "httpResponse": expectation.mockResponse
    }).then(
        function () {
            console.log(`expectation - ${expectation.requestPath} - ${JSON.stringify(expectation.mockRequest.queryStringParameters) || ''} - created`)
        },
        function (error) {
            console.log(error)
        }
    );
});

addExpectations(mappedExpectations)