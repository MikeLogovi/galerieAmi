var router = require('express').Router();
var Ami = require('./../models/Ami');
var User = require('./../models/User');
var Type = require('./../models/Type');

router.get('/:userName',(req,res) =>{
    
    User.findOne({'userName':req.params.userName}).populate('amis').then(user =>{
        res.render('amis/index.html',{user:user});
    });
});
router.get('/edit/:userName',(req,res)=>{
    User.findOne({'userName':req.params.userName}).then(user=>{
        res.render('users/edit.html',{user:user,endpoint:'/edit/'+req.params.userName});
    });
    
});
router.post('edit/:userName',(req,res)=>{
    User.findOne({'userName':req.params.userName}).then(user=>{
        User.userName=user.userName;
        User.password=user.password;
        User.picture=user.picture;
        User.amis=user.amis;
    });
        if(req.body.userName){
            req.check('userName',"Le nom d'utilisateur doit avoir au moins 3 caractères").isEmpty().isLength({min:3});
        }
        if(req.body.password){
            req.check('password',"Veuillez bien confirmer votre mot de passe").isEqual(req.body.confpass);
        }
        if(req.file){
            filename=typeof req.files['file']!=undefined?req.files['file'][0].filename:'';
            req.check('file',"Le fichier doit avoir pour extension jpg,jpeg ,png ou gif").isImage(filename);
        }
        var errors = req.validationErrors();
        if(errors){
            res.render('users/edit.html',{body:req.body,errors:errors,endpoint:'/edit/'+req.params.userName});
        }
        else{
            if(req.body.userName){
                User.userName=req.body.userName;
            }
            if(req.body.password){
                User.password=req.body.password;
            }
            if(req.file){
                User.picture='/uploads/'+req.file.filename;
            }
            User.save();
            res.redirect('/'+req.session.myUser.userName);
        }
});

router.get('/edit/:userName/:id',(req,res)=>{
    Ami.findById(mongoose.Types.ObjectId(req.params.id)).populate('types').then(ami=>{
        Type.find({}).then(typees=>{
            res.render('amis/edit.html',{ami:ami,typees:typees});
        });
        
    });
});
router.post('/edit/:userName/:id',(req,res)=>{
    Ami.findOne({"_id":mongoose.Types.ObjectId(req.params.id)}).then(ami=>{
        Ami.firstName=ami.firstName;
        Ami.lastName=ami.lastName;
        Ami.picture=ami.picture;
        Ami.description=ami.description;
        Ami.types=ami.types;
        if(req.body.firstName){
           req.check('firstName',"Le prénom doit avoir au moins 2 caractères").notEmpty().isLength({min:2});
        }
        if(req.body.lastName){
          req.check('lastName',"Le nom doit avoir au moins 2 caractères").notEmpty().isLength({min:2});

        }
        if(req.file){
        filename=typeof req.files['file']!=undefined?req.files['file'][0].filename:'';
        req.check('file','Le fichier doit avoir pour extension jpeg,jpg,png ou gif').isImage(filename);
        }
        var errors=req.validationErrors();
        if(errors){
            res.render('amis/edit.html',{body:req.body,errors:errors,endpoint:'/edit/'+req.session.myUser.userName+'/'+req.params.id});
        }
        else{
            if(req.body.firstName){
               Ami.firstName=req.body.firstName;
            }
            if(req.body.lastName){
               Ami.lastName=req.body.lastName;
            }
            if(req.body.description){
               Ami.description=req.body.description;
            }
            if(req.file){
               Ami.picture='/uploads/'+req.file.filename;
            }
            if(req.body.typesAmi){
                for(type in req.body.typesAmi){
                    if(ami.types.indexOf(type)!=-1){
                        ami.types.concat(type);
                    }
                }
               Ami.types =ami.types;
            }
            Ami.save();
            res.redirect('/'+req.session.myUser.userName);
       }
    });
});
router.get('/delete/:userName/:id',(req,res)=>{
     Ami.findOneAndRemove({"_id":mongoose.Types.ObjectId(req.params.id)}).then(()=>{
        res.redirect('/'+req.session.myUser.userName);
     });
});
router.get('/:userName/newFriend',(req,res)=>{
    res.render('amis/edit.html',{title:"Ajout d'ami",endpoint:'/',body:req.session.post,errors:req.session.errors});
   
});
router.post('/:userName/newFriend',(req,res)=>{
     User.findOne({'username':req.params.userName}).then(user=>{
         User.userName=user.userName;
         User.password=user.password;
         User.picture = user.picture;
         User.amis=user.amis;

         req.check('lastName',"Le champ nom a besoin d'au moins 2 caractères").notEmpty().isLength({min:2});
         req.check('firstName',"Le champ prénom a besoin d'au moins 2 caractères").notEmpty().isLength({min:2});
         req.check('description',"Le champ description ne doit pas etre vide").notEmpty();
         filename=typeof req.files['file']!=undefined?req.files['file'][0].filename:'';
         req.check('file',"La photo doit etre obligatoirement uploader et doit etre au format png,jpg,jpeg ou gif").isImage(filename);
         var errors=req.validationErrors();
         if(errors){
            res.render('amis/edit.html',{body:req.body,errors:errors,endpoint:'/'+req.session.myUser.username+'/newFriend'});
         }
         else{
            Ami.firstName=req.body.firstName;
            Ami.lastName=req.body.lastName;
            Ami.description=req.body.description;
            Ami.picture='/uploads'+filename;
            Ami.save();
            User.amis.concact(mongoose.Types.ObjectId(Ami._id));
            User.save();
            res.redirect('/'+req.session.myUser.username);
        }
     });
    
        
        
       
 });
router.get('/:userName/:id',(req,res)=>{
        Ami.findById(mongoose.Types.ObjectId(req.params.id)).then(ami=>{
            res.render('amis/show.html',{ami:ami,myUserUserName:req.session.myUser.userName});
        });
});


module.exports=router;