
// *******************************************
// サーバーサイドからのデータ
// *******************************************

// 座標データ
var line_data = null;
var all_player_count = 0;
var total_width = 900;

// アニメーション開始フラグ
var animation_flag = true;

// *******************************************
// socket通信
// *******************************************

var socket = function () {
    var socket = io.connect("http://"+ location.hostname +":8080");
    
    // コネクションハンドラ
    socket.on("connect", function(message) {
        console.log("connect start");
        var url = $("#url").val();
        socket.emit("url", url);
    });
    
    // データ("amidaData")受信ハンドラ
    socket.on("amidaData", function(data){
        if (data) {
            // 座標データをセット
            line_data = data;
            
            // 全参加者数
            all_player_count = line_data.vertical.length;
            
            // 座標定義情報
            get_line_length_definition();
            
            // HTMLデザイン
            design();
            
            // 静的ライン作成
            var start_amida = $("#start_amida").val();
            var holizontal_flag = (start_amida == "true") ? true : false;
            make_line(holizontal_flag);
            
            // アニメーション開始ボタン
            $(".start_button").live("click", function() {
                
                if (animation_flag) {
                    animation_flag = false;
                    
                    // 初期化
                    make_line(true);
                    
                    // アニメーション開始
                    var index = $(this).attr("id").replace("button_", "");
                    animation(index);
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
            
            console.log("data get :" + data.vertical.length);
        } else {
            console.log("data not get");
        }
    });
    
    // メッセージ受信ハンドラ
    socket.on("message", function(message){
        alert(message);
    });
    
    // データ("users")受信ハンドラ
    socket.on("users", function(data){
        var users = data.users;
        if (users.length) {
          if (all_player_count > 0 && all_player_count == users.length) {
            for (i = 0 ; i < users.length ; i++ ) {
              var user = users[i];
              var element = '<input type="button" id="button_' + user.position + '" class="start_button" value="' + user.name  + '" />';
              $("#start_division_" + user.position).empty();
              $("#start_division_" + user.position).append(element);
            }
            make_line(true);
            design();
          } else {
            for (i = 0 ; i < users.length ; i++ ) {
              var user = users[i];
              var element = '<div class="member_name">' + user.name + '</div>';
              $("#start_division_" + user.position).empty();
              $("#start_division_" + user.position).append(element);
            }
            design();
          }
        }
    });
    
    //サーバ切断
    socket.on("disconnect", function(message){
        console.log("切断されました");
    });
}

// *******************************************
// 座標ライン定義
// *******************************************

// 横棒座標の長さを取得
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

// 横棒座標の長さ
var horizontal_length = 0;

// 座標ひとマス当たりのpixel数
var point_length_x = 0;
var point_length_y = 0;

// 座標の中心点の実座標(pixel数)
var base_point = null;

// 座標定義
var get_line_length_definition = function () {
    // 横棒座標の長さ
    horizontal_length = get_horizontal_length();
    
    // 座標ひとマス当たりのpixel数
    point_length_x = Math.floor(total_width / all_player_count / horizontal_length);
    point_length_y = 20;
    
    // 座標の中心点の実座標(pixel数)
    base_point = {x:Math.floor(total_width / all_player_count / 2) , y:0};
}

// *******************************************
// HTMLデザイン
// *******************************************

var design = function() {
    
    $("#amida").width(point_length_x * all_player_count * horizontal_length);
    
    $(".goal_division").width(point_length_x * horizontal_length);
    
    $(".start_division").width(point_length_x * horizontal_length);
    
    var start_button_margin = Math.floor(total_width / all_player_count / 2) - 40;
    $(".start_button").css("margin-left", start_button_margin + "px");
    
    var start_input_area_margin = Math.floor(total_width / all_player_count / 2) - 55;
    $(".start_input_area").css("margin-left", start_input_area_margin + "px");
    if (point_length_x * horizontal_length < 160) {
        $(".start_input_area").width(80);
    }
}


// *******************************************
// 静的ライン定義
// *******************************************
var line_define = {

    stroke_style : "#000000",
    line_width : 8,
    text_font : "12px 'MS ゴシック'",
    text_base_line : "top",
    text_align : "center"
};


// *******************************************
// アニメーション定義
// *******************************************
var animation_define = {
    interval : 5,
    stroke_style : "#ffffff",
    line_width : 5,
    line_cap : "square"
};


// *******************************************
// ページがロードされたときの処理
// *******************************************

$(function () {
    
    // socket通信
    socket();
});

// *******************************************
// function
// *******************************************

// X座標をCanvas上のpixel数変換
var set_point_x = function (point) {
  return (point * point_length_x + base_point.x);
};

// Y座標をCanvas上のpixel数変換
var set_point_y = function (point) {
  return (point * point_length_y + base_point.y);
};

// 静的ライン作成
var make_line = function (holizontal_flag) {
    // Canvasの2Dコンテキスト
    var ctx = $("#amida_canvas").get(0).getContext("2d");
    
    // 縦ライン
    for (i = 0 ; i < line_data.vertical.length ; i++) {
        
        // 縦ライン
        var point_data = line_data.vertical[i];
        var start    = point_data.start;
        var end      = point_data.end;
        var end_name = point_data.end_name;
        
        // 縦ライン作成
        ctx.beginPath();
        
        // Canvas座標始点
        ctx.moveTo(set_point_x(start.x), set_point_y(start.y));
        
        // ライン終点
        ctx.lineTo(set_point_x(end.x), set_point_y(end.y));
        
        // 定義したパスを描画
        ctx.strokeStyle = line_define.stroke_style;
        ctx.lineWidth   = line_define.line_width;
        ctx.stroke();
    }
    
    if (holizontal_flag) {
        // 横ライン
        for (i = 0 ; i < line_data.horizontal.length ; i++) {
            
            // 横ライン
            var point_data = line_data.horizontal[i];
            var start      = point_data.start;
            var end        = point_data.end;
            
            // 横ライン作成
            ctx.beginPath();
            
            // ライン始点
            ctx.moveTo(set_point_x(start.x), set_point_y(start.y));
            
            // ライン終点
            ctx.lineTo(set_point_x(end.x), set_point_y(end.y));
            
            // 定義したパスを描画
            ctx.strokeStyle = line_define.stroke_style;
            ctx.lineWidth   = line_define.line_width;
            ctx.stroke();
        }
    }
};

// アニメーション
var animation = function (index) {
    
    // 始点情報
    var point_data = line_data.vertical[index];
    var start      = point_data.start;
    
    // ゴール地点のY座標
    var y_end      = point_data.end.y;
    
    // 現在位置
    var x = set_point_x(start.x);
    var y = set_point_y(start.y);
    
    // X軸移動フラグ
    var moving_x_flag = false;
    
    // X軸移動目標
    var x_destination;
    
    // Canvasの2Dコンテキスト
    var ctx = $("#amida_canvas").get(0).getContext("2d");
    
    // アニメーションタイマー
    var timer_paint = setInterval(function () {
        
        if (moving_x_flag == true) {
            
            // X軸移動
            
            if (x_destination == null) {
                console.log("error");
                clearInterval(timer_paint);
            }
            
            // X軸座標が目標に到達どうかを判別
            if (x ==  set_point_x(x_destination.x)) {
                // 目標に到着したらY軸移動
                moving_x_flag = false;
                write_line_y();
                return;
            }
            
            write_line_x();
            
        } else {
            
            // Y軸移動
            
            x_destination = null;
            
            // Y軸座標が横棒が存在する箇所かどうかを判別
            if (((y - set_point_y(start.y)) % point_length_y) == 0) {
                // 横棒群検索
                if (search_horizontal_lines()) {
                    // 検索にヒットしたらX軸移動
                    moving_x_flag = true;
                    write_line_x();
                    return;
                }
            
            }
            
            write_line_y();
        }
        
        // ゴールに到達したかどうかを判別する
        if (y == set_point_y(y_end)) {
            clearInterval(timer_paint);
            animation_flag = true;
            alert("Goal");
        }
    }, animation_define.interval);
    
    // X軸移動
    var write_line_x = function () {
        
        // X軸移動開始
        ctx.beginPath();
        
        // 先端の種類
        ctx.lineCap = animation_define.line_cap;
        
        // ライン始点
        ctx.moveTo(x, y);
        
        // X軸に移動
        x = (x < set_point_x(x_destination.x)) ? (x + 1) : (x - 1);
        ctx.lineTo(x, y);
        
        // 定義したパスを描画
        ctx.strokeStyle = animation_define.stroke_style;
        ctx.lineWidth   = animation_define.line_width;
        ctx.stroke();
    };
    
    // Y軸移動
    var write_line_y = function () {
        
        // Y軸移動開始
        ctx.beginPath();
        
        // 先端の種類
        ctx.lineCap = animation_define.line_cap;
        
        // ライン始点
        ctx.moveTo(x, y);
        
        // Y軸に移動
        y = y + 1;
        ctx.lineTo(x, y);
        
        // 定義したパスを描画
        ctx.strokeStyle = animation_define.stroke_style;
        ctx.lineWidth   = animation_define.line_width;
        ctx.stroke();
    };
    
    // 横棒群検索
    var search_horizontal_lines = function () {
        var horizontal_datas = line_data.horizontal;
        
        for (i = 0 ; i < horizontal_datas.length ; i++) {
            var point1 = horizontal_datas[i].start;
            var point2 = horizontal_datas[i].end;
            
            if (x == set_point_x(point1.x) && y == set_point_y(point1.y)) {
                x_destination = point2;
                return true;
            }
            if (x == set_point_x(point2.x) && y == set_point_y(point2.y)) {
                x_destination = point1;
                return true;
            }
        }
        
        return false;
    };
};

