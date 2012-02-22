
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
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes_index.index);
app.get('/regist', routes_regist.index);
app.get('/join', function(req, res) {
    res.render('join');
});
app.get('/auth', function(req, res) {
    res.render('auth', {'password_error': ''});
});
app.post('/authCheck', function(req, res){
    console.log(req.body.password);
    check = true;
    //TODO: validate
    //Manager.auth();
    if (check === false) {
        res.render('auth', {'password_error': 'パスワードが存在しません'});
    }
    console.log('auth ok!');
    res.redirect('join');
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
