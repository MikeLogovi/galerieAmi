var router = require('express').Router();
var Ami = require('./../models/Ami');
var User = require('./../models/User');
var Type = require('./../models/Type');
var mongoose = require('mongoose');
var moment = require('moment');
moment.locale('fr');
var dateFormat = require('dateformat');

var redirectUnAuthorized=(req,res,next)=>{
    if(req.session.myUser.userName!=req.params.userName){
        res.redirect('/'+req.session.myUser.userName);
        
    }
    else{
        return next();
    }
}; 
  

router.get('/:userName',redirectUnAuthorized,(req,res) =>{
    
    User.findOne({'userName':req.params.userName}).populate('amis').then(user =>{
        new Promise((resolve,reject)=>{
            var myAmis=[] ;
            
            user.amis.forEach(ami=>{  
                 ami.created_at=moment(ami.created_at,"YYYY-MM-DD HH:mm:ss").fromNow();
                 if(ami.updated_at!=""){
                    ami.updated_at=moment(ami.updated_at,"YYYY-MM-DD HH:mm:ss").fromNow();
                 }                 
                 myAmis.push(ami);
           });
               
             user.amis=myAmis;
             resolve(user);
        }).then(user=>{
            res.render('amis/index.html',{user:user});
        });
    });
});
router.get('/edit/:userName',(req,res)=>{
    User.findOne({'userName':req.params.userName}).then(user=>{
        res.render('users/edit.html',{user:user,endpoint:'/edit/'+req.params.userName});
    });
    
});
router.post('/edit/:userName',redirectUnAuthorized,(req,res)=>{
    User.findOne({'userName':req.params.userName}).then(user=>{
        if(req.body.userName){
            req.check('userName',"Le nom d'utilisateur doit avoir au moins 3 caractères").isLength({min:3});
        }
        if(req.body.password){
            req.check('password',"Veuillez bien confirmer votre mot de passe").equals(req.body.confpass);
        }
        if(req.file){
            req.check('file',"Le fichier doit avoir pour extension jpg,jpeg ,png ou gif").isImage(req.file.originalname);
        }
        var errors = req.validationErrors();
        if(errors){
            res.render('users/edit.html',{body:req.body,errors:errors,endpoint:'/edit/'+req.params.userName});
        }
        else{
            if(req.body.userName){
                user.userName=req.body.userName;
                req.session.myUser.userName=req.body.userName;
            }
            if(req.body.password){
                user.password=req.body.password;
            }
            if(req.file){
                user.picture='/uploads/'+req.file.filename;
            }
            
            user.updated_at=dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss");;
            user.save(user=>{
                res.redirect('/'+req.session.myUser.userName);
            });
        }
    });
       
});

