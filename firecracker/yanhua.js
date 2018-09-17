var WINDOW_WIDTH = screen.width;
var WINDOW_HEIGHT = screen.height;

var points=[];
var points1=[];
var points1Num=300;
var tmp_num=100;


window.onload = function(){
    //先准备静态背景
    var canvas_static = document.getElementById('canvas_static');
    canvas_static.width=WINDOW_WIDTH;
    canvas_static.height=WINDOW_HEIGHT;
    if(canvas_static.getContext('2d')){
        var context_static = canvas_static.getContext('2d');
    }else {
        alert('当前浏览器不支持canvas，请使用chrome');
    }

    //展示静态背景
    drawPublicElements(context_static);

    //再准备动态背景
    var canvas = document.getElementById('canvas');
    canvas.width=WINDOW_WIDTH;
    canvas.height=WINDOW_HEIGHT;
    if(canvas.getContext('2d')){
        var context = canvas.getContext('2d');
    }else {
        alert('当前浏览器不支持canvas，请使用chrome');
    }

    var timer_id=requestAnimationFrame(function fn(){
        addPointsArr(context);
        render(context);
        update(context);
        timer_id=requestAnimationFrame(fn);
    });
};

var RADIUS=1.5;


function render( cxt ){

    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
    drawInitPoints(cxt);
    drawInitPoints1(cxt);
}


function drawPublicElements(cxt){
    cxt.fillStyle='black';
    cxt.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
}

function addPointsArr(cxt){
    tmp_num++;
    if(tmp_num>80){
        var aPoint = {
            x:WINDOW_WIDTH/2,
            y:WINDOW_HEIGHT-RADIUS,
            g:0.08+0.01*Math.random(),
            vx:Math.random()*8-4,
            vy:-8-4*Math.random(),
            num:Math.floor(Math.random()*8+4)
        };
        points.push(aPoint);
        tmp_num=0;
    }
    //console.log(tmp_num);
}

function drawInitPoints(cxt){
    for(var i=0;i<points.length;i++){
        var aPoint=points[i];

        //绘制一组小球
        var tmp_pc=1;
        var tmp_x=aPoint.x;
        var tmp_y=aPoint.y;
        var tmp_vy=aPoint.vy;
        for(var j=1;j<=aPoint.num;j++){
            cxt.save();
            cxt.lineWidth=3;
            cxt.beginPath();
            cxt.moveTo(tmp_x,tmp_y);
            var start_x=tmp_x;
            var start_y=tmp_y;
            var start_pc=tmp_pc;
            tmp_pc=start_pc-start_pc/aPoint.num;
            tmp_x=tmp_x-aPoint.vx;
            tmp_y=tmp_y-tmp_vy;
            tmp_vy=tmp_vy-aPoint.g;
            cxt.lineTo(tmp_x,tmp_y);
            var bg=cxt.createLinearGradient(start_x,start_y,tmp_x,tmp_y);
            bg.addColorStop(0,'rgba(255,255,255,'+start_pc+')');
            bg.addColorStop(1,'rgba(255,255,255,'+tmp_pc+')');
            cxt.strokeStyle=bg;
            cxt.lineCap='round';
            cxt.lineJoin='miter';
            cxt.stroke();
            cxt.restore();
        }
    }
}

function update(){
    //更新point
    for( var i = 0 ; i < points.length ; i ++ ){

        points[i].x += points[i].vx;
        points[i].y += points[i].vy;
        points[i].vy += points[i].g;
    }

    var cnt = 0;
    for( var i = 0 ; i < points.length ; i ++ ){
        if( points[i].vy<2-4*Math.random()){
            points[cnt++] = points[i];
        }else {
            addPoints1Arr(points[i]);
        }
    }

    while( points.length > cnt ){
        points.pop();
    }

    //更新point1
    for( var i = 0 ; i < points1.length ; i ++ ) {
        for (var j = 0; j < points1[i].length; j++) {
            points1[i][j].x += points1[i][j].vx;
            points1[i][j].y += points1[i][j].vy;
            points1[i][j].vy += points1[i][j].g;
        }
    }

    cnt = 0;
    for( var i = 0 ; i < points1.length ; i ++ ){
        if( getColorPer(i,0)!=0){
            points1[cnt++] = points1[i];
        }
    }
    while( points1.length > cnt ){
        points1.pop();
    }
}


function addPoints1Arr(cen_pot){
    var tmp_points1=[];
    var tmp_r=Math.floor(Math.random()*256);
    var tmp_g=Math.floor(Math.random()*256);
    var tmp_b=Math.floor(Math.random()*256);
    var tmp_color='rgba('+tmp_r+','+tmp_g+','+tmp_b+',1)';
    var tmp_vy=0;
    for(var i=0;i<points1Num;i++){
        var tmp_angle=2*Math.PI*Math.random();
        var tmp_v=9-18*Math.random();//物理：每个爆炸瞬间，小粒子实际速度的任意方向上速度是一样的
        tmp_v*Math.sin(tmp_angle)<0?tmp_vy=tmp_v*Math.sin(tmp_angle):tmp_vy=tmp_v*Math.sin(tmp_angle)+cen_pot.vy;
        var aPoint_1 = {
            x:cen_pot.x,
            y:cen_pot.y,
            g:0.1+0.1*Math.random(),
            vx:tmp_v*Math.cos(tmp_angle),
            vy:tmp_vy,
            pointsNum:15-5*Math.floor(Math.random()),
            color:tmp_color
        };
        tmp_points1.push(aPoint_1);
    }
    points1.push(tmp_points1);
    console.log('points1:'+points1.length)
}

function drawInitPoints1(cxt) {
    //console.log(points1.length)
    for (var i = 0; i < points1.length; i++) {
        cxt.save();
        for (var j = 0; j < points1[i].length; j++) {
            var aPoint_1 = points1[i][j];
            var tmp_x = aPoint_1.x;
            var tmp_y = aPoint_1.y;
            var tmp_vy = aPoint_1.vy;
            cxt.fillStyle = aPoint_1.color;
            cxt.beginPath();
            for (var k = 1; k <= points1[i][j].pointsNum; k++) {
                cxt.arc(tmp_x, tmp_y, 1.5, 0, 2 * Math.PI);
                tmp_x = tmp_x - aPoint_1.vx;
                tmp_y = tmp_y - tmp_vy;
                tmp_vy = tmp_vy - aPoint_1.g;
            }
            cxt.closePath();
            cxt.fill();
            changeColorPer(i, j);
        }
        cxt.restore();
    }
}



function changeColorPer(i,j) {
    var tmp=points1[i][j].color;
    var douhao=tmp.lastIndexOf(',');
    var kuohu=tmp.lastIndexOf(')');
    var front=tmp.substring(0,douhao);
    var per=tmp.substring(douhao+1,kuohu);
    per=per-0.02;
    if(per<0){
        per=0;
    }
    points1[i][j].color=front+','+per+')';
}



function getColorPer(i,j){
    var tmp=points1[i][j].color;
    var douhao=tmp.lastIndexOf(',');
    var kuohu=tmp.lastIndexOf(')');
    var per=tmp.substring(douhao+1,kuohu);
    return per;
}

