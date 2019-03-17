(function(){
    var Disc=window.Disc=function(){
        this.myCanvas=document.getElementById("myDisc");
        //设置上下文,也设置成为Game的属性
        this.ctx=this.myCanvas.getContext('2d');
        this.sumPercent=document.documentElement.clientWidth/750;
        this.myCanvas.setAttribute('width',520);
        this.myCanvas.setAttribute('height',520);
        this.myCanvas.style.width=520*this.sumPercent+'px';
        this.myCanvas.style.height=520*this.sumPercent+'px';
        //主题颜色
        console.log(game.bgColor);
        this.bgColor=game.bgColor;
        //是否绘制小圆
        this.fillsc=false;
        //阴影颜色
        this.shadowColor=game.shadowColor;
        //变化的角度,默认为60deg
        this.easeAngle=0;
        //转盘转动后结束的角度,默认0
        this.endAngle=0;
        //转盘开始转动的角度,默认为0度
        this.angel=0;
        //是否手动滑动转盘
        this.isPlay=false;
        //是否转盘抖动
        this.isShake=false;
        //抖动的角度
        this.shakeAngel=0;
        this.lock=false;
        //判断转盘是否在转动中
        this.isAnimate=false;
        //当前位置(默认为4);
        this.index=4;
        //转盘上区域对应的标签信息
        this.imgPanel=[game.Icon["character"],game.Icon["food"],game.Icon["wonderful"],game.Icon["home"],game.Icon["grow"],game.Icon["story"]];
        this.Text=['性格','爱吃啥','奇葩点','住哪','成长历程','我的故事'];
        this.useCache=true;
        //字体
        this.fontFamily="微软雅黑";
         //转动速度
        this.speed=0.1;
        //正常的转盘信息
        this.discInfo01={
            radius:470/2,
            fontColor:"#f2e299",
            fontSize:24,
            fillColor:"#e6ba4c",
            strokeColor:this.bgColor,
            lineWidth:10,
            isClip:false
        };
        //转盘上图片所在圆大小
        this.ImgCircular01={
            x:0,
            y:0,
            radius:380/2
        }
        //转盘上的文字所在的圆大小    
        this.smccircle01= {
            x:0,
            y:0,
            radius:280/2
        }


        //选中状态下的圆信息
        this.discInfo02={
            radius:510/2,
            fontColor:"#a66445",
            fontSize:32,
            fillColor:"#f7d56a",
            strokeColor:"#f7d56a",
            lineWidth:10,
            isClip:true
        }
        this.ImgCircular02={
            x:0,
            y:0,
            radius:420/2
        }
         //转盘上的文字所在的圆大小    
         this.smccircle02= {
            x:0,
            y:0,
            radius:300/2
        }

    //   this.loop();
    }
    Disc.prototype.loop=function(){
        var _self=this;
        console.log("变化的角度"+this.easeAngle);
        console.log("当前旋转角度"+this.angel);
        console.log("结束的角度"+this.endAngle);
        this.timer=RAF(function(){
            this.loop();
        }.bind(this))
        this.ctx.clearRect(0,0,this.myCanvas.width,this.myCanvas.height);
        if(this.isShake){
           this.shakePlay();
        }
        else{
           this.StartRotate();
        }
     }
    Disc.prototype.StartRotate=function(){
        this.isAnimate=true;
        var _this=this;
        this.ctx.save();
        this.ctx.translate(this.myCanvas.width/2,this.myCanvas.height/2);
        var RotateAngle=math.eval((this.easeAngle-this.angel)*this.speed);
        this.angel+=RotateAngle;
        this.ctx.rotate(this.rads(this.angel));
        //绘制背景圆
        this.bgCircleRender(510/2,this.bgColor,this.shadowColor,true);
        this.Point(this.discInfo01,this.ImgCircular01,this.smccircle01,this.imgPanel);
        this.updatePoint(this.isPlay);
        this.bgCircleRender(210/2,this.bgColor,this.shadowColor,true); 
        this.fillsc &&  this.bgCircleRender(110/2,"#e6ba4c",this.shadowColor,true); 
        this.ctx.restore();   
        if(Math.abs(this.endAngle-this.angel)<0.1){
            console.log("清除定时器");
            this.isAnimate=false;
            window.ClearRAF(_this.timer);
        }
    } 
    Disc.prototype.Point=function(discInfo,ImgCircular,smccircle,imgPanel,status){
        var startAngle=0;
        var endAngle=0;
        var r1=ImgCircular.radius;
        for(var i=0;i<imgPanel.length&&endAngle<360;i++){
            startAngle=60*i;
            endAngle=startAngle+60; 
            //绘制扇形 
            this.ctx.beginPath();
            this.ctx.arc(0,0,discInfo.radius,this.rads(startAngle),this.rads(endAngle),false);
            this.ctx.lineTo(0,0);
            this.ctx.fillStyle=discInfo.fillColor;
            this.ctx.strokeStyle=discInfo.strokeColor;
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.lineWidth=discInfo.lineWidth;
            this.ctx.stroke();
            //绘制转盘上的小图标 
            this.ctx.save();
            var  newEndAngle=60/2+startAngle;
            var  imgWidth=this.imgPanel[i].width;
            var  imgHeight=this.imgPanel[i].height;
            var  RotateAngle=120+startAngle;
            this.ctx.translate(r1*Math.cos(this.rads(newEndAngle)),r1*Math.sin(this.rads(newEndAngle)));
            this.ctx.rotate(this.rads(RotateAngle));
            this.ctx.drawImage(this.imgPanel[i],-imgWidth/2,-imgHeight/2,imgWidth,imgHeight);
            this.ctx.restore();
            //绘制转盘上文字
            this.ctx.fillStyle =discInfo.fontColor;
            this.ctx.font =discInfo.fontSize+"px "+this.fontFamily;
            this.ctx.textAlign ="center";
            this.ctx.textBaseline = 'middle';
            var string =this.Text[i];
            var radius =smccircle.radius,index = 0,character;
            if(string.length<=2){
                var angle1=Number(this.rads(60*(i+1)-40));
                var angle2 =Number(this.rads(60*(i+1)-20));
            }
            else{
                var angle1=Number(this.rads(60*(i+1)-50));
                var angle2 =Number(this.rads(60*(i+1)-10));
            }
            var angleDecrement=Number(((angle1- angle2)/(string.length-1)).toFixed(2));
            //console.log(angleDecrement);
            this.ctx.save();
            while (index < string.length) {
                character = string.charAt(index);
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.translate(smccircle.x + Math.cos(angle1) * radius,smccircle.y + Math.sin(angle1) * radius);
                this.ctx.rotate(3.14/2 + angle1);
                this.ctx.fillText(character, 0, 0);
                angle1=Number((angle1-angleDecrement).toFixed(2));
                index++;
                this.ctx.restore();
            }
            this.ctx.restore();
        }
    } 
    Disc.prototype.updatePoint=function(isPlay){
        if(!isPlay){
            return;
        }
        var discInfo=this.discInfo02;
        var r1=this.ImgCircular02.radius;
        var smccircle=this.smccircle02;
        var imgPanel=this.imgPanel;
        var startAngle=0;
        var endAngle=0;
        this.ctx.save();
        this.ctx.rotate(-this.rads(this.angel));
        this.ctx.beginPath();
        this.ctx.arc(0,0,discInfo.radius,this.rads(240),this.rads(300),false);
        this.ctx.lineTo(0,0);
        this.ctx.fillStyle=discInfo.fillColor;
        this.ctx.strokeStyle=discInfo.strokeColor;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.lineWidth=discInfo.lineWidth;
        this.ctx.stroke();
        this.ctx.restore();
        for(var i=0;i<imgPanel.length&&endAngle<360;i++){
                startAngle=60*i;
                endAngle=startAngle+60; 
                //绘制扇形 
                this.ctx.beginPath();
                //console.log(i);
                //console.log(this.angel);
                if(i===this.index){
                    this.ctx.globalAlpha=1;
                }
                else{
                    this.ctx.globalAlpha=0;
                }
                //绘制转盘上的小图标 
                this.ctx.save();
                // 调节透明度
                var  newEndAngle=60/2+startAngle;
                var  imgWidth=this.imgPanel[i].width;
                var  imgHeight=this.imgPanel[i].height;
                var  RotateAngle=120+startAngle;
                this.ctx.translate(r1*Math.cos(this.rads(newEndAngle)),r1*Math.sin(this.rads(newEndAngle)));
                this.ctx.rotate(this.rads(RotateAngle));
                this.ctx.drawImage(this.imgPanel[i],-imgWidth/2,-imgHeight/2,imgWidth,imgHeight);
                this.ctx.restore();
                //绘制转盘上文字
                this.ctx.fillStyle =discInfo.fontColor;
                this.ctx.font =discInfo.fontSize+"px "+this.fontFamily;
                this.ctx.textAlign ="center";
                this.ctx.textBaseline = 'middle';
                var string =this.Text[i];
                var radius =smccircle.radius,index = 0,character;
                if(string.length<=2){
                    var angle1=Number(this.rads(60*(i+1)-40));
                    var angle2 =Number(this.rads(60*(i+1)-20));
                }
                else{
                    var angle1=Number(this.rads(60*(i+1)-50));
                    var angle2 =Number(this.rads(60*(i+1)-10));
                }
                var angleDecrement=Number(((angle1- angle2)/(string.length-1)).toFixed(2));
                //console.log(angleDecrement);
                this.ctx.save();
                while (index < string.length) {
                    character = string.charAt(index);
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.translate(smccircle.x + Math.cos(angle1) * radius,smccircle.y + Math.sin(angle1) * radius);
                    this.ctx.rotate(3.14/2 + angle1);
                    this.ctx.fillText(character, 0, 0);
                    angle1=Number((angle1-angleDecrement).toFixed(2));
                    index++;
                    this.ctx.restore();
                }
                this.ctx.restore();
                //this.index++;
         }
        
    }        
    //绘制背景圆
    Disc.prototype.bgCircleRender=function(r,fillColor,shadowColor,isShadowColor){
         this.ctx.globalAlpha=1;  
         this.ctx.beginPath();       
         this.ctx.arc(0,0,r,0,Math.PI*2,true);
         this.ctx.closePath();
         if(isShadowColor){
            this.ctx.shadowBlur=8;
            this.ctx.shadowColor=shadowColor;
        }
         this.ctx.fillStyle=fillColor;
         this.ctx.fill();
         this.ctx.shadowBlur=0;
    }
    //转盘的抖动动画效果
    Disc.prototype.shakePlay=function(){
        var _this=this;
        var i=2;
        this.ctx.save();
        this.ctx.translate(this.myCanvas.width/2,this.myCanvas.height/2);
        this.lock==false&&(this.shakeAngel+=i);
        this.lock==true&&(this.shakeAngel-=i);
        if(this.shakeAngel>10){
            this.lock=true;
        }
        if(this.shakeAngel<=-10){
            this.lock=false;
        }
        if(this.shakeAngel+i==2&&this.lock==false){
            console.log("清除定时器");
            console.log(this.shakeAngel);
            window.ClearRAF(_this.timer);
        }
        //console.log(this.shakeAngel);
        this.ctx.rotate(this.rads(this.shakeAngel));
        //绘制背景圆
        this.bgCircleRender(510/2,this.bgColor,this.shadowColor,true);
        this.Point(this.discInfo01,this.ImgCircular01,this.smccircle01,this.imgPanel);
        this.updatePoint(this.isPlay);
        this.bgCircleRender(210/2,this.bgColor,this.shadowColor,true);  
        this.ctx.restore();   
    }
    //当转盘转到指定位置更新状态
    Disc.prototype.updateStatus=function(angel){
       // console.log(this.angel);
        // if(this.angel>=240&&this.angel<=300){
        
        // }
    }
   //离屏缓存
    Disc.prototype.cache=function(discInfo,ImgCircular,smccircle,imgPanel){ 
        console.log("离屏缓存");
        // console.log(arguments.length);
        var startAngle=0;
        var endAngle=0;
        var r1=ImgCircular.radius;
        for(var i=0;i<imgPanel.length&&endAngle<360;i++){
            startAngle=60*i;
            endAngle=startAngle+60; 
            console.log(endAngle);
            //绘制扇形 
            this.cacheCtx.beginPath();
            this.cacheCtx.arc(0,0,discInfo.radius,this.rads(startAngle),this.rads(endAngle),false);
            this.cacheCtx.lineTo(0,0);
            this.cacheCtx.fillStyle=discInfo.fillColor;
            this.cacheCtx.strokeStyle=discInfo.strokeColor;
            this.cacheCtx.fill();
            this.cacheCtx.closePath();
            this.cacheCtx.lineWidth=discInfo.lineWidth;
            this.cacheCtx.stroke();
            //绘制转盘上的小图标 
            this.cacheCtx.save();
            var  newEndAngle=60/2+startAngle;
            var  imgWidth=this.imgPanel[i].width;
            var  imgHeight=this.imgPanel[i].height;
            var  RotateAngle=120+startAngle;
            this.cacheCtx.translate(r1*Math.cos(this.rads(newEndAngle)),r1*Math.sin(this.rads(newEndAngle)));
            this.cacheCtx.rotate(this.rads(RotateAngle));
            this.cacheCtx.drawImage(this.imgPanel[i],-imgWidth/2,-imgHeight/2,imgWidth,imgHeight);
            this.cacheCtx.restore();
            //绘制转盘上文字
            this.cacheCtx.fillStyle =discInfo.fontColor;
            this.cacheCtx.font =discInfo.fontSize+"px "+this.fontFamily;
            this.cacheCtx.textAlign ="center";
            this.cacheCtx.textBaseline = 'middle';
            var string =this.Text[i].name;
            var radius =smccircle.radius,index = 0,character;
            var angle1=Number(this.Text[i].angel1);
            var angle2 =Number(this.Text[i].angel2);
            var angleDecrement=Number(((angle1- angle2)/(string.length-1)).toFixed(2));
            console.log(angle1);
            //console.log(angleDecrement);
            this.cacheCtx.save();
            while (index < string.length) {
                character = string.charAt(index);
                this.cacheCtx.save();
                this.cacheCtx.beginPath();
                this.cacheCtx.translate(smccircle.x + Math.cos(angle1) * radius,smccircle.y + Math.sin(angle1) * radius);
                this.cacheCtx.rotate(3.14/2 + angle1);
                this.cacheCtx.fillText(character, 0, 0);
                angle1=Number((angle1-angleDecrement).toFixed(2));
                index++;
                this.cacheCtx.restore();
            }
            this.cacheCtx.restore();
        }
    }
    //转化弧度
    Disc.prototype.rads=function(x){
        return Number((math.pi*x/180).toFixed(5));
    }
})();