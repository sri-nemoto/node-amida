var AmidaError = function () {};

AmidaError.prototype.redirect = function (err, res) {
  //コンソール出力
  console.log(err);

  //エラーページへリダイレクト
  res.redirect('/error500.html');
};

exports.AmidaError = new AmidaError();
