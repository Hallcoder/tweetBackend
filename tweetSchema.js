const { string } = require('joi');
const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    createTime: {
        type:Date,
    },
    text:{
        type:String,    
        minlength:1,
        maxlength:200
    }

})

module.exports.tweetSchema = mongoose.model("tweets",tweetSchema)