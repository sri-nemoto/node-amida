var lines = []
  , line_define = {
    color : "#000000"
    , width : 5
  }
  , player_count = 0
  , canvas_width = 900
  , canvas_height = 200
  , canvas_margin = 20
  , pixel_x = 0
  , pixel_y = canvas_height
;

// 座標ひとマス当たりのpixel数
var set_pixel_x = function () {
  var count = (player_count - 1 == 0) ? player_count : player_count - 1;
  pixel_x = (canvas_width - (canvas_margin * 2)) / player_count;
}

//
var design = function() {
  $('#amida').attr('width', canvas_width).attr('height', canvas_height);
}

// ライン作成
var draw_canvas = function() {
  // canvasの2Dコンテキスト
  var ctx = document.getElementById('amida').getContext('2d');

  for (i = 1 ; i <= player_count ; i++) {
    ctx.beginPath();

    // ライン始点
    var start_x = pixel_x * i - (pixel_x / 2);
    var start_y = 0;
    ctx.moveTo(start_x, start_y);

    // ライン終点
    var end_x = start_x;
    var end_y = canvas_height;
    ctx.lineTo(end_x, end_y);

    // 描画
    ctx.strokeStyle = line_define.color;
    ctx.lineWidth = line_define.width;
    ctx.stroke();
  };

  // マスク
  ctx.fillRect(
    canvas_margin
    , canvas_margin
    , canvas_width - canvas_margin * 2
    , canvas_height - canvas_margin * 2
  );

};

// フォームの生成
var set_form = function() {
  var margin = Math.floor(pixel_x / 2 - 55);
  for (i = 1; i <= player_count; i++) {
    var id = 'item_' + i;
    var form = '<div class="item" style="width: ' + pixel_x + 'px; height: 30px; float: left; "><input type="text" name="' + id + '" id="' + id + '" value=" <%= lotteryNumber %>" style="width: 80px; text-align: center; margin-left: ' + margin + 'px; " />';
    $(".item_forms").append(form);
  }
}

// event
$('#lotteryNumber').bind('keyup', function() {
  // form clear
  window.alert('keyup');
  $(".item_forms").empty();

  // canvas clear
  var ctx = document.getElementById("amida").getContext("2d");
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas_width, canvas_height);

  var lot = parseInt($(this).val());
  if (isNaN(lot) === false && lot <= 8) {
    player_count = lot;
    set_pixel_x();
    design();
    draw_canvas();
    set_form();
  }
});

// event
$('#lotteryNumber').load('keyup', function() {
  // form clear
  $(".item_forms").empty();

  // canvas clear
  var ctx = document.getElementById("amida").getContext("2d");
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas_width, canvas_height);

  var lot = parseInt($(this).val());
  if (isNaN(lot) === false && lot <= 8) {
    player_count = lot;
    set_pixel_x();
    design();
    draw_canvas();
    set_form();
  }
});