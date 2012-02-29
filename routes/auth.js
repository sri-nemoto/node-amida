/*
 * view amida auth
 */
var Manager = require('../lib/amida').Manager;

// 認証ページ生成
exports.index = function (req, res) {
  // redner
  res.render('auth', {password:'',
    password_error:''});

};

// 認証確認
exports.check = function (req, res) {
  var errorRender = function(pass) {
    res.render(
      'auth', {password: pass
                , password_error:'パスワードが存在しません'}
    );
  };

  //TODO: validate
  if (!req.body.password) {
    errorRender('');
  }
  var pass = req.body.password
  var url = "Wr9u9DhGKZRteGoFyskYYw9Ev57wbkiq5PtM52nLDdioXANM9VQhdphziEFWcfzq";

  Manager.auth(url, pass, function(err, amida) {
      console.log(amida);
      if (!amida.userPass) {
        errorRender(pass);
      } else {
        res.redirect('join');
      }
    }
  );
};