/*
 * regist amida
 */
var Manager = require('../lib/amida').Manager;
var check = require('validator').check;
var Validator = require('validator').Validator;

exports.index = function(req, res){
  var title = '';
  var lotteryNumber = '';
  var userPass = '';
  var message = '';
  var error = [];
  
  res.render('regist', { locals: { title:title, lotteryNumber:lotteryNumber,
        userPass:userPass, message:message, error:error } });
        
};

/*
 * registCheck amida
 */
exports.check = function(req, res){
    
  var title = req.body.title;
  var lotteryNumber = req.body.lotteryNumber;
  var userPass = req.body.userPass;
  var message = req.body.message;
  var plots = [];
  var urlParam = '';
  
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
  validator.check(lotteryNumber, {"lotteryNumber" : "半角数字で入力してください。"}).isInt(); 
  if (userPass) validator.check(userPass, {"userPass" : "パスワードが不正です。"}).len(1,10);
  if (message) validator.check(message, {"message" : "メッセージが不正です。"}).len(1,300);
  
  // varidator error catch
  var vali_errors = validator.getErrors();
  if (vali_errors[0]) {
    // 入力フォームにてエラー表示を行う。
    console.log(vali_errors[0]);
    //console.log(vali_errors[1].lotteryNumber);
    res.render('regist', { locals: { title:title, lotteryNumber:lotteryNumber,
    userPass:userPass, message:message, error:vali_errors[0] } });
  }
  
  // 横線の作成。
  Manager.makePlotsData(lotteryNumber, function(err, plotsRes) {
    plots = plotsRes;
      
    // URLの作成。
    Manager.makeRandomUrlParam(10, function(err, urlParamRes){
      //console.log(urlParamRes);
      urlParam = urlParamRes;
      
      // TODO urlParam 
      console.log(urlParam);
          
      // データの整形
      var data = [];
          data.title   = title;
          data.message = message;
          data.users   = '';        // ここではまだ入力値ナシ
          data.items   = '';        //items;
          data.userPass = userPass;
          data.url       = urlParam;
          data.plots     = plots;
          
      console.log(data);
          
      // mongoDBへ登録を行う。
      Manager.regist(data, function(err, amida)  {
        // @todo something
        console.log(err);
      });
    });
  });
  
  // 作成されたamidaを表示する。
  res.redirect('/hoge/'); //+ url);

};