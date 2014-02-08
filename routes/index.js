exports.index = function(db){
    return function(req,res){
	
	console.log('req.session.user:' );
	console.log(req.session.user);
	if(req.session.user != undefined){
	    res.render('loggedin', {'user':req.session.user});
	}
	else{
	    console.log(req.session.cookie);
	    res.render('index', {message:'hat'});
	}
    }
}



exports.adduser = function(db, mongoose, newUserSchema, newUserModel){

    return function(req,res){

	var user = req.body.user;
	var pass = req.body.pass;
	req.session.user = user;
	req.session.pass = pass;
	var newUser = new newUserModel({
	    'user':req.body.user , 
	    'pass':req.body.pass
//	    'session':req.session
	});
	newUser.save(function(err){
	    if(err)console.log(err);
	    
	    //res.render('loggedin',  {user:req.body.user}, function(err){
		//console.log(err);
	    //});

	})
	console.log(newUser.user);
	res.render('loggedin', {'user':user});
	
    }
}

exports.login = function(db,mongoose, newUserModel){
    return function(req,res){
	var user = req.body.user;
	var pass = req.body.pass;
	console.log(user+pass);
//	console.log(newUserModel.find({},function(){}));
	newUserModel.findOne({user:req.body.user}, function(err, thing){
	    if(err)console.log(err);
	    if (thing == null){
		res.redirect('/');
		res.render('index' , {message:'try again'});
	    }else{
		console.log('thing: '+ thing+typeof thing);
		console.log(thing.user);
		console.log(pass);
		
		if(thing.pass == pass){
		    res.render('loggedin',{'user':user});
		    //res.redirect('/');
		}else{
		    res.render('index', {message:'try again'});
		}
	    }
	})
    }
}
