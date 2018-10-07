var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var now=new Date();
var amiSchema = new mongoose.Schema({
    lastName :String,
    firstName:String,
    description:String,
    picture:String,
    created_at:{
        type:String,
        default:dateFormat(now,"yyyy-mm-dd HH:MM:ss")
    },
    updated_at:{
        type:String,
        default:""
    },
    types:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Type"
        }
     ]
    
});


var Ami = mongoose.model('Ami',amiSchema);
module.exports=Ami;