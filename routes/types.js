var router = require('express').Router();
var Type = require('./../models/Type');
router.get('/:userName/types',(req,res)=>{
    if(req.params.userName=='admin'){
       Type.find({}).then(types=>{
          res.render('types/index.html',{types:types,myUserUserName:req.session.myUser.userName});
       });

    }
    else{
      res.redirect('/'+req.session.myUser.userName);
    }
   
});
router.get('/:myUserUserName/types/:name',(req,res)=>{
   if(req.params.myUserUserName=='admin'){
    Type.find({'name':req.params.name}).populate('amis').then(type=>{
        res.render('types/show.html',{type:type,typeName:req.params.name}) ;
    });
   }
   else{
        User.find({'userName':req.params.myUserUserName}).populate('amis').populate('types').then(user=>{
        res.render('types/show.html',{user:user,typeName:req.params.name}) ;
       });
   }
   
});
router.get('/:myUserUserName/types/:name/edit',(req,res)=>{
    if(req.params.myUserUserName!='admin'){
        res.redirect('/'+req.session.myUser.userName);
    }
    else{
        Type.find({'name':req.params.name}).then(type=>{
            res.render('types/edit.html',{type:type,endpoint:'/'+req.params.myUserUserName+'/types/'+req.params.name+'/edit'});
         });
    }
    
});
router.post('/:myUserUserName/types/:name/edit',(req,res)=>{
    Type.find({'name':req.params.name}).then(type=>{
       Type.name=type.name;
       Type.description=type.description;
       Type.color=type.color;
       Type.picture=type.picture;
       if(req.body.name){
          req.check('name',"Le nom du type doit avoir au moins 4 caractères").notEmpty().isLengh({min:4});
       }
     
       if(req.file){
        filename=typeof req.files['file']!=undefined?req.files['file'][0].filename:'';
        req.check('file',"Les extensions autorisées sont jpeg,jpg,png et gif").isImage();
       }
       var errors=req.validationErrors();
       if(errors){
           res.render('types/edit.html',{body:req.body,errors:errors,endpoint:'/'+req.session.myUser.userName+'/types/'+req.params.name+'/edit'});
       }
       else{
            if(req.body.name){
                Type.name=req.body.name;
            }
            if(req.body.description){
                Type.description=req.body.description;
            }
            if(req.body.color){
                Type.color=req.body.color;
            }
            if(req.file){
                Type.picture='/uploads/'+req.file.filename;
            }
            Type.save();
            res.redirect('/'+req.session.myUser.userName);
       }
    });
});

router.get('/:myUserUserName/types/newType',(req,res)=>{
    if(req.params.myUserUserName!='admin'){
        res.redirect('/'+req.session.myUser.userName);
    }
    else{
        res.render('types/edit.html',{endpoint:'/'+req.params.myUserUserName+'/types/newType'});
    }
});
router.post('/:myUserUserName/types/newType',(req,res)=>{
    if(req.params.myUserUserName!='admin'){
        res.redirect('/'+req.session.myUser.userName+'/types');
    }
    else{
            req.check('name',"Le nom du type doit avoir au moins 4 caractères").notEmpty().isLengh({min:4});
            filename=typeof req.files['file']!=undefined?req.files['file'][0].filename:'';
            req.check('file',"Les extensions autorisées sont jpeg,jpg,png et gif").isImage();
            req.check('description',"Le type a besoin d'une description").notEmpty();
            req.check('color',"Le type a besoin d'une couleur").notEmpty();
            var errors=req.validationErrors();
            if(errors){
                res.render('types/edit.html',{body:req.body,errors:errors,endpoint:'/'+req.params.myUserUserName+'/types/newType'});
            }
            else{
                Type.name=req.body.name;
                Type.description=req.body.description;
                Type.color=req.body.color;
                Type.picture='/uploads'+req.file.filename;
                Type.save();
                res.redirect('/'+req.session.myUser.userName+'/types');
            }
    }
});

router.get('/:myUserUserName/types/:name/delete',(req,res)=>{
    Type.findOneAndRemove({'name':req.params.name}).then(()=>{
       res.redirect('/'+req.session.myUser.userName+'/types');
    });
});


module.exports=router;