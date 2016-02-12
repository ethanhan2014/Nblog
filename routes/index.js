var express = require('express');
var router = express.Router();

var User = require('../models/user.js'),
	crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Home',
  	user: req.session.user,
  	success: req.flash('success').toString(),
  	error: req.flash('error').toString()
  	 });
});

router.get('/reg', function(req, res, next) {
  res.render('reg', { 
  	title: 'Register' 
   //  user: req.session.user,
  	// success: req.flash('success').toString(),
  	// error: req.flash('error').toString()
  });
});

router.post('/reg', function(req, res, next) {
	var name = req.body.username,
		password = req.body.password,
		re_enter = req.body['password-repeat'];

		//check if passwords are consistent
		if(re_enter != password){
			req.flash('error','Please re-enter your password!');
			return res.redirect('/reg');
		}

		//generate MD5 value
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		var newUser = new User({
			username: name,
			password: password,
			email: req.body.email
		});

		//check if user exists
		newUser.get(newUser.username, function(err, user){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}

			if(user){
				req.flash('error','User has exists!');
				return res.redirect('/reg');	
			}

			//if not exists
			newUser.save(function(err,user){
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success','Register successfully!');
				res.redirect('/');
			});
		});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});

router.post('/login', function(req, res, next) {

});

router.get('/post', function(req, res, next) {
  res.render('index', { title: 'New Tweet' });
});

router.post('/post', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/logout', function(req, res, next) {
	req.session.user = null;
	res.redirect('/');
});

module.exports = router;