router.get('/edit/:userName/:id',redirectUnAuthorized,(req,res)=>{
    User.findOne({"userName":req.params.userName}).populate('amis').then(user=>{
        var cool=null
        new Promise((resolve,reject)=>{
            user.amis.forEach(ami=>{
                if(ami._id==req.params.id){
                    resolve();
                }
            });
            reject();      
        }).catch(()=>{
            res.render('errors/notForAuth.html',{myUser:req.params.userName});
        }).then(()=>{
            Ami.findOne({"_id":req.params.id},(err,ami)=>{if(err || ami==null){
                res.render('errors/index.html');
             }}).populate('types').then((ami,err)=>{
                if(err || ami==null){
                   res.render('errors/index.html',{myUser:req.params.userName});
                }
                else{
                    Type.find({}).then(typees=>{
                        res.render('amis/edit.html',{ami:ami,typees:typees});
                    });
                }
            });
        });
   });
    
       
    
   
});
router.post('/edit/:userName/:id',redirectUnAuthorized,(req,res)=>{
    User.findOne({"userName":req.params.userName}).populate('amis').then(user=>{
        var cool=null
        new Promise((resolve,reject)=>{
            user.amis.forEach(ami=>{
                if(ami._id==req.params.id){
                    resolve();
                }
            });
            reject();      
        }).catch(()=>{
            res.render('errors/notForAuth.html',{myUser:req.params.userName});
        }).then(()=>{
            Ami.findOne({"_id":req.params.id},(err,ami)=>{
                if(err || ami==null){
                    res.render('errors/index.html');
                }
            }).then((ami,err)=>{
                if(err || ami==null){
                    res.render('errors/index.html',{myUser:req.params.userName});
                }
                else{
                    if(req.body.firstName){
                        req.check('firstName',"Le prénom doit avoir au moins 2 caractères").notEmpty().isLength({min:2});
                     }
                     if(req.body.lastName){
                       req.check('lastName',"Le nom doit avoir au moins 2 caractères").notEmpty().isLength({min:2});
             
                     }
                     if(req.file){
                        req.check('file','Le fichier doit avoir pour extension jpeg,jpg,png ou gif').isImage(req.file.originalname);
                     }
                    var errors=req.validationErrors();
                    if(errors){
                            res.render('amis/edit.html',{body:req.body,errors:errors,endpoint:'/edit/'+req.session.myUser.userName+'/'+req.params.id});
                    }
                    else{
                        if(req.body.firstName){
                           ami.firstName=req.body.firstName;
                        }
                        if(req.body.lastName){
                           ami.lastName=req.body.lastName;
                        }
                        if(req.body.description){
                           ami.description=req.body.description;
                        }
                        if(req.file){
                           ami.picture='/uploads/'+req.file.filename;
                        }
                        ami.types=req.body.typesAmi;
                        ami.updated_at=dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss");
                        ami.save(ami=>{
                            res.redirect('/'+req.session.myUser.userName);
                        });
                   }
                }    
            });
        
        
        });
   });
       
});
router.get('/delete/:userName/:id',redirectUnAuthorized,(req,res)=>{
    User.findOne({"userName":req.params.userName}).populate('amis').then(user=>{
        var cool=null
        new Promise((resolve,reject)=>{
            user.amis.forEach(ami=>{
                if(ami._id==req.params.id){
                    resolve();
                }
            });
            reject();      
        }).catch(()=>{
            res.render('errors/notForAuth.html',{myUser:req.params.userName});
        }).then(()=>{
            Ami.findOneAndRemove({"_id":req.params.id},(err,ami)=>{
                if(err || ami==null){
                    res.render('errors/index.html',{myUser:req.params.userName});
                }
             }).then((ami,err)=>{
                 
                    res.redirect('/'+req.session.myUser.userName);
        
                 
             });        });
   });
       
    
    
});
router.get('/:userName/newFriend',redirectUnAuthorized,(req,res)=>{
    Type.find({}).then(typees=>{
        res.render('amis/edit.html',{title:"Ajout d'ami",typees:typees,endpoint:'/'+req.session.myUser.userName+'/newFriend'});
    });
   
});
router.post('/:userName/newFriend',redirectUnAuthorized,(req,res)=>{
     User.findOne({'userName':req.params.userName}).then(user=>{
         req.check('lastName',"Le champ nom a besoin d'au moins 2 caractères").notEmpty().isLength({min:2});
         req.check('firstName',"Le champ prénom a besoin d'au moins 2 caractères").notEmpty().isLength({min:2});
         req.check('description',"Le champ description ne doit pas etre vide").notEmpty();
         if(req.file){
            req.check('file',"La photo doit etre obligatoirement uploader et doit etre au format png,jpg,jpeg ou gif").isImage(req.file.originalname.toString());
         }
         else{
            req.check('file',"La photo doit etre obligatoirement uploader et doit etre au format png,jpg,jpeg ou gif").notEmpty();
         }
         var errors=req.validationErrors();
         if(errors){
            res.render('amis/edit.html',{body:req.body,errors:errors,endpoint:'/'+req.session.myUser.username+'/newFriend'});
         }
         else{
            var ami=new Ami();
            
            ami.types=req.body.typesAmi;
            ami.firstName=req.body.firstName;
            ami.lastName=req.body.lastName;
            ami.description=req.body.description;
            ami.picture='/uploads/'+req.file.filename;
            
            ami.created_at=dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss");
            ami.save().then(amie=>{
                
                if(user.amis.push(mongoose.Types.ObjectId(amie._id))){
                    user.save().then(theUser=>{
                        res.redirect('/'+req.session.myUser.userName);
                    });
                }
           });
                
                
            
           
            
        }
     });
    
        
        
       
 });



 router.get('/:userName/:id',redirectUnAuthorized,(req,res)=>{
   
        Ami.findOne({"_id":req.params.id},(err,ami)=>{ if(err || ami==null){
            res.render('errors/index.html');
        }}).populate('types').then((ami,err)=>{
            if(err || ami==null){
                res.render('errors/index.html',{myUser:req.params.userName});
            }
            else{
                
                User.findOne({"userName":req.params.userName}).populate('amis').then(user=>{
                    var cool=null
                    new Promise((resolve,reject)=>{
                        user.amis.forEach(ami=>{
                            if(ami._id==req.params.id){
                                resolve();
                            }
                        });
                        reject();      
                    }).catch(()=>{
                        res.render('errors/notForAuth.html',{myUser:req.params.userName});
                    }).then(()=>{
                        res.render('amis/show.html',{ami:ami,myUserUserName:req.session.myUser.userName});
                    });
               });
            
            }
        });
});


module.exports=router;