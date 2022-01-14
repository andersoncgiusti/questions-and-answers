const { Sequelize } = require('sequelize')
const connection = new Sequelize('guiperguntas', 'root', '@Python123', { dialect: 'mysql', host: 'localhost' })

module.exports = connection