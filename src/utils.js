const getFileExtension = filename => filename.split('.').pop();

const getProperties = properties => properties.map(({ name, value }) => ({ name: name.replace(':', ''), values: [value] }));
const getPath = url => url.split('?')[0]
const getQueryString = url => {
    const urlObject = new URL(url, "https://example.com");
    const queryStringObject = new URLSearchParams(urlObject.search);

    let result = []

    for(let pair of queryStringObject.entries()){
        result.push({name: pair[0], values: [pair[1]]})
    }

    return result;
}

const filterWhitelistedProperties = (oldObject, whitelist) => {
    return Object.keys(oldObject).reduce((newObject, key) => {
        if (whitelist.includes(key)) {
            newObject[key] = oldObject[key];
        }

        return newObject;
    }, {})
};

module.exports = { getFileExtension, getPath, getProperties, filterWhitelistedProperties, getQueryString };