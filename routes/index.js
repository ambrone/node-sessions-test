exports.index = function(db, mongoose, newUserModel){
    return function(req,res){
	
	console.log('req.session.user:' );
	console.log(req.session.user);
	if(req.session.user != undefined){
	    newUserModel.findOne({user:req.session.user},function(err,thing){
		if(err)console.log(err);
		res.render('loggedin', {'user':req.session.user, stuff:thing.stuff});
	    });
	}
	else{
	    console.log(req.session.cookie);
	    res.render('index', {message:'hat'});
	}
    }
}



exports.adduser = function(db, mongoose, newUserSchema, newUserModel){

    return function(req,res){
	if(req.body.user){	    
	    var user = req.body.user;
	    var pass = req.body.pass;
	    console.log(req.body.remember);
	    if(req.body.remember == 'on'){
		req.session.user = user;
	    }
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
	    res.render('loggedin', {'user':user, 'stuff':['no stuff']});
	    
	}
	else{
	    res.redirect('/');
	}
    }
}

exports.login = function(db,mongoose, newUserModel){
    return function(req,res){
	var user = req.body.user;
	var pass = req.body.pass;
	console.log(user+pass);
	if(req.body.remember == 'on'){
	    req.session.user = user;
	}
	newUserModel.findOne({user:req.body.user}, function(err, thing){
	    if(err)console.log(err);
//	    console.log(thing == null);
	    if(thing == null){
		console.log('thing == null');
		//res.redirect('/');
		res.render('index' , {message:'no user exists named '+req.body.user});
	    }else{
		console.log('thing: '+ thing+typeof thing);
		console.log(thing.user);
		console.log(pass);
		
		if(thing.pass == pass){
		    res.render('loggedin',{user:user, stuff: thing.stuff} );
		    //res.redirect('/');
		}else{
		    res.render('index', {message:'password incorrect'});
		}
	    }
	})
    }
}

exports.addstuff = function(db, mongoose, newUserModel){
    return function(req,res){
	console.log(req.body.stuff);
	var arr;
	var t = newUserModel.findOne({user:req.body.user},function(err,thing){
	    if(err)console.log(err);
	    arr = thing.stuff
	    arr.push(req.body.stuff);
	    thing.stuff = arr;
	    thing.save(function(){});
	    res.render('loggedin' , {user:req.body.user , stuff:arr});
	});
	
    }
}

exports.logout = function(db){
    return function(req,res){
	console.log('req.body.user: '+req.body.user);
	console.log('req.session.user:' + req.session.user);
	res.clearCookie('connect.sid');
	res.render('index',{message:'you have logged out'});
    }
}
