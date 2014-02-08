var express = require('express');
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/t');
var fs = require('fs');
var MongoStore = require('connect-mongo')(express);
var routes = require('./routes');
var jade = require('jade');
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

app.get('/', routes.index(db , mongoose) );//function(req,res){res.send('hello')});
app.post('/',routes.index(db,mongoose));
var newUserSchema = mongoose.Schema({user:String , pass:String, session:Object});
var newUserModel =  mongoose.model('users' , newUserSchema);

app.post('/adduser' ,routes.adduser(db, mongoose, newUserSchema, newUserModel));
app.post('/login' , routes.login(db,mongoose,newUserModel));
/*
var dogSchema = mongoose.Schema({name:String , age:Number});
var Dog = mongoose.model('HAT' , dogSchema);
var amber = new Dog({name:'amber', age:8});
amber.save(function(err){
    if(err)console.log(err);
});
*/

app.listen(3000);
console.log('listening on 3000');