
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

// socket
exports.socket = function (app) {
    var socket_io = require('socket.io');
    var io = socket_io.listen(app);
    io.sockets.on('connection', function(client){
        // ブラウザでアクセスした時に表示される
        client.send('接続しました');
        console.log('connection');
        
        // data
        client.emit('amida_data', line_data);
        
        //クライアント側からmessage受信ハンドラ
        client.on('message', function(message) {
            //自分のブラウザへ
            client.send(message);
            //他のブラウザへ
            client.broadcast(message);
        });
        
        //クライアント切断時のハンドラ
        client.on('disconnect', function(){
            //client.broadcast();
        });
    
    });
}

// line_data
var line_data = {
    vertical :    [
                      { start: { x: 0, y: 0 }, end: { x: 0, y: 20 }, end_name: "" },
                      { start: { x: 5, y: 0 }, end: { x: 5, y: 20 }, end_name: "当たり" },
                      { start: { x: 10, y: 0 }, end: { x: 10, y: 20 }, end_name: "" }
                  ],
    
    horizontal :  [
                      { start: { x: 0, y: 5 },  end: { x: 5, y: 5 } },
                      { start: { x: 5, y: 10 },  end: { x: 10, y: 10 } },
                      { start: { x: 5, y: 12 },  end: { x: 10, y: 12 } },
                      { start: { x: 5, y: 7 },  end: { x: 10, y: 7 } },
                      { start: { x: 0, y: 15 },  end: { x: 5, y: 15 } }
                  ]
};
