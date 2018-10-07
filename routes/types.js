var router = require('express').Router();
var Type = require('./../models/Type');
var User = require('./../models/User');
var Ami = require('./../models/Ami');
var mongoose=require('mongoose');
var redirectThem=(req,res,next)=>{
    if(req.session.myUser.userName!=req.params.myUserUserName){
         res.redirect('/'+req.session.myUser.userName);
         return next();
    }
    else{
        return next();
    }
};
router.get('/:myUserUserName/types',redirectThem,(req,res)=>{
    User.findOne({"userName":req.params.myUserUserName}).then(user=>{
        if(user.role=='admin'){
            Type.find({}).then(types=>{
               res.render('types/index.html',{types:types,myUserUserName:req.session.myUser.userName});
            });
     
         }
         else{
           res.redirect('/'+req.session.myUser.userName);
         }
    });
});
router.get('/:myUserUserName/types/newType',redirectThem,(req,res)=>{
    User.findOne({"userName":req.params.myUserUserName}).then(user=>{
        if(user.role!='admin'){
            res.redirect('/'+req.session.myUser.userName);
        }
        else{
            res.render('types/edit.html',{endpoint:'/'+req.params.myUserUserName+'/types/newType'});
        }
    });
});
router.post('/:myUserUserName/types/newType',redirectThem,(req,res)=>{
    User.findOne({"userName":req.params.myUserUserName}).then(user=>{
        if(user.role!='admin'){
            res.redirect('/'+req.session.myUser.userName+'/types');
        }
        else{
                req.check('name',"Le nom du type doit avoir au moins 4 caractères").isLength({min:4});
                if(req.file){
                   req.check('file',"Les extensions autorisées sont jpeg,jpg,png et gif").isImage(req.file.originalname);                  
                }
                else{
                   req.check('file',"Vous devez uploader une image pour le type").notEmpty();                  
                }
                req.check('description',"Le type a besoin d'une description").notEmpty();
                req.check('color',"Le type a besoin d'une couleur").notEmpty();
                var errors=req.validationErrors();
                if(errors){
                    res.render('types/edit.html',{body:req.body,errors:errors,endpoint:'/'+req.params.myUserUserName+'/types/newType'});
                }
                else{
                    var type = new Type();
                    type.name=req.body.name;
                    type.description=req.body.description;
                    type.color=req.body.color;
                    type.picture='/uploads/'+req.file.filename;
                    type.save().then(type=>{
                        res.redirect('/'+req.session.myUser.userName+'/types');
                    });
                }
        }
    });
});
router.get('/:myUserUserName/types/:name',redirectThem,(req,res)=>{
    User.findOne({"userName":req.params.myUserUserName}).then(user=>{
        if(req.params.myUserUserName=='admin'){
            Type.find({'name':req.params.name},(err,type)=>{
                if(err||type==null){
                    res.render('errors/index.html') ;
                  }
            }).populate('amis').then((type,err)=>{
              if(err||type==null){
                res.render('errors/index.html') ;
              }
              else{
                
                  var myAmis=[];
                  Ami.find({}).populate('types').then(amis=>{
                     new Promise((resolve,reject)=>{
                        amis.forEach(ami=>{
                            var typeAmi=ami.types;
                            typeAmi.forEach(type=>{
                                  if(type.name==req.params.name){
                                      myAmis.push(ami);
                                  }
                            });
                         });   
                         resolve(myAmis); 
                     }).then((myAmis)=>{
                        Type.findOne({"name":req.params.name}).then(ourType=>{
                        res.render('types/show.html',{amis:myAmis,type:ourType}) ;

                       });

                     });
                    
                  });
                 
              }
             });
          }
          else{

            Type.findOne({"name":req.params.name},(err,type)=>{
                if(err||type==null){
                    res.render('errors/index.html') ;
                  }
            }).then((type,err)=>{
                if(err||type==null){
                    res.render('errors/index.html') ;
                }
                else{
                    User.findOne({"userName":req.params.myUserUserName}).populate("amis").then(user=>{
                        var myAmis=[];
                    
                        new Promise((resolve,reject)=>{
                             user.amis.forEach(ami=>{
                                
                                var tabAmi=ami.types;
                                
                                 tabAmi.forEach(tyPe=>{
                                   
                                    if(tyPe.toString()==type._id.toString()){
                                        myAmis.push(ami);
                                    }
                                 });
                                    
                                
                             });
                            
                            resolve(myAmis);
                        }).then(myAmis=>{
                            
                            res.render('types/show.html',{user:user,myAmis:myAmis,type:type}) ;
        
                        });
                        
        
                   });
                }
                
           });
       }
       
    });
    
 
});
router.get('/:myUserUserName/types/:name/edit',redirectThem,(req,res)=>{
    User.findOne({"userName":req.params.myUserUserName}).then(user=>{
        if(user.role!='admin'){
            res.redirect('/'+req.session.myUser.userName);
        }
        else{
            Type.find({'name':req.params.name},(err,type)=>{
                if(err||type==null){
                    res.render('errors/index.html') ;
                  }
            }).then((type,err)=>{
                if(err||type==null){
                    res.render('errors/index.html');
                }
                else{
                res.render('types/edit.html',{type:type,endpoint:'/'+req.params.myUserUserName+'/types/'+req.params.name+'/edit'});
                  
                }
             });
        }
    });
    
    
});
router.post('/:myUserUserName/types/:name/edit',redirectThem,(req,res)=>{
    User.findOne({"userName":req.params.myUserUserName}).then(user=>{
        Type.findOne({'name':req.params.name},(err,type)=>{
            if(err||type==null){
                res.render('errors/index.html') ;
              }
        }).then((type,err)=>{
            if(err || type==null){
                res.render('errors/index.html');
            } 
            else{
                if(req.body.name){
                    req.check('name',"Le nom du type doit avoir au moins 4 caractères").notEmpty().isLength({min:4});
                 }
                 if(req.file){
                    req.check('file',"Les extensions autorisées sont jpeg,jpg,png et gif").isImage(req.file.originalname);
                 }
                 var errors=req.validationErrors();
                 if(errors){
                    res.render('types/edit.html',{body:req.body,errors:errors,endpoint:'/'+req.session.myUser.userName+'/types/'+req.params.name+'/edit'});
                 }
                 else{
                    
                        if(req.body.name){
                            type.name=req.body.name;
                        }
                        if(req.body.description){
                            type.description=req.body.description;
                        }
                        if(req.body.color){
                            type.color=req.body.color;
                        }
                        if(req.file){
                            type.picture='/uploads/'+req.file.filename;
                        }
                        type.save(types=>{
                            res.redirect('/'+req.session.myUser.userName+'/types');
                        });
                            
                 }
            }
        });
    });
    
});

router.get('/:myUserUserName/types/:name/delete',redirectThem,(req,res)=>{
    Type.findOneAndRemove({'name':req.params.name},(err,type)=>{
        if(err||type==null){
            res.render('errors/index.html') ;
          }
    }).then((type,err)=>{
        if(err||type==null){
            res.render('errors/index.html') ;
          }
          else{
            res.redirect('/'+req.session.myUser.userName+'/types');

          }
    });
});


module.exports=router;