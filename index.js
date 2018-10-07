var express= require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser=require('cookie-parser');
var expressValidator=require('express-validator');
var expressSession=require('express-session');
var User = require('./models/User');
var path=require('path');
var uploads = multer({
    dest:__dirname+'/uploads'
});
mongoose.connect('mongodb://MikeLogovi:MUGIWARA20$@ds125453.mlab.com:25453/heroku_vr7nz236',{useNewUrlParser:true});
var app = express();
app.set('port',(process.env.PORT||5000));
app.use('/bootstrap/css',express.static(__dirname+'/node_modules/bootstrap/dist/css'));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use('/bootstrap/js',express.static(__dirname+'/node_modules/bootstrap/dist/js'));
app.use('/jquery/js',express.static(__dirname+'/node_modules/jquery/dist'));
app.use('/images',express.static(__dirname+'/public/images'));
app.use(bodyParser.urlencoded({extended:false}));

app.use(expressValidator({
    customValidators:{
        isImage: function(value,filename){
              var extension=(path.extname(filename)).toLowerCase();
              console.log(extension);
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

app.use(uploads.single('file'));
app.use(expressSession({secret:'max',saveUnitialized:true,resave:false,cookie:{sercure:false}}));
nunjucks.configure('views',{
    autoescape:true,
    express:app
});

app.use('/',require('./routes/users'));

app.use((req,res,next)=>{
    if(req.session.myUser){
        return next();
    }
    else{
        return res.redirect('/');
    }

});
app.use('/',require('./routes/types'));

app.use('/',require('./routes/amis'));

app.use((req,res,next)=>{
    if(req.method){
        res.render("errors/index.html");
    }
    else{
        next();
    }
});
app.listen(app.get('port'),function(){
    console.log('Node is running on port',app.get('port'));
});