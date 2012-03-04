
/*
 * add member
 */
var Manager = require('../lib/amida').Manager;

// アミダ表示(参加者入力画面)
exports.index = function(req, res) {
  var url = req.params.url;
  console.log("url:"+req.params.url);
  if (url) {
    Manager.find(url, function(err, amidas) {
      if(!err && amidas.length == 1) {
        for (var j = 0; j < amidas[0].items.length; j++ ) {
          console.log(amidas[0].items[j].name + "'s position is " + amidas[0].items[j].position);
        }
        res.render('join', {amida: amidas[0]});
      } else {
        console.log(err);
        res.redirect("/");
      }
    });
  } else {
    console.log("error");
    res.redirect("/");
  }
}

// 参加者追加
exports.join = function(req, res) {

  // @todo validation

  // @todo delete test code
  var url      = req.params.url;  
  var position = req.params.position;
  var name     = req.params.name;
  
  Manager.join(url, name, position, function(err, amida) {
    if (!err) {
      console.log("success");
    }
    console.log(err);
    
    // redner
    res.redirect('/join/' + url);
  });
}

// socket通信
exports.socket = function (app) {
  var socketIo = require('socket.io');
  var io = socketIo.listen(app);
  io.sockets.on('connection', function(client){
    // ブラウザでアクセスした時に表示される
    client.send('接続しました');
    console.log('connection');
    
    //クライアント側からurl受信ハンドラ
    client.on('url', function(url) {
      console.log('url');
      if (url) {
        makeLineData(url, function(data) {
          client.emit('amidaData', data);
        });
      }
    });
    
    //クライアント切断時のハンドラ
    client.on('disconnect', function(){
      client.send('切断しました');
    });
  
  });
}

var makeLineData = function(url, callback) {
  if (url) {
    Manager.find(url, function(err, amidas) {
      if(!err && amidas.length == 1) {
        var amida = amidas[0];
        // 縦棒
        var items = amida.items;
        var varticals = [];
        for (var i = 0 ; i < items.length ; i++) {
          var x = i * 5;
          varticals[varticals.length] = { start : { x : x, y : 0 }, end : { x : x, y : 20 }, end_name : items[i].name };
        }
        // 横棒
        var horizontals = amida.plots;
        console.log("makeLineData");
        var data = { vertical : varticals, horizontal : horizontals };
        callback(data);
      } else {
        console.log(err);
        return false;
      }
    });
  }
}
