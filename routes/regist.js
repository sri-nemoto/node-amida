
/*
 * regist amida
 */
var Manager = require('../lib/amida').Manager;

exports.index = function(req, res){

  // @todo validation

  // @todo delete dummy data
  var amida = {
    title: 'タイトル4'
    , message: 'メッセージ4'
    , items: [
      {name: 'アイテム4-1', position: 1}
      , {name: 'アイテム4-2', position: 2}
      , {name: 'アイテム4-3', position: 3}
      , {name: 'アイテム4-4', position: 4}]
    , admin_pass: 'ladmin_pass4'
    , user_pass: 'luser_pass4'
    , registed: Date.now()
    , plots: [
       {x: 1, y: 1}
       , {x: 1, y: 2}
       , {x: 1, y: 3}
       , {x: 1, y: 4}
       , {x: 1, y: 5}
       , {x: 1, y: 6}]
    , url: (function(i, s) {
      var random = '';
        for (; i > 0; i--) {
           // select char list
          var slice = Math.floor(Math.random() * s.length);
           // add random char
          random += s.charAt(slice);
         }
      return random;
    })(64, 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789')
  };

  Manager.regist(amida, function(err) {
    // @todo something
  });

  // redner
  res.render('index', { title: 'Express' })
};