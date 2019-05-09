// Figure out what set of credentials to return (production or development environment)
// node environment variable will be automatically set by Heroku
if (process.env.NODE_ENV === 'production') {
    // return prod keys
    module.exports = require('./prod');
} else {
    // return dev keys
    module.exports = require('./dev');
}