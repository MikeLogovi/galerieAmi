var express= require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser=require('cookie-parser');
var expressValidator=require('express-validator');
var expressSession=require('express-session');
var User = require('./models/User');
var uploads = multer({
    dest:__dirname+'/uploads'
});
mongoose.connect('mongodb://127.0.0.1:27017/amitie',{useNewUrlParser:true});
var app = express();

app.use('/bootstrap/css',express.static(__dirname+'/node_modules/bootstrap/dist/css'));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use('/bootstrap/js',express.static(__dirname+'/node_modules/bootstrap/dist/js'));
app.use('/jquery/js',express.static(__dirname+'/node_modules/jquery/dist'));
app.use('/images',express.static(__dirname+'/public/images'));
app.use(bodyParser.urlencoded({extended:false}));

app.use(expressValidator({
    customValidators:{
        isImage: function(filename){
              var extension=(path.extname(filename)).toLowerCase();
              switch(extension){
                  case '.jpg': return '.jpg';
                  case '.jpeg': return '.jpeg';
                  case '.png': return '.png';
                  case '.gif': return '.gif';
                  default:return false;
                }
        },
        userAlreadyExists:function(userName){
            var req = User.find({"name":userName});
            if(req){
                return true;
            }
            return false;
        }
    }
}));
app.use(cookieParser());
app.use(uploads.single('file'));
app.use(expressSession({secret:'max',saveUnitialized:false,resave:false}));
nunjucks.configure('views',{
    autoescape:true,
    express:app
});

app.use('/',require('./routes/users'));
app.use('/',require('./routes/amis'));
app.use('/',require('./routes/types'));

app.use(function(req,res,next){
    if(req.session.myUser){
        if(req.params.userName!=req.session.myUser.userName){
            res.redirect('/'+req.session.myUser);
        }
    }
    else{
       res.redirect('/');
    }
});

app.listen(3002);