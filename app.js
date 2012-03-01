
/**
 * Module dependencies.
 */

var express = require('express')
  , routes_index = require('./routes/index')
  , routes_regist = require('./routes/regist')
  , routes_join = require('./routes/join'),
    Manager = require('./lib/amida').Manager;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
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
app.get('/join', function(req, res) {
    res.render('join');
});

// 認証ページ生成
app.get('/auth', function(req, res) {
    res.render('auth', {password: '',
                                password_error: ''});
});

// 認証確認
app.post('/authCheck', function(req, res){
    var check = true;
    //TODO: validate
    //Manager.auth();
    if (check === true) {
        res.render('auth', {password : req.body.password,
                                    password_error: 'パスワードが存在しません'});
    } else {
        res.redirect('join');
    }
});

// 404
app.get('/*', function(req, res){
  throw new NotFound();
});

// uncaughtException -> stop it's!
process.on('uncaughtException', function(err) {
  console.log('uncaughtException happened: ' + err);
  process.exit(0);
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
