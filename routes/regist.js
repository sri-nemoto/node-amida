/*
 * regist amida
 */
var Manager = require('../lib/amida').Manager;
var check = require('validator').check;
var Validator = require('validator').Validator;

exports.index = function(req, res){
  var title = '';
  var lottery_number = '';
  var userPass = '';
  var message = '';
  var error = [];
  
  res.render('regist', { locals: { title:title, lottery_number:lottery_number,
        userPass:userPass, message:message, error:error } });
        
};


/*
 * registCheck amida
 */
exports.check = function(req, res){
    
  var title = req.body.title;
  var lottery_number = req.body.lottery_number;
  var userPass = req.body.userPass;
  var message = req.body.message;
  var plots = [];
  var urlParam = 'torenai';
  
  // add my method
  Validator.prototype.error = function (msg) {
    this._errors.push(msg);
  }
  
  Validator.prototype.getErrors = function () {
    return this._errors;
  }
    
  var validator = new Validator();
  
  // バリデートチェックを行う。
  validator.check(title, {"title" : "タイトルが不正です。"}).len(2,20);
  validator.check(lottery_number, {"lottery_number" : "半角数字で入力してください。"}).isInt(); 
  if (userPass) validator.check(userPass, {"userPass" : "パスワードが不正です。"}).len(1,10);
  if (message) validator.check(message, {"message" : "メッセージが不正です。"}).len(1,300);
  
  // varidator error catch
  var vali_errors = validator.getErrors();
  if (vali_errors[0]) {
      // 入力フォームにてエラー表示を行う。
      console.log(vali_errors[0]);
      //console.log(vali_errors[1].lottery_number);
      res.render('regist', { locals: { title:title, lottery_number:lottery_number,
        userPass:userPass, message:message, error:vali_errors[0] } });
  }
  
  // 横線の作成。
  Manager.makePlotsData(lottery_number, function(err, plotsRes) {
    // @todo something
    plots = plotsRes;
  });
  console.log(plots);
  
  // URLの作成。
  Manager.makeRandomUrlParam(10, function(err, urlParamRes){
    console.log(urlParamRes);
    urlParam = urlParamRes;
  });
  
  // TODO urlParam取れないなんで？
  console.log(urlParam);
  
  // データの整形
  var data = [];
  data.title   = title;
  data.message = message;
  data.users   = '';        // ここではまだ入力値ナシ
  data.items   = '';        //items;
  data.userPass = userPass;
  //data.url       = url;
  data.plots     = plots;
  
  //console.log(data);
  
  // mongoDBへ登録を行う。
  //Manager.regist(data, function(err, amida)  {
    // @todo something
    //console.log(err);
  //});
  
  // 作成されたamidaを表示する。
  res.redirect('/hoge/'); //+ url);

};