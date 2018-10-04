var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    userName:String,
    password:String,
    picture:String,
    amis:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Ami'
        }
    ]
});

userSchema.virtual('amis',{
     ref:'Ami',
     localField:'_id',
     foreignField:'users'
});

var User = mongoose.model('User',userSchema);

module.exports=User;