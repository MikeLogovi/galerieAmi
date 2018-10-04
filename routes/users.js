var router = require('express').Router();
var User = require('./../models/User');
router.get('/',(req,res)=>{
    res.render('users/index.html');
});
router.get('/inscription',(req,res)=>{
     res.render('users/edit.html',{endpoint:'/inscription'});
});
router.post('/inscription',(req,res)=>{
    req.check('userName',"Le nom d'utilisateur doit avoir au moins 3 caractères").notEmpty().isLength({min:3});
    req.check('userName',"Le nom d'utilisateur existe déjà").userAlreadyExists(req.body.userName);
    req.check('password',"Veuillez bien confirmer votre mot de passe").isEqual(req.body.confpass);
    if(req.file.filename){
        filename=typeof req.files['file']!=undefined?req.files['file'][0].filename:'';
        req.check('file','Format de fichier jpg,jpeg,png ou gif uniquement sont autorisées').isImage(filename);
    }
    var errors=req.validationErrors();
    if(errors){
        res.render('users/edit.html',{body:req.body,errors:errors,endpoint:'/inscription'});
    }
    else{
        User.userName=req.body.userName;
        User.password=req.body.password;
        if(req.file.filename){
            User.picture='/uploads/'+req.file.filename;
        }
        else{
            User.picture='/uploads/anonyme.jpg';
        }
        User.save();
        req.session.myUser.userName=req.body.userName;
        res.redirect('/'+req.body.userName);
    }
   
});
router.get('/connexion',(req,res)=>{
    res.render('users/login.html',{endpoint:'/connexion'});
});
router.post('/connexion',(req,res)=>{
     if(User.findOne({"name":req.body.userName,"password":req.body.password})){
        req.session.myUser.userName=req.body.userName;
        res.redirect('/'+req.body.userName);
     }
     else{
        var errors=["Couple Utilisateur/Mot de passe invalide"];
        res.render('users/login.html',{body:req.body,errors:errors,endpoint:'/connexion'});
     }
    
});
router.get('/deconnexion',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});




module.exports=router;