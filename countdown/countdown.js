/*var WINDOW_WIDTH = 1824;
var WINDOW_HEIGHT = 838;*/
var WINDOW_WIDTH = 1250;
var WINDOW_HEIGHT = 700;

var RADIUS = 8;
var MARGIN_TOP = 100;
var MARGIN_LEFT = 140;

const endTime = new Date(2018,8,30,0,0,0);
var curShowTimeSeconds = 0

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

//背景普通星星
var starRot=8;
var starColorFlag=0;
var starColor=['yellow','lightPink','lime','Aqua','white'];
var stars=[];
var stars_num=200;

//流星
var shootStars=[];

//银河星星
var center_x=WINDOW_WIDTH/2;
var center_y=WINDOW_HEIGHT/2;
var rotateStars=[];
var rotateStars_num=700;

function drawPublicElements(cxt){
    //渐变色
    var skyBg=cxt.createRadialGradient(center_x,center_y,0,center_x,center_y,WINDOW_HEIGHT*0.75);
    skyBg.addColorStop(0.0,'MidnightBlue');
    skyBg.addColorStop(1.0,'black');
    cxt.fillStyle=skyBg;
    cxt.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    cxt.save();
    var fontWidth=400;
    var fontStyle='black';
    cxt.font='bold 60px cursive';
    cxt.shadowColor='gray';
    cxt.shadowOffsetX=10;
    cxt.shadowOffsetY=20;
    cxt.shadowBlur=4;
    cxt.strokeStyle=fontStyle;
    cxt.strokeText('距离惯例还剩下：',100,60,fontWidth);
    cxt.fillStyle='Lavender';
    cxt.fillText('距离惯例还剩下：',100,60,fontWidth);
    cxt.restore();

    //歌词
    cxt.save();
    cxt.fillStyle='white';
    cxt.fillText('夜空中明亮的醒 请照亮我前行：',50,WINDOW_HEIGHT-90,fontWidth);
    cxt.fillText('我祈祷拥有一颗透明的心灵 和会流泪的眼睛',50,WINDOW_HEIGHT-70,fontWidth);
    cxt.fillText('给我再去相信的勇气 越过谎言拥抱你',50,WINDOW_HEIGHT-50,fontWidth);
    cxt.restore();
}


function prepareStars(){
    for(var i=0;i<stars_num;i++){
        var aStar = {
            x:Math.round(Math.random()*WINDOW_WIDTH),
            y:Math.round(Math.random()*WINDOW_HEIGHT),
            r:Math.random()*1+1,
            vr:Math.random()*0.05+0.01,
            alpha:Math.random(),
            vx:Math.random()*0.2-0.1,
            vy:Math.random()*0.2-0.1
        };
        stars.push(aStar);
    }
}

