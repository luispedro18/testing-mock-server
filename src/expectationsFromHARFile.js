const fs = require("fs"); 
const { getPath, getProperties, filterWhitelistedProperties } = require('./utils')   

module.exports = expectationsFromHARFile = (filePath, regex, expectationName) => {
    let expectations = [];

    const fileContents = fs.readFileSync(filePath);  

    const jsonContents = JSON.parse(fileContents); 
    const filteredExpectations = jsonContents.log.entries.filter(entry => entry.request.url.toLowerCase().match(regex));
    const rawExpectations = filteredExpectations.map(entry => ({ request: entry.request, response: entry.response }));

    rawExpectations.map(expectation => {
        const whitelistRequestProperties = ["method", "queryString", "headers", "url"];
        const newRequest = filterWhitelistedProperties(expectation.request, whitelistRequestProperties);

        const hostHeader = newRequest.headers.filter(header => header.name === 'Host')
        const pathHeader = getProperties(newRequest.headers).filter(header => header.name === 'path')

        const host = `https://${hostHeader.length && hostHeader[0].value}`;
        const path = pathHeader.length && pathHeader[0].values[0];

        const requestPath = (path && getPath(path)) || getPath(newRequest.url).replace(host, '');

        if(requestPath){
            const requestQueryString = getProperties(newRequest.queryString)

            const mockRequest = {
                method: newRequest.method,
                path: requestPath,
                queryStringParameters: requestQueryString,
            }
    
            const whitelistResponseProperties = ["method", "queryString", "headers", "content", "status"];
            const newResponse = filterWhitelistedProperties(expectation.response, whitelistResponseProperties);
            
            const mockResponse = {
                statusCode: newResponse.status,
                body: newResponse.content.text
            }
            
            expectations.push({
                mockRequest,
                mockResponse,
                requestPath
            })
        }

    })

    return expectations;  
};