var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/t');
var fs = require('fs');
var MongoStore = require('connect-mongo')(express);
var routes = require('./routes');
var jade = require('jade');
var bcrypt = require('bcrypt');
var app = express();

var db = mongoose.connection;

module.exports = mongoose.connections[0];

app.set("views", __dirname + "/views");
app.set('view engine' , 'jade');
app.use(express.bodyParser());

app.use(express.cookieParser('amber'));
app.use(express.session({
    store: new MongoStore({
	secret:'amber',
//	mongoose_connection:db,
	db: mongoose.connection.db
    })
}));

app.use(app.router);
app.use(express.static('./static'));


var newUserSchema = mongoose.Schema(
    {user:String , pass:String, session:Object, stuff:Array}
);
var newUserModel =  mongoose.model('users' , newUserSchema);

app.get('/', routes.index(db , newUserModel) );


app.post('/logout',routes.logout(db));

app.get('/logout' , routes.index(db,newUserModel));
app.get('/adduser', function(req,res){res.redirect('/')});

app.post('/adduser' ,routes.adduser(db, newUserModel, bcrypt));
app.post('/login' , routes.login(db,newUserModel , bcrypt));
app.post('/addstuff' , routes.addstuff(db, newUserModel));


/*
var dogSchema = mongoose.Schema({name:String , age:Number});
var Dog = mongoose.model('HAT' , dogSchema);
var amber = new Dog({name:'amber', age:8});
amber.save(function(err){
    if(err)console.log(err);
});
*/

var options = {
    key:fs.readFileSync('./test-key.pem'),
    cert:fs.readFileSync('./cert.pem')
}


app.listen(3000);
https.createServer(options, app).listen(443);
console.log('listening on 3000');
