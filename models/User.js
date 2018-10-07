var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var now=new Date();
var userSchema = new mongoose.Schema({
    userName:String,
    password:String,
    picture:String,
    role:{
        type:String,
        default:'user'
    },
    created_at:{
        type:String,
        default:dateFormat(now,"yyyy-mm-dd HH:MM:ss")
    },
    updated_at:{
        type:String,
        default:""
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