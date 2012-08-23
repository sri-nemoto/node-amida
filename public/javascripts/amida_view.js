/**
 * グローバル変数
 */

// 座標データ
var line_data = null;

// 総参加者数
var all_player_count = 0;

// アニメーション開始フラグ
var animation_flag = false;

// 横棒座標の長さ
var horizontal_length = 0;

// 座標ひとマス当たりのpixel数
var point_length_x = 0;
var point_length_y = 0;

// Canvas上の座標の原点のpixel数単位の座標
var base_point = null;

// Socket通信用オブジェクト
var socket = io.connect("http://" + location.hostname + ":" + location.port);

// アミダCanvasオブジェクト
var canvas;


/**
 * ページがロードされたときの処理
 */
$(function () {
    
    // コネクションハンドラ
    socket.on("connect", function(message) {
        console.log("connect start");
        var url = $("#url").val();
        // url値(一意)をemit
        socket.emit("url", url);
    });
    
    // データ("amidaData")受信ハンドラ
    socket.on("amidaData", function(data){
        if (AmidaCanvas.checkLineData(data)) {
            // 受信したデータの整合性が正しい場合
            
            // 座標データをセット
            line_data = data;
            
            // 全参加者数
            all_player_count = line_data.vertical.length;
            
            // 座標定義情報
            get_line_length_definition();
            
            // HTMLデザイン
            design();
            
            // アミダCanvasオブジェクト生成
            canvas = new AmidaCanvas(line_data, point_length_x, point_length_y, base_point);
            
            // 覆いの表示・非表示
            var cover_flag = ($("#start_amida").val() !== "true");
            canvas.cover(cover_flag);
            // 静的アミダライン表示
            canvas.makeLine();
            
            console.log("data get, vertilal line length :" + data.vertical.length);
        } else {
            console.log("data from server is not invalid");
            alert("システムエラーが発生しました！リロードをお願いします。");
        }
    });
    
    // メッセージ受信ハンドラ
    socket.on("message", function(message){
        console.log("message :" + message);
        alert(message);
    });
    
    // データ("users")受信ハンドラ
    socket.on("users", function(data){
        var users = data.users;
        if (users.length) {
          var botton_flag = (all_player_count > 0 && all_player_count == users.length);
          button_design(users, botton_flag);
          if (botton_flag) {
            // 覆いの非表示、静的アミダライン表示
            canvas.cover(false);
            canvas.makeLine();
          }
          design();
        }
    });
    
    //サーバ切断
    socket.on("disconnect", function(message){
        console.log("disconnect");
    });
    
    // アニメーション開始ボタン
    $(".start_button").live("click", function() {
        if (animation_flag) {
            animation_flag = false;
            
            // 初期化
            canvas.cover(false);
            canvas.makeLine();
            
            // アニメーション開始
            var index = $(this).attr("id").replace("button_", "");
            canvas.animation(index, function (error) {
                animation_flag = true;
                var message = "GOAL!";
                if (error) {
                    console.log(error.message);
                    message = error.message;
                }
                alert(message);
            });
        }
    });
    
    // ユーザー登録ボタン
    $(".user_regist").click(function() {
        var index = $(this).attr("id").replace("user_regist_", "");
        var user_name  = $("#user_" + index).val();
        if (user_name.length == 0 || user_name.length > 8) {
          alert("1文字以上8文字以内で名前を入力してください");
        } else {
          var url = $("#url").val();
          socket.emit("user", { url : url, position : index, name : user_name});
        }
    });
});


/**
 * (座標・ライン関連)
 * 横棒座標の長さを取得
 */
var get_horizontal_length = function () {
    var horizontal_data  = line_data.horizontal[0];
    var horizontal_start = horizontal_data.start;
    var horizontal_end   = horizontal_data.end;
    if (horizontal_end.x >= horizontal_start.x) {
        return (horizontal_end.x - horizontal_start.x);
    } else {
        return (horizontal_start.x - horizontal_end.x);
    }
}

/**
 * (座標・ライン関連)
 * 座標定義
 */
var get_line_length_definition = function () {
    // 横棒座標の長さ
    horizontal_length = get_horizontal_length();
    
    // 座標ひとマス当たりのpixel数
    point_length_x = Math.floor(AmidaCanvas.totalWidth / all_player_count / horizontal_length);
    point_length_y = 20;
    
    // 座標の中心点の実座標(pixel数)
    base_point = {x:Math.floor(AmidaCanvas.totalWidth / all_player_count / 2) , y:0};
}


/**
 * (HTMLエレメント生成)
 * 全体のHTMLを生成
 */
var design = function() {
    
    $("#amida").width(point_length_x * all_player_count * horizontal_length);
    
    $(".goal_division").width(point_length_x * horizontal_length);
    
    $(".start_division").width(point_length_x * horizontal_length);
    
    var start_button_margin = Math.floor(AmidaCanvas.totalWidth / all_player_count / 2) - 40;
    $(".start_button").css("margin-left", start_button_margin + "px");
    
    var start_input_area_margin = Math.floor(AmidaCanvas.totalWidth / all_player_count / 2) - 55;
    $(".start_input_area").css("margin-left", start_input_area_margin + "px");
    if (point_length_x * horizontal_length < 160) {
        $(".start_input_area").width(80);
    }
}

/**
 * (HTMLエレメント生成)
 * ユーザー入力欄、スタートボタン欄のHTMLを生成
 */
var button_design = function (users, buttnon_flag) {
  if (buttnon_flag) {
     for (i = 0 ; i < users.length ; i++ ) {
       var user = users[i];
       var element = '<input type="button" id="button_' + user.position + '" class="start_button" value="' + user.name  + '" />';
       $("#start_division_" + user.position).empty();
       $("#start_division_" + user.position).append(element);
     }
   } else {
     for (i = 0 ; i < users.length ; i++ ) {
       var user = users[i];
       var element = '<div class="member_name">' + user.name + '</div>';
       $("#start_division_" + user.position).empty();
       $("#start_division_" + user.position).append(element);
     }
   }
}