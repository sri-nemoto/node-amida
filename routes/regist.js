
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
  
  
  res.render('regist', { locals: { title:title, lottery_number:lottery_number,
        amida_pass:amida_pass, message:message} });
        

};




/*
 * regist amida
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
  
  // �o���f�[�g�`�F�b�N���s���B
  validator.check(title, {"title" : "�^�C�g�����s���ł��B"}).len(2,20);
  validator.check(lottery_number, {"lottery_number" : "���p�����œ��͂��Ă��������B"}).isInt(); 
  if (amida_pass) validator.check(amida_pass, {"amida_pass" : "�p�X���[�h���s���ł��B"}).len(1,10);
  if (message) validator.check(message, {"message" : "���b�Z�[�W���s���ł��B"}).len(1,300);

  //console.log(validator.getErrors());
  // varidator error catch
  if (validator.getErrors()) {
      var vali_errors = validator.getErrors();
      // ���̓t�H�[���ɂăG���[�\�����s���B
      
      console.log(vali_errors);
      
      res.render('regist', { locals: { title:title, lottery_number:lottery_number,
        amida_pass:amida_pass, message:message, error:vali_errors[0] } });
  }
  
  // �쐬���ꂽamida��\������B
  res.render('hoge', { locals: {title:title} });

};