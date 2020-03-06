const fs = require("fs"); 
const { getPath, getProperties, filterWhitelistedProperties } = require('./utils')   

module.exports = expectationsFromHARFile = (filePath, regex) => {
    let expectations = [];

    const fileContents = fs.readFileSync(filePath);  

    const jsonContents = JSON.parse(fileContents); 
    const filteredExpectations = jsonContents.log.entries.filter(entry => entry.request.url.toLowerCase().match(regex));
    const rawExpectations = filteredExpectations.map(entry => ({ request: entry.request, response: entry.response }));  

    rawExpectations.map(expectation => {
        const whitelistRequestProperties = ["method", "queryString", "headers"];
        const newRequest = filterWhitelistedProperties(expectation.request, whitelistRequestProperties);

        const requestPath = getPath(newRequest.headers);
        const requestQueryString = getProperties(newRequest.queryString)
        const mockRequest = {
            method: newRequest.method,
            path: requestPath,
            queryStringParameters: requestQueryString,
        }

        const whitelistResponseProperties = ["method", "queryString", "headers", "content"];
        const newResponse = filterWhitelistedProperties(expectation.response, whitelistResponseProperties);

        const mockResponse = {
            statusCode: newResponse.status,
            body: newResponse.content.text
        }

        expectations.push({
            mockRequest,
            mockResponse
        })
    })

    return expectations;  
};