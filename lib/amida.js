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
  , admin_pass: {type: String, required: false}
  // 利用者パスワード
  , user_pass: {type: String, required: true}
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
  Amida.find({url: url, user_pass: pass}, function(err, amida) {
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
  for (var i = 0; i < data.items.length; i++) {
    amida.items.push(data.items[i]);
  }
  amida.admin_pass = data.admin_pass;
  amida.user_pass = data.user_pass;
  amida.registed = Date.now();
  amida.url = data.url;
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
 * @param string id amida._id
 * @param array users 参加者
 */
Manager.prototype.join = function(id, users, callback) {
  // find -> set -> save
  Amida.findById(id, function(err, old) {
    if (err || !users.lenght) {
      console.log(err);
      callback(err, null);
    }

    // add users
    for (var i = 0; i < users.length; i++) {
      old.users.push(users[i]);
    }

    // save
    old.save(function(err, amida) {
      if (err) {
        console.log(err);
      }
      callback(err, amida);
    });
  });
}

exports.Manager = new Manager();