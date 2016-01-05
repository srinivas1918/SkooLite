var express = require('express');
var session=require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var users = require('./routes/admin');
var api=require('./routes/api');
var feeInfo=require("./routes/feeInfo");
var notifications=require("./routes/notifications");
var dbInstance=require("./db.js").dbOparations.db;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '1234!@#$',
    store: new MongoStore({db:dbInstance})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'uploads')))
app.use("/lib", express.static(path.join(__dirname,'node_modules')));
app.use('/', routes);
app.use('/admin', users);
app.use('/api',api);
app.use("/fees",feeInfo);
app.use("/notifications",notifications);
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

app.listen(3000,function(){
  console.log("server started at :"+3000);
})
module.exports = app;