function renderDynamicBg(cxt,context_static){
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    for(var i=0;i<stars_num;i++){
        //绘制闪烁星星
        var star=stars[i];
        cxt.beginPath();
        var bg=cxt.createRadialGradient(star.x,star.y,0,star.x,star.y,star.r);
        var colorData=context_static.getImageData(star.x,star.y,1,1);
        bg.addColorStop(0.0,'white');
        bg.addColorStop(1.0,'rgba('+colorData.data[0]+','+colorData.data[1]+','+colorData.data[2]+','+star.alpha+')');
        cxt.fillStyle=bg;
        cxt.arc(star.x,star.y,star.r,0,Math.PI*2,true);
        cxt.fill();
        cxt.closePath();
        if(i==Math.ceil(Math.random()*5000)){
            //准备流星
            tmp_tailLength=Math.random()*200+160;
            tmp_vx=Math.random()*10+5;
            tmp_rot=35;
            var aShootStar={
                x:Math.round(Math.random()*WINDOW_WIDTH),
                y:Math.round(Math.random()*WINDOW_HEIGHT/2),
                tailLength:tmp_tailLength,
                alpha:Math.random(),
                vx:tmp_vx,
                vy:tmp_vx/Math.tan(tmp_rot/180*Math.PI),
                rot:tmp_rot
            };
            shootStars.push(aShootStar);
        }
    }

    //绘制流星
    for(var i=0;i<shootStars.length;i++){
        var aShootStar=shootStars[i];
        var bg=cxt.createLinearGradient(aShootStar.x,aShootStar.y,
            aShootStar.x+aShootStar.tailLength*Math.sin(aShootStar.rot/180*Math.PI),
            aShootStar.y+aShootStar.tailLength*Math.cos(aShootStar.rot/180*Math.PI));
        bg.addColorStop(0.0,'rgba(255,255,255,0)');
        bg.addColorStop(1.0,'rgba(255,255,255,1)');
        cxt.lineWidth=1;
        cxt.lineCap='round';
        cxt.strokeStyle=bg;
        cxt.beginPath();
        cxt.moveTo(aShootStar.x,aShootStar.y);
        cxt.lineTo(aShootStar.x+aShootStar.tailLength*Math.sin(aShootStar.rot/180*Math.PI),
            aShootStar.y+aShootStar.tailLength*Math.cos(aShootStar.rot/180*Math.PI));
        cxt.stroke();
        cxt.fillStyle='rgba(255,255,255,1)';
        cxt.arc(aShootStar.x+aShootStar.tailLength*Math.sin(aShootStar.rot/180*Math.PI),
                aShootStar.y+aShootStar.tailLength*Math.cos(aShootStar.rot/180*Math.PI),
            1,0,2*Math.PI,true);
        cxt.fill();

    }

    //绘制银河星星
    for(var i=0;i<rotateStars.length;i++){
        var aRotateStar=rotateStars[i];
        var bg=cxt.createRadialGradient(aRotateStar.x,aRotateStar.y,0,aRotateStar.x,aRotateStar.y,aRotateStar.r);
        bg.addColorStop(0.0,'rgba(255,255,255,1)');
        bg.addColorStop(0.5,'rgba(24,24,210,'+aRotateStar.alpha+')');
        bg.addColorStop(1.0,'rgba(0,0,0,0.5)');
        cxt.fillStyle=bg;
        cxt.save();
        cxt.translate(center_x,center_y);
        cxt.rotate(20/180*Math.PI);
        cxt.beginPath();
        cxt.arc(aRotateStar.x,aRotateStar.y,aRotateStar.r,0,2*Math.PI,true);
        cxt.fill();
        cxt.restore();
    }
}


function updateDynamicBg(){
    //改变背景普通闪烁星星的增量
    for( var i = 0 ; i < stars.length ; i ++ ){

        stars[i].x += stars[i].vx;
        stars[i].y += stars[i].vy;
        stars[i].r += stars[i].vr;

        if( stars[i].x >= WINDOW_WIDTH ){
            stars[i].x = 1;
        }
        if( stars[i].x <= 0 ){
            stars[i].x = WINDOW_WIDTH-1;
        }
        if( stars[i].y >= WINDOW_HEIGHT ){
            stars[i].y = 1;
        }
        if( stars[i].y <= 0 ){
            stars[i].y = WINDOW_HEIGHT-1;
        }
        if( stars[i].r >= 3 ){
            stars[i].r = 3;
            stars[i].vr = -stars[i].vr;
        }
        if( stars[i].r <= 1 ){
            stars[i].r = 1;
            stars[i].vr = -stars[i].vr;
        }
    }

    //改变流星的增量
    var cnt = 0;
    for( var i = 0 ; i < shootStars.length ; i ++ ){
        shootStars[i].x += shootStars[i].vx;
        shootStars[i].y += shootStars[i].vy;
        if( shootStars[i].x > 0 && shootStars[i].x + shootStars[i].tailLength*Math.sin(tmp_rot/180*Math.PI) < WINDOW_WIDTH ){
            shootStars[cnt++] = shootStars[i];
        }
        while (shootStars.length > cnt){
            shootStars.pop();
        }
    }

    //改变银河星星的星星
    for( var i = 0 ; i < rotateStars.length ; i ++ ){
        rotateStars[i].angle += rotateStars[i].vangle;
        rotateStars[i].alpha += rotateStars[i].valpha;
        rotateStars[i].x = rotateStars[i].radiusX*Math.cos(rotateStars[i].angle);
        rotateStars[i].y = (rotateStars[i].radiusX-550)*Math.sin(rotateStars[i].angle);
        //rotateStars[i].r += rotateStars[i].vr;
        if( rotateStars[i].angle >= 2*Math.PI ){
            rotateStars[i].angle = 0;
        }
        if( rotateStars[i].alpha >= 1){
            rotateStars[i].alpha = 1;
            rotateStars[i].valpha = -rotateStars[i].valpha;
        }
        if( rotateStars[i].alpha <= 0 ){
            rotateStars[i].alpha = 0;
            rotateStars[i].valpha = -rotateStars[i].valpha;
        }

    }
    console.log(shootStars.length);
}

