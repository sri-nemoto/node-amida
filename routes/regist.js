/*
 * regist amida
 */
var Manager = require('../lib/amida').Manager
 , AmidaError = require('../lib/amidaError').AmidaError
 , check = require('validator').check
 , Validator = require('validator').Validator
 , config = require('configure');

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
  validator.check(title, {"title" : config.error.regist.title}).len(1,20);
  validator.check(lotteryNumber, {"lotteryNumber" : config.error.regist.lotteryNumberType}).isInt();
  validator.check(lotteryNumber, {"lotteryNumber" : config.error.regist.lotteryNumberLength}).min(3);
  validator.check(lotteryNumber, {"lotteryNumber" : config.error.regist.lotteryNumberLength}).max(8);
  if (userPass) validator.check(userPass, {"userPass" : config.error.regist.userPass}).len(1,10);
  if (message) validator.check(message, {"message" : config.error.regist.message}).len(1,300);
  
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
   var errors = [];
    for(var i in vali_errors){
      for (var key in vali_errors[i]) {
        if (key === 'title') {
          errors['title'] = vali_errors[i][key];
        }
        if (key === 'lotteryNumber') {
          errors['lotteryNumber'] = vali_errors[i][key];
        }
        if (key === 'userPass') {
          errors['userPass'] = vali_errors[i][key];
        }
        if (key === 'message') {
          errors['message'] = vali_errors[i][key];
        }
      }
    }
    // 入力フォームにてエラー表示を行う。
    res.render('regist', { locals: { title:title, lotteryNumber:lotteryNumber,
    items:items, userPass:userPass, message:message, error:errors } });
    
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
          if (err) {
            AmidaError.redirect(err, res);
          } else {
            // 作成されたamidaを表示する。
            res.redirect('/join/' + urlParam);
          }
        });
        
      });
    });
  }
};