var mongoose = require('mongoose');

var amiSchema = new mongoose.Schema({
    lastName :String,
    firstName:String,
    description:String,
    picture:String,
    types:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Type"
        }
     ]
    
});


var Ami = mongoose.model('Ami',amiSchema);
module.exports=Ami;