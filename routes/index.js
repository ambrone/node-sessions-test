exports.index = function(db, newUserModel){
    return function(req,res){
	if(req.session.user != undefined){
	    newUserModel.findOne({user:req.session.user},function(err,thing){
		if(err)console.log(err);
		res.render('loggedin', {'user':req.session.user, stuff:thing.stuff});
	    });
	}
	else{
	    res.render('index', {message:'hat'});
	}
    }
}

exports.adduser = function(db, newUserModel, bcrypt){
    return function(req,res){
	if(req.body.user){	    
	    var user = req.body.user;
	    newUserModel.findOne({user:req.body.user},function(err,thing){
		console.log(thing == null);
		if(thing != null){
		    console.log(thing);
		    res.render('index' ,{message:'username taken'});
		    return;
		}else{ 
		    var newUser = new newUserModel({'user':req.body.user , 'pass':''});
		    var hash = bcrypt.genSalt(10, function(err, salt) {
			console.log('salt: '+salt)
			return bcrypt.hash(req.body.pass, salt, function(err, hash) {
			    console.log('hash: '+hash);
			    newUser.pass = hash;
			    newUser.update({pass:hash},function(){});
			});
		    });
		    
		    if(req.body.remember == 'on'){
			req.session.user = user;
		    }
		    
		    newUser.save(function(err){
			if(err)console.log(err);
		    })
		    res.render('loggedin', {'user':user, 'stuff':['no stuff yet']});
		}
	    });
	}else{
	    res.redirect('/');
	}
    }
}


exports.login = function(db, newUserModel, bcrypt){
    return function(req,res){
	if(req.body.remember == 'on'){
	    req.session.user = req.body.user;
	}
	newUserModel.findOne({user:req.body.user}, function(err, thing){
	    if(err)console.log(err);
	    if(thing == null){
		res.render('index' , {message:'no user exists named '+req.body.user});
	    }else{
		bcrypt.compare(req.body.pass, thing.pass, function(err, response) {
		    if(err){
			console.log(err);
			res.render('index' , {message:'An error occurred. Please try again.'});
		    }
		    else if(response == true){
			res.render('loggedin' , {user:req.body.user,stuff:thing.stuff});
		    }else{
			res.render('index', {message:'password incorrect'});
		    }
		})
	    }
	})
    }
}



exports.addstuff = function(db, newUserModel){
    return function(req,res){
	var t = newUserModel.findOne({user:req.body.user},function(err,thing){
	    if(err)console.log(err);
	    var arr = thing.stuff
	    arr.push(req.body.stuff);
	    thing.stuff = arr;
	    thing.save(function(err){if(err)console.log(err)});
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
