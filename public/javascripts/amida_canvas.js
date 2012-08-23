/**
 * アミダCanvas オブジェクト
 *
 * @param object lineData アミダ線情報
 * @param int pixelX X軸単位pixel数
 * @param int pixelY Y軸単位pixel数
 * @param object basePoint 原点のpixel数単位の座標
 */
var AmidaCanvas = function(lineData, pixelX, pixelY, basePoint) {
    // アミダ線情報
    this.lineData = lineData;
    
    // 座標ひとマス当たりのpixel数
    this.pixelX = pixelX;
    this.pixelY = pixelY;
    
    // Canvas上の座標の原点のpixel数単位の座標
    this.basePoint = basePoint;
};

// アミダCanvas部幅(pixel)
AmidaCanvas.totalWidth = 900;

// 静的ライン定義
AmidaCanvas.lineDefine = {
    strokeStyle : "#000000",
    lineWidth : 8,
    textFont : "12px 'MS ゴシック'",
    textBaseLine : "top",
    textAlign : "center"
};

// 静的ライン覆い定義
AmidaCanvas.coverDefine = {
    strokeStyle : "#000000",
    start : { x : 20, y : 20 },
    width : 860,
    height : 360 
};

// アニメーション定義
AmidaCanvas.animationDefine = {
    interval : 5,
    strokeStyle : "#ffffff",
    lineWidth : 5,
    lineCap : "square"
};

/**
 * サーバーより取得したラインデータの整合性が正しいかどうかをチェック
 *
 * @param object data サーバーより取得したデータ
 * @return boolean checkFlag 整合性が正しいかどうか
 */
AmidaCanvas.checkLineData = function (data) {
    var checkFlag = true;
    
    // データ
    if (!data instanceof Object) {
        console.log("data from server isn't object:" + typeof data);
        console.log(data);
        return false;
    }
    
    // 縦ライン
    if (data.vertical instanceof Array) {
        for (i = 0 ; i < data.vertical.length ; i++) {
            
            // 縦ライン
            var pointData = data.vertical[i];
            var start     = pointData.start;
            var end       = pointData.end;
            var endName   = pointData.endName;
            
            // 座標データチェック
            if (typeof start.x !== "number" || 
              typeof start.y !== "number" || 
              typeof end.x !== "number" || 
              typeof end.y !== "number") {
                console.log("vertical data from server is invalid");
                checkFlag = false;
            }
        }
    } else {
        console.log("vertical data from server isn't array");
        checkFlag = false;
    }
    
    // 横ライン
    if (data.horizontal instanceof Array) {
        for (i = 0 ; i < data.horizontal.length ; i++) {
            
            // 横ライン
            var pointData = data.horizontal[i];
            var start      = pointData.start;
            var end        = pointData.end;
            
            // 座標データチェック
            if (typeof start.x !== "number" || 
              typeof start.y !== "number" || 
              typeof end.x !== "number" || 
              typeof end.y !== "number") {
                console.log("horizontal data from server is invalid");
                checkFlag = false;
            }
        }
    } else {
        console.log("horizontal data from server isn't array");
        checkFlag = false;
    }
    
    if (!checkFlag) {
        console.log(data);
    }
    
    return checkFlag;
},

