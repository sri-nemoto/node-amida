/*
 * view amida auth
 */
var Manager = require('../lib/amida').Manager;

// 認証ページ生成
exports.index = function (req, res) {
  // redner
  res.render('auth', {
     password:'',
     password_error:'',
     auth_url: req.params.url
    });
};

// 認証確認
exports.check = function (req, res) {
  var password = req.body.password;
  var url = req.body.auth_url;
//  var errorRender = function(pass) {
//    res.render('auth', {
//        password: pass,
//        password_error:'パスワードが存在しません' ,
//        auth_url: req.body.auth_url
//      });
//  };

  //TODO: validate
  if (!password) {
//    errorRender('');
  }

  Manager.auth(url, 'password', function(err, amida) {
      console.log("Mongo error->", err);
      if (!amida[0].userPass) {
//        errorRender(pass);
        console.log("error !");
      } else {
        req.session.auth = url;
        res.redirect('/join/' + url);
      }
    }
  );
};