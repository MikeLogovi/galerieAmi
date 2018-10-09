var router = require('express').Router();
var User = require('./../models/User');
var moment = require('moment');
moment.locale('fr');
var dateFormat = require('dateformat');
var bcrypt = require("bcryptjs");
var mongoose = require('mongoose');
var redirectToBoard=(req,res,next)=>{
     if(req.session.myUser){
         res.redirect('/'+req.session.myUser.userName);
     }
     else{
         next();
         
     }
};
router.get('/',redirectToBoard,(req,res)=>{
    
    res.render('users/index.html');
});
router.get('/inscription',redirectToBoard,(req,res)=>{
     res.render('users/edit.html',{endpoint:'/inscription'});
});
router.post('/inscription',redirectToBoard,(req,res)=>{
    req.session.myUser={};
    User.findOne({"userName":req.body.userName}).then((user,err)=>{
        var errors;
        if(err){
            errors=[{msg:"Erreur avec la base de données.Veuillez reéssayez ultérieurement"}];
            res.render('users/edit.html',{body:req.body,errors:errors,endpoint:'/inscription'});
        }
        else if(user){
            errors=[{msg:"Utilisateur existant!"}];
            res.render('users/edit.html',{body:req.body,errors:errors,endpoint:'/inscription'});
        }
        else{
            req.check('userName',"Le nom d'utilisateur doit avoir au moins 3 caractères").isLength({min:3});
            req.check('userName',"Le nom d'utilisateur existe déjà").userAlreadyExists(req.body.userName);
            req.check('password',"Veuillez bien confirmer votre mot de passe").equals(req.body.confpass);
            if(req.file){
                req.check('file','Format de fichier jpg,jpeg,png ou gif uniquement sont autorisées').isImage(req.file.originalname);
            }
            var errors=req.validationErrors();
            if(errors){
                res.render('users/edit.html',{body:req.body,errors:errors,endpoint:'/inscription'});
            }
            else{
                var user = new User();
                user.password=req.body.password;
                user.userName=req.body.userName;
                
                if(req.file){
                    user.picture='/uploads/'+req.file.originalname;
                }
                else{
                   user.picture='/uploads/anonyme.jpg';
                }
                user.role='user';
                user.created_at=dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss");
                user.save().then(theuser=>{
                        req.session.myUser.userName=req.body.userName;
                        res.redirect('/'+req.body.userName);
                });
                
               
                
            }
        }
    });
  
   
});
router.get('/connexion',redirectToBoard,(req,res)=>{
    res.render('users/login.html',{endpoint:'/connexion'});
});
router.post('/connexion',redirectToBoard,(req,res)=>{
    req.session.myUser={};
    User.findOne({"userName":req.body.userName}).then((user,err)=>{
        if(err || user==null){
            var errors=[{ msg: "Couple Utilisateur/Mot de passe invalidee"}];
            res.render('users/login.html',{body:req.body,errors:errors,endpoint:'/connexion'});
        }
        else{
            new Promise((resolve,reject)=>{
                if(!bcrypt.compare(req.params.password,user.password)){
                    var errors=[{msg:"Couple Utilisateur/Mot de passe invalide"}];
                }
                resolve(user);
            }).then(user=>{
                if(errors){
                    res.render('users/login.html',{body:req.body,errors:errors,endpoint:'/connexion'});
                }
                else{
                    req.session.myUser.userName=req.body.userName;
                    res.redirect('/'+req.body.userName);
                 }
            });
               
          
        } 
    });
    
});
router.get('/deconnexion',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});




module.exports=router;