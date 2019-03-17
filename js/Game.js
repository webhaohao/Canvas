(function(){
// var json=
// [
//         {
//         "animalInfo": {
//             "animalid": 1,
//             "characterdescription": "随和、亲切、自然，胆小，很少出声。",
//             "creattime": "2018-05-24 13:38:06.0",
//             "dangerdescription": "低",
//             "introduction": "长颈鹿（学名：Giraffa camelopardalis）是一种生长在非洲的反刍偶蹄动物，拉丁文名字的意思是“长着豹纹的骆驼” 。它们是世界上现存最高的陆生动物。站立时由头至脚可达6-8米，体重约700千克，刚出生的幼仔就有1.5米高；皮毛颜色花纹有斑点和网纹型，头的额部宽，吻部较尖，耳大竖立，头顶有1对骨质短角，角外包覆皮肤和茸毛；颈特别长（约2米），颈背有1行鬃毛；体较短；四肢高而强健，前肢略长于后肢，蹄阔大；尾短小，尾端为黑色簇毛。牙齿为原始的低冠齿，不能以草为主食，只能以树叶为主食；舌较长，可以用于取食；具短角，角上被有毛的皮肤覆盖。",
//             "name": "长颈鹿",
//             "pic": "animal_image/Giraffe.png",
//             "picbottom": "bg/grasslandBottom.png",
//             "picmiddle": "bg/grasslandMiddle.png",
//             "pictop": "bg/grasslandTop.png",
//             "soundpath": "sound/1.mp3",
//             "zoolocation": "北京",
//             "zooname": "北京动物园"
//         },
//         "seal": {
//             "creattime": "2018-05-24 14:35:59.0",
//             "mapid": 1,
//             "name": "长颈鹿",
//             "path": "http://www.zooseefun.net/data/seal/giraffe.png",
//             "sealid": 1,
//             "x": "350",
//             "y": "350"
//         }
//     },
//     {
//         "animalInfo": {
//             "animalid": 1,
//             "characterdescription": "随和、亲切、自然，胆小，很少出声。",
//             "creattime": "2018-05-24 13:38:06.0",
//             "dangerdescription": "低",
//             "introduction": "长颈鹿（学名：Giraffa camelopardalis）是一种生长在非洲的反刍偶蹄动物，拉丁文名字的意思是“长着豹纹的骆驼” 。它们是世界上现存最高的陆生动物。站立时由头至脚可达6-8米，体重约700千克，刚出生的幼仔就有1.5米高；皮毛颜色花纹有斑点和网纹型，头的额部宽，吻部较尖，耳大竖立，头顶有1对骨质短角，角外包覆皮肤和茸毛；颈特别长（约2米），颈背有1行鬃毛；体较短；四肢高而强健，前肢略长于后肢，蹄阔大；尾短小，尾端为黑色簇毛。牙齿为原始的低冠齿，不能以草为主食，只能以树叶为主食；舌较长，可以用于取食；具短角，角上被有毛的皮肤覆盖。",
//             "name": "长颈鹿111",
//             "pic": "animal_image/Giraffe.png",
//             "picbottom": "bg/snowBottom.png",
//             "picmiddle": "bg/snowMiddle.png",
//             "pictop": "bg/snowTop.png",
//             "soundpath": "sound/1.mp3",
//             "zoolocation": "北京",
//             "zooname": "北京动物园"
//         }
//     }
// ]
//是否从“摇一摇”页面进入
if(GetQueryString("id")&&GetQueryString("zooid")){
    if(GetQueryString("flag")){
        $("header").css('display','none');
        $(".Navigation").css('display','none');
        $(".seefun.seefun_btn").css('display','none');
    }
   //alert("zooid"+GetQueryString("zooid"));
   $.ajax({
       url:"/Zoo/getAnimalInfoById?animalId="+GetQueryString("id")+"&zooid="+GetQueryString("zooid"),
       async:false,
       // data:{
       //     animalId:GetQueryString("id")
       // },
       success:function(data){
          // alert(JSON.stringify(data));
           sessionStorage.setItem('animalData',JSON.stringify(data));    
       },
       error:function(){
           alert("接口错误");
       }
   })
}
var animalData=JSON.parse(sessionStorage.getItem('animalData'));
if(animalData.length==1){
    $(".arrow").css('display','none');
}
//点击右箭头
var i=0;
$(".arrow .right-btn").on('touchstart',function(){
    if(i>=animalData.length-1)return false;
    i++;
    game.loadResource(
        animalData[i]
    )
})

//点击左箭头
$(".arrow .left-btn").on('touchstart',function(){
    if(i==0)return false;
    i--;
    game.loadResource(
        animalData[i]
    )
})
var Game=window.Game=function(){
          //得到画布
        this.myCanvas=document.getElementById("mycanvas");
          //设置上下文,也设置成为Game的属性
        this.ctx=this.myCanvas.getContext('2d');
        this.myCanvas.setAttribute('width',750);
        this.myCanvas.setAttribute('height',1334);
        this.myCanvas.style.width=document.documentElement.clientWidth+'px';
        this.myCanvas.style.height=document.documentElement.clientHeight+'px';
        this.currentIndex=4;
        this.endAngel=0;
        this.loadResource(
           animalData[0]
       )
       this.Start();
}
Game.prototype.Start=function(){
    this.Icon={
        "character" : "images/animate01.png",
        "food":"images/animate02.png",
        "wonderful":"images/animate03.png",
        "home":"images/animate04.png",
        "grow":"images/animate05.png",
        "story":"images/animate06.png"
    }
    var imagesAmount=Object.keys(this.Icon).length;
    var self=this;
    var c=0;
    for (var k in this.Icon){
        (function(k){
            var image=new Image();
            image.src=self.Icon[k];
            //监听图片加载完成
            image.onload=function(){
                c++;
                self.Icon[k]= this; 
                if(c==imagesAmount){
                    var disc=new Disc();
                    GetQueryString("flag")&&(disc.fillsc=true);
                    disc.loop();
                    //转盘的区域
                    var Part=6;
                    document.getElementById("myDisc").addEventListener("touchstart",touchStart,false);
                    document.getElementById("myDisc").addEventListener("touchmove",touchMove,false);
                    document.getElementById("myDisc").addEventListener("touchend",touchEnd,false);
                    var startPosition,endPosition,deltaX,deltaY,count=1; 
                    var analyseData=new AnalyseData();
                    analyseData.createModal();
                    // alert("开始加载数据");
                    function touchStart(event){
                     // debugger;
                        if(count>1){
                            if(disc.isAnimate) return;
                            disc.isShake=false;
                        }
                        else{
                            disc.isShake=true;
                            disc.loop();
                        }
                        count++;
                        var touch=event.touches[0];
                        startPosition={
                            x:touch.clientX,
                            y:touch.clientY
                        }
                    }
                
                    function touchMove(event){
                        //开始滑动取消抖动
                        disc.isShake=false;
                        event.preventDefault();
                        if(disc.isAnimate) return;
                        var touch=event.touches[0];
                        endPosition={
                            x:touch.clientX,
                            y:touch.clientY
                        }
                        console.log("x2:"+endPosition.x,"y2:"+endPosition.y);
                    }
                    function touchEnd(event){
                        if(disc.isAnimate) return;
                        deltaX=endPosition.x-startPosition.x;
                        deltaY=endPosition.y-startPosition.y;
                        console.log(deltaX,deltaY);
                        //求两点的距离
                        var handleStance=Math.round(Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,2)));
                        if(disc.angel<0){
                            var Remainder=Math.floor(disc.angel)%60;
                            //alert(Math.floor(disc.angel)%60);
                            Math.floor(disc.angel)%60<-30?disc.angel-=(60+Remainder):disc.angel-=Remainder;
                        }
                        else{
                            var Remainder=Math.round(disc.angel)%60;
                            Math.round(disc.angel)%60>30?disc.angel+=(60-Remainder):disc.angel-=Remainder;
                            //alert("当前旋转角度2:"+Math.round(disc.angel)%60);
                        }
                        //alert("余度"+Remainder);
                        console.log("计算后的角度"+disc.angel);
                        console.log("余度"+Remainder);
                        console.log("当前的index"+disc.index);
                        //用户手动转盘,disc.isPlay==true,清除定时器
                        //最小旋转的度数
                        var minAngle=60;
                        if(startPosition.y!=Math.abs(deltaY)){
                            console.log("滑动的距离"+handleStance);
                            if(deltaX>0){
                                if(handleStance>30&&handleStance<=100){
                                    directionAnimation(1,60,"down")
                                }
                                else if(handleStance>100&&handleStance<=200){
                                    directionAnimation(2,60,"down")
                                }
                                else if(handleStance>=200){
                                    directionAnimation(3,60,"down")
                                }
                                else{
                                    return;
                                }
                            }
                            else{
                                if(handleStance>30&&handleStance<=100){
                                    directionAnimation(1,60,"up")
                                }
                                else if(handleStance>100&&handleStance<=200){
                                    directionAnimation(2,60,"up")
                                }
                                else if(handleStance>=200){
                                    directionAnimation(3,60,"up")
                                }
                                else{
                                    return;
                                }
                            }
                            disc.isPlay=true;
                            disc.loop();
                            endPosition.x=startPosition.x=endPosition.y=startPosition.y=0;
                        }
                        return;    
                    }
                    function directionAnimation(i,minAngle,direction){
                        if(direction=='down'){
                            disc.easeAngle=disc.endAngle=disc.angel+minAngle*i;
                            if(disc.index-i>=0){
                                disc.index-=i;
                            }
                            else{
                                disc.index=Part+(disc.index-i);
                            } 
                        }
                        else{
                            disc.easeAngle=disc.endAngle=disc.angel-minAngle*i;
                            if(disc.index+i<=5){
                                disc.index+=i;
                            }
                            else{
                                disc.index=disc.index+i-Part;
                            }  
                        }
                        game.endAngel=disc.endAngle;
                        game.currentIndex=disc.index;
                        direction=='up'&&$("body .modal").eq(disc.index).removeClass('zoomOut').addClass('animated bounceInRight show').siblings('.modal').removeClass('animated bounceInRight show');
                        direction=='down'&&$("body .modal").eq(disc.index).removeClass('zoomOut').addClass('animated bounceInLeft show').siblings('.modal').removeClass('animated bounceInLeft show');
                        //alert("转盘开始转动");
                        analyseData.init(disc.index);
                    }   
                }    
            }
        })(k);
     }
    
    //计算反三角函数
    function Atan(x,y){
        //屏幕的宽高
        var ScreenW=document.documentElement.clientWidth,ScreenH=document.documentElement.clientHeight;
        //开始的坐标计算距离
        var a1=Math.abs(x-ScreenW/2);
        var b1=Math.abs(ScreenH-y);
        //通过a1,b1构建三角形,计算角度
        return Math.abs(Math.atan(b1/a1));
    }
}
Game.prototype.loadResource=function(info){
       var animalInfo=info.animalInfo;
       sessionStorage.setItem("animalId",animalInfo.animalid);
       sessionStorage.setItem("animalName",animalInfo.name);
        function splitStr(str){
            return str.split("/")[1].split("Bottom")[0];
        }
        var theme=splitStr(animalInfo.picbottom);
        //确定转盘的主题颜色
        switch(theme){
                case "grassland":
                    this.bgColor="#87b245";
                    this.shadowColor="#5c8234";
                    break;
                case "snow":
                    this.bgColor="#fff";
                    this.shadowColor="#f4ead9";
                    break;
                case "skey":
                    this.bgColor="#fff";
                    this.shadowColor="#f4ead9";
                    break;
        }
        this.R=
        {
            "bg_Bottom" : "http://www.zooseefun.net/data/"+animalInfo.picbottom,
            "bg_Middle" :"http://www.zooseefun.net/data/"+ animalInfo.picmiddle,
            "bg_Top":"http://www.zooseefun.net/data/"+animalInfo.pictop,
            "animalImg":"http://www.zooseefun.net/data/"+animalInfo.pic 
        }
            
        //现在要得到图片的总数
        var imagesAmount=Object.keys(this.R).length;
        var self= this;
        var count=0;
        for (var k in this.R){
            (function(k){
                console.log(self.R[k]);
                if(self.R[k].lastIndexOf(".png")==-1){
                    imagesAmount--;
                    return;
                }
                var image=new Image();
                image.src=self.R[k];
                //监听图片加载完成
                image.onload=function(){
                    count++;
                    self.R[k]= this; 
                    if(count==imagesAmount){
                       // callback.call(self);
                        this.sm=new SceneManager();
                        // alert(window.ClearRAF);
                        var dataForPage=new DataForPage(info);
                        dataForPage.init();
                    }    
                }
            })(k);
         }
    }
    window.RAF = (function(){
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||  window.oRequestAnimationFrame ||  window.msRequestAnimationFrame || function (callback) {window.setTimeout(callback, 1000 / 60); };
    })();
    window.ClearRAF=(function(){
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        ||!window.cancelAnimationFrame) {
                 return clearTimeout;
        }
        else{
              return  window.cancelAnimationFrame; 
        }
    })();
})();