
/*
 * regist amida
 */
var Manager = require('../lib/amida').Manager;

exports.index = function(req, res){
  var title = '';
  var lottery_number = '';
  var amida_pass = '';
  var message = '';
  
  
  res.render('regist', { locals: { title:title, lottery_number:lottery_number,
        amida_pass:amida_pass, message:message} });
        

};