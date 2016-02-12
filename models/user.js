
var mongodb = require('./db.js');

//Create object
function User(user){
	this.username= user.username;
	this.password = user.password;
	this.email = user.email;
};

//expose to the outside
module.exports = User;

//save profile
User.prototype.save = function(callback){
	//make JSON
	var user = {
		username: this.username,
		password: this.password,
		email: this.email
	};

	//open database connection
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//return error msg
		}

		//read user collection
		db.collection('users', function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(user,{
				safe:true
			}, function(err,user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user[0]); //success then set err to null 
			});
		});
	});
};


//get user infor
User.prototype.get = function(name,callback){

	//open database connection
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//return error msg
		}

		//read user collection
		db.collection('users', function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				username:name
			}, function(err,user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user); //success then set err to null 
			});
		});
	});
};

