var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var bcrypt = require('bcryptjs');
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
        default:dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss")
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

userSchema.pre('save',async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
    }catch(error){
        next(error);
    }
});

var User = mongoose.model('User',userSchema);

module.exports=User;