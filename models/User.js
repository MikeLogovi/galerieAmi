var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName:String,
    password:String,
    picture:String,
    role:{
        type:String,
        default:'user'
    },
    amis:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Ami'
        }
    ]
});



var User = mongoose.model('User',userSchema);

module.exports=User;