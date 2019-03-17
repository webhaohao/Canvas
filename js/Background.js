(function(){
    var background=window.Background=function(){
        //alert("开始绘制");
        this.image=game.R['bg_Bottom'];
        this.image02=game.R['bg_Middle'];
        this.image03=game.R['bg_Top'];
        console.log(this.image02);
        this.AnimalImg=game.R['animalImg'];
        this.init();
    }
    //设置画布的宽度和高度   
    Background.prototype.init =function (){
        this.width=750;
        this.height=1334;
        this.x=0;
        this.y=0;
        this.render();
    }   
    Background.prototype.render=function(){
        drawBg(this.x,this.y,this.image);
        drawBg((game.myCanvas.width-this.AnimalImg.width)/2,414,this.AnimalImg);
        drawBg((game.myCanvas.width-this.image02.width)/2,805,this.image02);
        drawBg((game.myCanvas.width-this.image03.width)/2,game.myCanvas.height-this.image03.height,this.image03);
    }
    function drawBg(x,y,imgObj){
        if(typeof imgObj =="string")return;
        game.ctx.drawImage(imgObj,x,y,imgObj.width,imgObj.height);
    }
})();