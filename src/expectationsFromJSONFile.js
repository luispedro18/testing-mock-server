const fs = require("fs");
const { getQueryString } = require('./utils')

module.exports = expectationsFromJSONFile = (filePath, requestPath, method, statusCode) => {
    let expectations = [];

    const fileContents = fs.readFileSync(filePath);

    const jsonContents = JSON.parse(fileContents);

    const requestQueryString = getQueryString(requestPath)

    const mockRequest = {
        method,
        path: requestPath.split('?')[0],
        queryStringParameters: requestQueryString,
    }

    const mockResponse = {
        statusCode: statusCode,
        body: jsonContents
    }

    expectations.push({
        mockRequest,
        mockResponse,
        requestPath
    })

    return expectations;
};