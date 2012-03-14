/*
 * regist amida
 */
var Manager = require('../lib/amida').Manager;
var check = require('validator').check;
var Validator = require('validator').Validator;

exports.index = function(req, res){
  var title = '';
  var lottery_number = '';
  var amida_pass = '';
  var message = '';
  var error = [];
  
  res.render('regist', { locals: { title:title, lottery_number:lottery_number,
        amida_pass:amida_pass, message:message, error:error } });
        
};


/*
 * registComp amida
 */
exports.comp = function(req, res){
    
  var title = req.body.title;
  var lottery_number = req.body.lottery_number;
  var amida_pass = req.body.amida_pass;
  var message = req.body.message;
  
  var lottery_number_error = '';
  
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
  if (amida_pass) validator.check(amida_pass, {"amida_pass" : "パスワードが不正です。"}).len(1,10);
  if (message) validator.check(message, {"message" : "メッセージが不正です。"}).len(1,300);
  
  // varidator error catch
  var vali_errors = validator.getErrors();
  if (vali_errors[0]) {
      // 入力フォームにてエラー表示を行う。
      
      console.log(vali_errors[0].title);
      //console.log(vali_errors[1].lottery_number);
      res.render('regist', { locals: { title:title, lottery_number:lottery_number,
        amida_pass:amida_pass, message:message, error:vali_errors[0] } });
  }
  
  // URLの作成
  
  // 室岡methodにて、横線の作成
  
  // mongoDBへ登録を行う。
  
  // 作成されたamidaを表示する。
  res.render('hoge', { locals: {title:title} });

};