function prepareRotateStars(){
    for(var i=0;i<rotateStars_num;i++){
        var tmp_radiusX=Math.random()*170+550;
        var tmp_angle=Math.random()*2*Math.PI;
        var tmp_x=tmp_radiusX*Math.cos(tmp_angle);
        var tmp_y=(tmp_radiusX-540)*Math.sin(tmp_angle);
        var tmp_vangle=0;
        var tmp_r=1;
        if(tmp_radiusX>710 && tmp_radiusX<=750){
            tmp_vangle=0.04-Math.random()*0.039;
            tmp_r=Math.random()*4+4;
        }else if(tmp_radiusX>670 && tmp_radiusX<=710){
            tmp_vangle=0.014-Math.random()*0.012;
            tmp_r=Math.random()*2+3;
        }else if(tmp_radiusX>640 && tmp_radiusX<=670){
            tmp_vangle=0.012-Math.random()*0.010;
            tmp_r=Math.random()*2+3;
        }else if(tmp_radiusX>600 && tmp_radiusX<=640){
            tmp_vangle=0.008-Math.random()*0.005;
            tmp_r=Math.random()*2+2;
        }else if(tmp_radiusX>570 && tmp_radiusX<=600){
            tmp_vangle=0.004-Math.random()*0.003;
            tmp_r=Math.random()*1+2;
        }else{
            tmp_vangle=0.001-Math.random()*0.002;
            tmp_r=Math.random()*1+1;
        }
        tmp_vangle=tmp_vangle/3;
        var aRotateStar = {
            x:tmp_x,
            y:tmp_y,
            radiusX:tmp_radiusX,//椭圆轨迹的长半径
            radiusY:tmp_radiusX-450,//椭圆轨迹的短半径
            r:tmp_r,
            vr:Math.random()*0.1+0.05,
            alpha:Math.random()*0.6+0.4,//星星渐变色的透明度
            valpha:Math.random()*0.1-0.2,
            angle:tmp_angle,//旋转小星载椭圆轨迹上的夹角
            vangle:tmp_vangle
        };
        rotateStars.push(aRotateStar);
    }
}



window.onload = function(){
    //先准备静态背景--背景色和各个文字
    var canvas_static = document.getElementById('canvas_static');
    canvas_static.width=WINDOW_WIDTH;
    canvas_static.height=WINDOW_HEIGHT;
    if(canvas_static.getContext('2d')){
        var context_static = canvas_static.getContext('2d');
    }else {
        alert('当前浏览器不支持canvas，请使用chrome');
    }

    //再准备动态背景--闪烁星星+银河
    var canvas_dynamic = document.getElementById('canvas_dynamic');
    canvas_dynamic.width=WINDOW_WIDTH;
    canvas_dynamic.height=WINDOW_HEIGHT;
    if(canvas_dynamic.getContext('2d')){
        var context_dynamic = canvas_dynamic.getContext('2d');
    }else {
        alert('当前浏览器不支持canvas，请使用chrome');
    }


    //后画内容
    var canvas = document.getElementById('canvas');
    canvas.width=WINDOW_WIDTH;
    canvas.height=WINDOW_HEIGHT;
    if(canvas.getContext('2d')){
        var context = canvas.getContext('2d');
    }else {
        alert('当前浏览器不支持canvas，请使用chrome');
    }


    //展示静态背景
    drawPublicElements(context_static);




/*
    var timer_id=requestAnimationFrame(function fn(){
        addPointsArr(context);
        render(context);
        update(context);
        timer_id=requestAnimationFrame(fn);
    });*/

    //展示动态背景--闪烁星星+银河
    prepareStars();
    prepareRotateStars();
    var timer_id_1=requestAnimationFrame(function fn_1(){
        renderDynamicBg( context_dynamic,context_static );
        updateDynamicBg();
        timer_id_1=requestAnimationFrame(fn_1);
    });




    //展示内容
    curShowTimeSeconds = getCurrentShowTimeSeconds();
    var timer_id_2=requestAnimationFrame(function fn_2(){
        render( context );
        update();
        timer_id_2=requestAnimationFrame(fn_2);
    });
    var timer_id_3=requestAnimationFrame(function fn_3(){
        starRot++;
        starColorFlag++;
        if(starRot==7){
            starRot=0;
        }
        if(starColorFlag==starColor.length){
            starColorFlag=0;
        }
    });

/*    ------------这里注释掉的是setInterval方法实现的代码
    //展示动态背景--闪烁星星+银河
    prepareStars();
    prepareRotateStars();
    setInterval(
    function(){
        renderDynamicBg( context_dynamic,context_static );
        updateDynamicBg();
    }
    ,
    30
    );
    //展示内容
    curShowTimeSeconds = getCurrentShowTimeSeconds();
    setInterval(
        function(){
            render( context );
            update();
        }
        ,
        50
    );
    setInterval(
        function(){
            starRot++;
            starColorFlag++;
            if(starRot==7){
                starRot=0;
            }
            if(starColorFlag==starColor.length){
                starColorFlag=0;
            }
        }
        ,
        1000
    );*/
};

