var mongoose = require('mongoose');

var typeSchema = new mongoose.Schema({
    name:String,
    description:String,
    picture:String,
    color:{
        type:String,
        default:'blue'
    }
});

typeSchema.virtual('amis',{
    ref:'Ami',
    localField:'_id',
    foreignField:'types'
});

var Type = mongoose.model('Type',typeSchema);

module.exports=Type;