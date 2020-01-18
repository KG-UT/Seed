/* virtual credit card model */

const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    item : String,
    value : Number
})

const virtualCardSchema = new mongoose.Schema({
    transactions : [transactionSchema]
})

const virtualCard = mongoose.model('virtualCard', virtualCardSchema)
module.exports = { virtualCard }