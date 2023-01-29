// processor.js
const formData = require('form-data');
const fs = require('fs');

function setupMultipartFormData(requestParams, context, ee, next) {
    const form = new formData();
    form.append('file', fs.createReadStream(__dirname + '/yoga.jpg'));
    // form.append('file', fs.createReadStream('../datas/yoga.jpg'));
    requestParams.body = form;
    return next();
}

module.exports = {
    setupMultipartFormData,
};
