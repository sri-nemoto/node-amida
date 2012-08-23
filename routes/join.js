/*
 * add member
 */
var Manager = require('../lib/amida').Manager
 , AmidaError = require('../lib/amidaError').AmidaError
 , config = require('configure');

// アミダ表示(参加者入力画面)
exports.index = function(req, res) {
  var url = req.params.url;
  
  if (url) {
    Manager.find(url, function(err, amidas) {
      if(!err && amidas.length == 1) {
        if (amidas[0].userPass) {
          // 認証チェック
          if (req.session.auth != url) {
            // 認証NGの場合
            res.redirect('/auth/' + url);
          } else {
            // 認証OKの場合
            res.render('join', {amida: amidas[0]});
          }
        } else {
          // 認証不要
          res.render('join', {amida: amidas[0]});
        }
      } else {
        // 該当レコードなし
        AmidaError.redirect(err, res);
      }
    });
  } else {
    // 引数なし
    AmidaError.redirect({ url : url, message : config.error.join.url }, res);
  }
}

// socket通信
exports.socket = function (app) {
  var socketIo = require('socket.io');
  var io = socketIo.listen(app);
  io.sockets.on('connection', function(client){
    // ブラウザでアクセス
    console.log('socket client is connected');
    
    //クライアント側からurl受信ハンドラ
    client.on('url', function(url) {
      if (url) {
        Manager.getLineData(url, function(err, data) {
          if (!err) {
            // socket channelに追加
            client.join(url);
            client.emit('amidaData', data);
          } else {
            console.log(err);
          }
        });
      }
    });
    
    //クライアント側からuser受信ハンドラ
    client.on('user', function(data) {
      
      if (data) {
        
        // 参加user追加
        var url      = data.url;  
        var position = data.position;
        var name     = data.name;
        
        Manager.join(url, name, position, function(err, amida) {
          if (!err) {
            console.log('join success');
            var users = amida.users;
            client.emit('users', { users: amida.users });
            // 同じchannelに属しているsocket clientに対してのみbroadcast
            client.broadcast.to(url).emit('users', { users: users });
          } else {
            console.log(err);
            client.send(err.message);
          }
        });
      }
    });
    
    //クライアント切断時のハンドラ
    client.on('disconnect', function(){
      console.log('socket client is disconnected');
    });
  
  });
}
