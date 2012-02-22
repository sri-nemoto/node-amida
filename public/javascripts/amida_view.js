
// *******************************************
// サーバーサイドからのデータ
// *******************************************

// 座標データ
var line_data = {
    vertical :      [
                        { start: { x: 0, y: 0 }, end: { x: 0, y: 20 }, end_name: "" },
                        { start: { x: 5, y: 0 }, end: { x: 5, y: 20 }, end_name: "当たり" },
                        { start: { x: 10, y: 0 }, end: { x: 10, y: 20 }, end_name: "" }
                    ],
    
    horizontal :    [
                        [ { x: 0, y: 5 }, { x: 5, y: 5 } ],
                        [ { x: 5, y: 10 }, { x: 10, y: 10 } ],
                        [ { x: 5, y: 12 }, { x: 10, y: 12 } ],
                        [ { x: 5, y: 7 }, { x: 10, y: 7 } ],
                        [ { x: 0, y: 15 }, { x: 5, y: 15 } ]
                    ]
};

var total_width = 900;
var player_count = line_data.vertical.length;

// *******************************************
// 座標ライン定義
// *******************************************

// 横棒座標の長さを取得
var get_horizontal_length = function () {
    var horizontal_data  = line_data.horizontal[0];
    var horizontal_start = horizontal_data[0];
    var horizontal_end   = horizontal_data[1];
    if (horizontal_end.x >= horizontal_start.x) {
        return (horizontal_end.x - horizontal_start.x);
    } else {
        return (horizontal_start.x - horizontal_end.x);
    }
}
var horizontal_length = get_horizontal_length();

// 座標ひとマス当たりのpixel数
var point_length_x = Math.floor(total_width / player_count / horizontal_length);
var point_length_y = 20;

// 座標の中心点の実座標(pixel数)
var base_point = {x:Math.floor(total_width / player_count / 2) , y:0};

// *******************************************
// HTMLデザイン
// *******************************************

var design = function() {
    var start_button_margin = Math.floor(total_width / player_count / 2) - 40;
    $('.start_button').css('margin-left', start_button_margin + 'px');
    //$('.start_button').css({ margin-left: start_button_margin + 'px', margin-right: start_button_margin + 'px'});
    var start_text_margin = Math.floor(total_width / player_count / 2) - 55;
    $('.start_text').css('margin-left', start_text_margin + 'px');
    
    $('#amida').width(point_length_x * player_count * 5);
    //$('#amida').width(900);
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
    interval : 10,
    stroke_style : "#ffffff",
    line_width : 5,
    line_cap : "square"
};


// *******************************************
// ページがロードされたときの処理
// *******************************************

$(function () {
    
    // HTMLデザイン
    design();
    
    // 静的ライン作成
    make_line();
    
    
    // アニメーション
    $('.start_button').click(function() {
        // 初期化
        make_line();
        
        // アニメーション開始
        var index = $(this).attr("id").replace("button_", "");
        animation(index);
    });
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
var make_line = function () {
    // canvasの2Dコンテキスト
    var ctx = document.getElementById("sample").getContext("2d");
    
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
        
        /*
        // ゴール文字
        ctx.font         = line_define.text_font;
        ctx.textBaseline = line_define.text_base_line;
        ctx.textAlign    = line_define.text_align;
        ctx.fillText(end_name, set_point_x(end.x), set_point_y(end.y));
        */
    }
    
    // 横ライン
    for (i = 0 ; i < line_data.horizontal.length ; i++) {
        
        // 横ライン
        var point_data = line_data.horizontal[i];
        var start      = point_data[0];
        var end        = point_data[1];
        
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
    
    var ctx = document.getElementById("sample").getContext("2d");
    
    // アニメーションタイマー
    var timer_paint = setInterval(function () {
    //var timer_paint = setTimeout(function () {
        
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
            var point1 = horizontal_datas[i][0];
            var point2 = horizontal_datas[i][1];
            
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
