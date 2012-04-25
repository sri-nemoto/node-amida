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
  var items = [];
  
  // add my method
  Validator.prototype.error = function (msg) {
    this._errors.push(msg);
  }
  
  Validator.prototype.getErrors = function () {
    return this._errors;
  }
  
  var validator = new Validator();
  
  // バリデートチェックを行う。
  validator.check(title, {"title" : "「タイトル」が不正です。"}).len(1,20);
  validator.check(lotteryNumber, {"lotteryNumber" : "「くじの本数」を半角数字で入力してください。"}).isInt();
  validator.check(lotteryNumber, {"lotteryNumber" : "「くじの本数」を3～9本で入力してください。"}).min(3);
  validator.check(lotteryNumber, {"lotteryNumber" : "「くじの本数」を3～9本で入力してください。"}).max(9);
  if (userPass) validator.check(userPass, {"userPass" : "「パスワード」が不正です。"}).len(1,10);
  if (message) validator.check(message, {"message" : "「メッセージ」が不正です。"}).len(1,300);
  
  for (var i = 1; i <= lotteryNumber; i++){
    var item_name = eval("req.body.item_" + i);
    var map = new Object();
    map["item_" + i] =    "[item_" + i + "」が不正です。";
    if (item_name) {
      validator.check(item_name, {"items" : map["item_" + i]}).len(1,30);
    } else {
      item_name = 'なし';
    }
    
    var position = i - 1;
    items.push({"name" : item_name, "position" : position });
  }
  
  // varidator error catch
  var vali_errors = validator.getErrors();
  if (vali_errors[0]) {
    // 入力フォームにてエラー表示を行う。
    console.log(vali_errors[0]);
    //console.log(vali_errors[1].lotteryNumber);
    res.render('regist', { locals: { title:title, lotteryNumber:lotteryNumber,
    items:items, userPass:userPass, message:message, error:vali_errors[0] } });
    
  } else {
    // 横線の作成。
    Manager.makePlotsData(lotteryNumber, function(err, plotsRes) {
      plots = plotsRes;
        
      // URLの作成。
      Manager.makeRandomUrlParam(10, function(err, urlParamRes){
        urlParam = urlParamRes;
        
        // データの整形
        var data = [];
            data.title   = title;
            data.message = message;
            data.users   = '';        // ここではまだ入力値ナシ
            data.items   = items;        //items;
            data.userPass = userPass;
            data.url       = urlParam;
            data.plots     = plots;
          
        // mongoDBへ登録を行う。
        Manager.regist(data, function(err, amida)  {
          console.log(err);
        });
        // 作成されたamidaを表示する。
        res.redirect('/join/' + urlParam);
      });
    });
  }
};