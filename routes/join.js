
/*
 * add member
 */
var Manager = require('../lib/amida').Manager;

// アミダ表示(参加者入力画面)
exports.index = function(req, res) {

  console.log("join/index");
  res.render('index', { title: 'Express' });
}

// 参加者追加
exports.join = function(req, res) {

  // @todo validation

  // @todo delete test code
  var url       = req.params.url;  
  var position = req.params.position;
  var name     = req.params.name;
  
  Manager.join(url, name, position, function(err, amida) {
    if (!err) {
      console.log("success");
    }
    console.log(err);
    
    // redner
    res.redirect('/join');
  });
}
