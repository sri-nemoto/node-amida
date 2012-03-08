// require
var mongoose = require('mongoose');

// connect
mongoose.connect(
  'mongodb://localhost/amida'
  , function(err){
    if (err) {
      console.log("[mongoose error]" + err);
      throw err;
    }
  }
);

// Schemaオブジェクト作成
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

// UsersSchema定義
var UsersSchema = new Schema({
  // ユーザー名
  name: {type: String, required: true, trim: true}
  // 何番目？
  , position: {type: Number, required: true, min: 0, max: 100}
});

// ItemsSchema定義
var ItemsSchema = new Schema({
  // アイテム名
  name: {type: String, required: true, trim: true}
  // 何番目？
  , position: {type: Number, required: true, min: 0, max: 100}
});

// PlotsSchema定義
var PlotsSchema = new Schema({
  // start
  start: {
    x: {type: Number, required: true, min: 0, max: 100}
    , y: {type: Number, required: true, min: 0, max: 100}
  }
  // end
  , end: {
    x: {type: Number, required: true, min: 0, max: 100}
    , y: {type: Number, required: true, min: 0, max: 100}
  }
});

// AmidaSchema定義
var AmidaSchema = new Schema({
  // 名前
  title: {type: String, required: true, trim: true}
  // メッセージ
  , message: {type: String, required: true, trim: true}
  // ユーザーリスト（UsersSchemaを参照）
  , users: [UsersSchema]
  // アイテムリスト（ItemsSchemaを参照）
  , items: [ItemsSchema]
  // 管理パスワード
  , adminPass: {type: String, required: false}
  // 利用者パスワード
  , userPass: {type: String, required: true}
  // URL
  , url: {type: String, required: true, trim: true}
  // あみだくじデータ
  , plots: [PlotsSchema]
  // 作成日時
  , registed: {type: Date, required: true, default: Date.now()}
});

// model登録
var Amida = mongoose.model('Amida', AmidaSchema);
var Manager = function(){};

/**
 * 認証
 *
 * @param string url URL
 * @param string pass 利用者パスワード
 */
Manager.prototype.auth = function(url, pass, callback) {
  Amida.find({url: url, userPass: pass}, function(err, amida) {
    if (err) {
      console.log(err);
    }
    callback(err, amida);
  });
};

/**
 * URL指定検索
 *
 * @param string url URL
 */
Manager.prototype.find = function(url, callback) {
  Amida.find({url: url}, function(err, amida) {
    if (err) {
      console.log(err);
     }
    callback(err, amida);
  });
};

/**
 * あみだくじ登録
 *
 * @param object data 入力値
 */
Manager.prototype.regist = function(data, callback) {
  // new amida
  var amida = new Amida();
  amida.title = data.title;
  amida.message = data.message;
  // add items
  for (var i = 0; i < data.items.length; i++) {
    amida.items.push(data.items[i]);
  }
  amida.adminPass = data.adminPass;
  amida.userPass = data.userPass;
  amida.registed = Date.now();
  amida.url = data.url;
  // add plots
  for (var i = 0; i < data.plots.length; i++) {
    amida.plots.push(data.plots[i]);
  }

  // save
  amida.save(function(err, amida) {
    if (err) {
      console.log(err);
    }
    callback(err, amida);
  });
};

/**
 * 参加者追加
 *
 * @param string url url
 * @param string name 参加者名
 * @param int position 参加者順番
 */
Manager.prototype.join = function(url, name, position, callback) {
  // find -> set -> save
  Amida.find({url: url}, function(err, amidas) {
    if (err) {
      console.log(err);
      callback(err, null);
    }
    
    var amida = amidas[0];
    var users = amida.users;
    var rigistFlag = true;
    
    // position check
    if (users != undefined) {
      for (var i = 0; i < users.length; i++ ) {
        if (!users[i]) {
          continue;
        }
        if (users[i].position == position) {
          rigistFlag = false;
          console.log("the position has been registed");
          callback({ message: "該当ポジションにはすでに登録済です" } , amida);
        }
      }
    }
    
    if (rigistFlag) {
      // user
      var user = { name : name, position: position };
      amida.users.push(user);
      
      // save
      amida.save(function(err, amida) {
        if (err) {
          console.log(err);
        }
        callback(err, amida);
      });
    }
  });
}

/**
 * アミダ線データ
 *
 * @param string url url
 */
Manager.prototype.getLineData = function(url, callback) {
  if (url) {
    this.find(url, function(err, amidas) {
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
        var data = { vertical : varticals, horizontal : horizontals };
        callback(err, data);
      } else {
        console.log(err);
        if (err) {
          callback(err, data);
        } else {
          callback({ message: "アミダ情報が適切ではありません" }, data);
        }
      }
    });
  }
}

/**
 * アミダ横線データ群生成
 *
 * @param int cnt 参加者人数
 */
Manager.prototype.makePlotsData = function(cnt, callback) {
  if (cnt < 3 || cnt > 9 ) {
    callback({ message: '引数は3～9の間の数字にしてください' }, null);
  }
  
  // 横棒の幅
  var barWidth = 5;
  
  // 縦列における横棒の最大数
  var maxBarLength = 4;
  
  // 横棒データ群
  var plotDatas = [];
  
  // plot格納用
  var endPoints = [];
  var preEndPoints = [];
  
  for (var i = 0 ; i < (cnt - 1) ; i++) {
    // 横棒の数
    var lineCount = Math.floor(Math.random() * 100 % maxBarLength) + 1;
    
    // 前縦列のデータを格納
    preEndPoints = endPoints;
    endPoints = [];
    
    for (var j = 0 ; j < lineCount ; j++) {
      
      var plot = Math.floor(Math.random() * 100 % 9) * 2 + 2;
      
      // 判定用フラグ
      plotsFlag = true;
      for (var k = 0 ; k < preEndPoints.length ; k++) {
        // 前縦列ですでに選択してしまっているY値かどうかを判別
        plotsFlag = (preEndPoints[k] == plot) ? false : plotsFlag;
      }
      for (var l = 0 ; l < endPoints.length ; l++) {
        // 本縦列ですでに選択してしまっているY値かどうかを判別
        plotsFlag = (endPoints[l] == plot) ? false : plotsFlag;
      }
      
      if (plotsFlag) {
        // plot確定
        endPoints.push(plot);
        preEndPoints.push(plot);
      } else {
        // 再度ランダム値を取得
        j = j - 1;
      }
    }
    
    // 数字順に並べ替え
    endPoints.sort(compare);
    for (m = 0 ; m < endPoints.length ; m++ ) {
      // データ格納
      plotDatas.push({ start : { x : (i * barWidth), y : endPoints[m] }, end : { x : ((i + 1) * barWidth), y : endPoints[m] } });
    }
  }
  
  callback(null, plotDatas);
  
  // sort用比較
  function compare(num1, num2){
    return -(num2 - num1);
  }
}

exports.Manager = new Manager();