AmidaCanvas.prototype = {
    
    /**
     * X座標をCanvas上のpixel数変換
     *
     * @param int point X座標
     * @return int point pixelに変換されたX座標
     */
    setPointX : function (point) {
      return (point * this.pixelX + this.basePoint.x);
    },
    
    /**
     * Y座標をCanvas上のpixel数変換
     *
     * @param int point Y座標
     * @return int point pixelに変換されたY座標
     */
    setPointY : function (point) {
      return (point * this.pixelY + this.basePoint.y);
    },
    
    /**
     * 静的ライン作成
     */
    makeLine : function () {
        // Canvasの2Dコンテキスト
        var ctx = $("#amida_canvas").get(0).getContext("2d");
        
        // 縦ライン
        for (i = 0 ; i < this.lineData.vertical.length ; i++) {
            
            // 縦ライン
            var pointData = this.lineData.vertical[i];
            var start     = pointData.start;
            var end       = pointData.end;
            var endName   = pointData.endName;
            
            // 縦ライン作成
            ctx.beginPath();
            
            // Canvas座標始点
            ctx.moveTo(this.setPointX(start.x), this.setPointY(start.y));
            
            // ライン終点
            ctx.lineTo(this.setPointX(end.x), this.setPointY(end.y));
            
            // 定義したパスを描画
            ctx.strokeStyle = AmidaCanvas.lineDefine.strokeStyle;
            ctx.lineWidth   = AmidaCanvas.lineDefine.lineWidth;
            ctx.stroke();
        }
        
        // 横ライン
        for (i = 0 ; i < this.lineData.horizontal.length ; i++) {
            
            // 横ライン
            var pointData = this.lineData.horizontal[i];
            var start      = pointData.start;
            var end        = pointData.end;
            
            // 横ライン作成
            ctx.beginPath();
            
            // ライン始点
            ctx.moveTo(this.setPointX(start.x), this.setPointY(start.y));
            
            // ライン終点
            ctx.lineTo(this.setPointX(end.x), this.setPointY(end.y));
            
            // 定義したパスを描画
            ctx.strokeStyle = AmidaCanvas.lineDefine.strokeStyle;
            ctx.lineWidth   = AmidaCanvas.lineDefine.lineWidth;
            ctx.stroke();
        }
    },
    
    // 静的ラインの覆いの表示・非表示
    cover : function (coverFlag) {
        // Canvasの2Dコンテキスト
        var ctx = $("#amida_canvas").get(0).getContext("2d");
        
        var coverStart = AmidaCanvas.coverDefine.start;
        var coverWidth = AmidaCanvas.coverDefine.width;
        var coverHeight = AmidaCanvas.coverDefine.height;
        
        if (!coverFlag) {
            // 覆い非表示
            ctx.clearRect(coverStart.x, coverStart.y, coverWidth, coverHeight);
        } else {
            // 覆い表示
            ctx.fillStyle = AmidaCanvas.coverDefine.strokeStyle;
            ctx.fillRect(coverStart.x, coverStart.y, coverWidth, coverHeight);
        }
    },
    
    /**
     * アニメーション
     *
     * @param int index アニメーション対象
     * @param function callback アニメーション終了後のコールバック関数
     */
    animation : function (index, callback) {
        
        // 入力値チェック
        if (index.match(/[^0-9]+/) || index >= this.lineData.vertical.length || typeof callback !== "function") {
            console.log("animetion validation error");
            console.log({ "index" : index, "callback" : callback });
            callback({ message : "不正な値が入力されました！" });
            return;
        }
        
        // 始点情報
        var pointData = this.lineData.vertical[index];
        var start     = pointData.start;
        
        // ゴール地点のY座標
        var yEnd = pointData.end.y;
        
        // 現在位置
        var x = this.setPointX(start.x);
        var y = this.setPointY(start.y);
        
        // X軸移動フラグ
        var movingXFlag = false;
        
        // X軸移動目標
        var xDestination;
        
        // Canvasの2Dコンテキスト
        var ctx = $("#amida_canvas").get(0).getContext("2d");
        
        // アニメーションタイマー
        var object = this;
        var timerPaint = setInterval(function () {
            
            if (movingXFlag == true) {
                
                // X軸移動
                
                if (xDestination == null) {
                    console.log("error");
                    clearInterval(timerPaint);
                }
                
                // X軸座標が目標に到達どうかを判別
                if (x ==  object.setPointX(xDestination.x)) {
                    // 目標に到着したらY軸移動
                    movingXFlag = false;
                    writeLineY();
                    return;
                }
                
                writeLineX(object);
                
            } else {
                
                // Y軸移動
                
                xDestination = null;
                
                // Y軸座標が横棒が存在する箇所かどうかを判別
                if (((y - object.setPointY(start.y)) % object.pixelY) == 0) {
                    // 横棒群検索
                    if (searchHorizontalLines(object, object.lineData.horizontal)) {
                        // 検索にヒットしたらX軸移動
                        movingXFlag = true;
                        writeLineX(object);
                        return;
                    }
                
                }
                
                writeLineY();
            }
            
            // ゴールに到達したかどうかを判別する
            if (y == object.setPointY(yEnd)) {
                clearInterval(timerPaint);
                // アニメーション終了後のコールバック実行
                callback();
            }
        }, AmidaCanvas.animationDefine.interval);
        
        // X軸移動
        var writeLineX = function (object) {
            
            // X軸移動開始
            ctx.beginPath();
            
            // 先端の種類
            ctx.lineCap = AmidaCanvas.animationDefine.lineCap;
            
            // ライン始点
            ctx.moveTo(x, y);
            
            // X軸に移動
            x = (x < object.setPointX(xDestination.x)) ? (x + 1) : (x - 1);
            ctx.lineTo(x, y);
            
            // 定義したパスを描画
            ctx.strokeStyle = AmidaCanvas.animationDefine.strokeStyle;
            ctx.lineWidth   = AmidaCanvas.animationDefine.lineWidth;
            ctx.stroke();
        };
        
        // Y軸移動
        var writeLineY = function () {
            
            // Y軸移動開始
            ctx.beginPath();
            
            // 先端の種類
            ctx.lineCap = AmidaCanvas.animationDefine.lineCap;
            
            // ライン始点
            ctx.moveTo(x, y);
            
            // Y軸に移動
            y = y + 1;
            ctx.lineTo(x, y);
            
            // 定義したパスを描画
            ctx.strokeStyle = AmidaCanvas.animationDefine.strokeStyle;
            ctx.lineWidth   = AmidaCanvas.animationDefine.lineWidth;
            ctx.stroke();
        }
        
        // 横棒群検索
        var searchHorizontalLines = function (object, horizontal_datas) {
            for (i = 0 ; i < horizontal_datas.length ; i++) {
                var point1 = horizontal_datas[i].start;
                var point2 = horizontal_datas[i].end;
                
                if (x == object.setPointX(point1.x) && y == object.setPointY(point1.y)) {
                    xDestination = point2;
                    return true;
                }
                if (x == object.setPointX(point2.x) && y == object.setPointY(point2.y)) {
                    xDestination = point1;
                    return true;
                }
            }
            
            return false;
        }
    }
}
