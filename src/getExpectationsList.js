const yaml = require('js-yaml');
const fs = require('fs');

const getExpectationsList = (filePath) => {
    try {
        const doc = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
        
        return doc.expectations
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getExpectationsList }