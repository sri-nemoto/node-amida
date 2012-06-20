/*
 * view amida auth
 */
var Manager = require('../lib/amida').Manager
  , AmidaError = require('../lib/amidaError').AmidaError;

// 認証ページ生成
exports.index = function (req, res) {
  var url = req.params.url;
  res.render('auth', {
    password : '',
    password_error: '',
    auth_url: url
  });
};

// 認証確認
exports.check = function (req, res) {
  var password = req.body.password;
  var url = req.body.auth_url;
  if (url === '' || url === undefined) {
    res.render('auth', {
          password: password,
          password_error: '不正なURLです',
          auth_url: url
        });
  }else {
      Manager.auth(url, password, function (err, amida) {
          if (err) {
            AmidaError.redirect(err, res);
          } else if (amida[0] === undefined) {
            res.render('auth', {
              password: password,
              password_error: 'パスワードが存在しません',
              auth_url: url
            });
          } else {
            req.session.auth = url;
            console.log("auth:" + req.session.auth);
            res.redirect('/join/' + url);
          }
        }
      );
  }
};