function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round( ret/1000 );

    return ret >= 0 ? ret : 0;
}

function update(){

    var nextShowTimeSeconds = getCurrentShowTimeSeconds();
//alert(nextShowTimeSeconds);alert(curShowTimeSeconds)
    var nextDays = parseInt( nextShowTimeSeconds / 86400);
    var nextHours = parseInt( (nextShowTimeSeconds-nextDays*86400) / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds-nextDays*86400 - nextHours * 3600)/60 );
    var nextSeconds = nextShowTimeSeconds % 60;

    var curDays = parseInt( curShowTimeSeconds / 86400);
    var curHours = parseInt( ( curShowTimeSeconds- curDays*86400 ) / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curDays*86400- curHours * 3600)/60 );
    var curSeconds = curShowTimeSeconds % 60;

    if( nextSeconds != curSeconds ){
        if( parseInt(curDays/10) != parseInt(nextDays/10) ){
            addBalls( MARGIN_LEFT + 20*(RADIUS+1) , MARGIN_TOP+2*(RADIUS+1) , parseInt(curDays/10) );
        }
        if( parseInt(curDays%10) != parseInt(nextDays%10) ){
            addBalls( MARGIN_LEFT + 35*(RADIUS+1)  , MARGIN_TOP+2*(RADIUS+1) , parseInt(curDays%10) );
        }
        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(curHours%10) );
        }
        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(nextSeconds%10) );
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();

    //console.log( balls.length)
}

function updateBalls(){

    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }

    var cnt = 0
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )
            balls[cnt++] = balls[i];

    while( balls.length > cnt ){
        balls.pop();
    }
}


function render( cxt ){

    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);

    var days = parseInt( curShowTimeSeconds / 86400);
    var hours = parseInt( (curShowTimeSeconds - days*86400) / 3600);
    var minutes = parseInt( (curShowTimeSeconds - days*86400 - hours * 3600)/60 );
    var seconds = curShowTimeSeconds % 60;

    renderDigit( MARGIN_LEFT + 20*(RADIUS+1) , MARGIN_TOP+2*(RADIUS+1) , parseInt(days/10) , cxt )
    renderDigit( MARGIN_LEFT + 35*(RADIUS+1) , MARGIN_TOP+2*(RADIUS+1) , parseInt(days%10) , cxt )
    renderDigit( MARGIN_LEFT + 59*(RADIUS + 1) , MARGIN_TOP , 11 , cxt )

    renderDigit( MARGIN_LEFT , MARGIN_TOP+28*(RADIUS+1) , parseInt(hours/10) , cxt )
    renderDigit( MARGIN_LEFT + 15*(RADIUS + 1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(hours%10) , cxt )
    renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP+28*(RADIUS+1) , 10 , cxt )
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(minutes/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP+28*(RADIUS+1) , parseInt(seconds%10) , cxt);

    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();

        cxt.fill();
    }
}


//画一个星星
function drawStar(cxt,r,R,x,y,rot){
    //rot = 0;
    cxt.beginPath();
    for(var i=0;i<5;i++){
        cxt.lineTo(
            Math.cos((18+i*72-rot)/180*Math.PI)*R+x,
            -Math.sin((18+i*72-rot)/180*Math.PI)*R+y
        );
        cxt.lineTo(
            Math.cos((54+i*72-rot)/180*Math.PI)*r+x,
            -Math.sin((54+i*72-rot)/180*Math.PI)*r+y
        );
    }
    cxt.closePath();
    cxt.stroke();
}

//绘制单个数字
function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = starColor[starColorFlag];

    for( var i = 0 ; i < digit[num].length ; i ++ ){
        for(var j = 0 ; j < digit[num][i].length ; j ++ ){
            if( digit[num][i][j] == 1 ){
                cxt.beginPath();
                //cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
                drawStar(cxt,RADIUS-4,RADIUS,x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),45*starRot);
                cxt.closePath();
                cxt.fill()
            }
        }
    }
}


function addBalls( x , y , num ){
    for( var i = 0  ; i < digit[num].length ; i ++ ){
        for( var j = 0  ; j < digit[num][i].length ; j ++ ){
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 3,
                    vy:-27,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                };
                balls.push( aBall );
            }
        }
    }
}