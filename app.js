/**
 * Module dependencies.
 */

var express = require('express')
  , routes_index = require('./routes/index')
  , routes_regist = require('./routes/regist')
  , routes_join = require('./routes/join')
  , routes_auth = require('./routes/auth')
  ,  Manager = require('./lib/amida').Manager;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'node-amida' }));
  app.use(app.router);
});

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}
NotFound.prototype.__proto__ = Error.prototype;

// Error

app.error(function (err, req, res, next) {
  res.render('error', { e_message: err })
});

// Routes

app.get('/', routes_index.index);
app.get('/regist', routes_regist.index);
app.get('/join/:url',routes_join.index);
app.get('/auth/:url', routes_auth.index);
app.post('/authCheck', routes_auth.check);
app.post('/registCheck', routes_regist.check);
app.post('/regist', routes_regist.index);

// 404
app.get('/*', function(req, res){
  throw new NotFound();
});


// uncaughtException -> stop it's!
process.on('uncaughtException', function(err) {  console.log('uncaughtException happened: ' + err);
  process.exit(0);
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// socket io用
routes_join.socket(app);
