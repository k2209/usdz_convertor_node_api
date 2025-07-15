require('dotenv').config()

const ENV = process.env.NODE_ENV
console.log(ENV)

const development = {
    PORT: process.env.PORT || 3003,
    PROTOCOL: process.env.PROTOCOL || 'http',
    DOMAIN: process.env.DOMAIN || 'localhost:3003',
}

const production = {
    PORT: process.env.PORT || 3003,
    PROTOCOL: process.env.PROTOCOL || 'http',
    DOMAIN: process.env.DOMAIN || 'localhost:3003',
}

module.exports = ENV === 'production' ? production : development