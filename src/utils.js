const getFileExtension = filename => filename.split('.').pop();

const getProperties = properties => properties.map(({ name, value }) => ({ name: name.replace(':', ''), values: [value] }));
const getPath = headers => headers.filter(({ name }) => name === ':path').map(({ value }) => value)[0].split('?')[0];

const filterWhitelistedProperties = (oldObject, blacklist) => {
    return Object.keys(oldObject).reduce((newObject, key) => {
        if (blacklist.includes(key)) {
            newObject[key] = oldObject[key];
        }

        return newObject;
    }, {})
};

module.exports = { getFileExtension, getPath, getProperties, filterWhitelistedProperties };