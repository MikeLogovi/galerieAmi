var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var typeSchema = new mongoose.Schema({
    name:String,
    description:String,
    picture:String,
    color:{
        type:String,
        default:'blue'
    },
    created_at:{
        type:String,
        default:dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss")
    },
    updated_at:{
        type:String,
        default:""
    },
    
});

typeSchema.virtual('amis',{
    ref:'Ami',
    localField:'_id',
    foreignField:'types'
});

var Type = mongoose.model('Type',typeSchema);

module.exports=Type;