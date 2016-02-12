/****---  Modules   ---****/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var settings = require('./settings');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var hbs = require('hbs');

/****---  Init WebApp   ---****/

var app = express();

/****---  Template Engine   ---****/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname,'views/partials/'));

/****---  Config   ---****/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/****---  Database Connection   ---****/

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db, //cookie name
  cookie: {maxAge: 1000*60*60*24*30},  //30 days
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://'+settings.host+'/'+settings.db
  })
}));

app.use(flash());

// 视图交互：实现用户不同登陆状态下显示不同的页面及显示登陆注册等时的成功和错误等提示信息
app.use(function(req, res, next){
    //res.locals.xxx实现xxx变量全局化，在其他页面直接访问变量名即可
    //访问session数据：用户信息
    res.locals.user = req.session.user;
    //获取要显示错误信息
    var error = req.flash('error');//获取flash中存储的error信息
    res.locals.error = error.length ? error : null;
    //获取要显示成功信息
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();//控制权转移，继续执行下一个app。use()
});

/****---  Routing   ---****/

app.use('/', routes);
app.use('/users', users);

/** -- Error Handling Part ---**/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
