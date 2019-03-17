  // 等待所有加载
$(window).on('load',function(){
    $('body').addClass('loaded');
    $('#loader-wrapper .load_title').remove();
}); 
$(function(){
    // window.ontouchstart = function(e) { e.preventDefault()};
    //polyfill，zepto，detect，event，ajax，form，fx
    $("body").on('tap','.modal .volume',function(){
        $(this).addClass('active');
         var index=$(this).parent().parent().parent('.modal').index();
         var string=$.trim($("body .modal").eq(index).text());
         //alert(string);
        // alert("调取语音接口")
         baiduStringVoice(string);
    })
    document.getElementById('animalIntrSound').onended=function(){
            $(".volume").removeClass('active');
    }
    //baiduStringVoice("北京");
    //调用百度语音接口
    function baiduStringVoice(string){
        $.ajax({
            url:'/Zoo/getaccess',
            type:'GET',
            dataType:'json',
            async:false, 
            success:function(result){
                // alert("开始播放");
                // alert(result);
                 var uri="https://tsn.baidu.com/text2audio?tex="+encodeURI(string)+"&lan=zh&per=4&cuid="+sessionStorage.getItem('wxUserInfo')+"&ctp=1&tok="+result.data;
                console.log(uri);
                 $("#animalIntrSound").prop("src",uri);
                 document.getElementById("animalIntrSound").play();
            },
            error:function(xhr,errorType,error){
                alert("error接口调取失败"+errorType);
            }
        })
    } 
    //点击关闭模态框
    $('body').on('tap','.modal .close',function(){
       
       $(this).parent().parent().parent('.modal').addClass('animated zoomOut');
       document.getElementById("animalIntrSound").pause();
        setTimeout(function(){
            var disc=new Disc();
            disc.isPlay=false;
            disc.index=game.currentIndex;
            disc.angel=disc.endAngle=disc.easeAngle=game.endAngel;
            // console.log(disc.angel);
            disc.loop();
        },100)   
    });

    //点击播放动物声音
    $(".sound").on('tap',function(){
        //调用动物叫声
        $(this).addClass('widthChange');
        document.getElementById('animateSound').play();   
    })
    document.getElementById('animateSound').onended=function(){
        $(".sound").removeClass('widthChange');
   }
   
    //点击动物印章,获取动物印章
    $(".seal").on('tap',function(){
        $(this).off('tap');
        $self=$(this);
        $.ajax({
            url:'/Zoo/addUserSeal',
            type:'POST',
            data:{
                // userid:window.sessionStorage.getItem("wxUserInfo"),
                sealid:window.sessionStorage.getItem("sealId")
            },
            success:function(){
                $self.removeClass('animated bounce infinite').addClass('seal_animate');
                $("#seal_btn").addClass('cart-basket-animate active'); 
                var animalData=JSON.parse(sessionStorage.getItem('animalData'));
                animalData.forEach(item => {
                        if(item.seal&&item.seal.sealid==window.sessionStorage.getItem("sealId")){
                            delete item.seal;
                        }
                });
                //delete animalData.seal;
                sessionStorage.setItem('animalData',JSON.stringify(animalData));
                setTimeout(function() {
                    $self.css('display','none');
                }, 3000);  
            },
            error:function(){

            }
        })
    })
    $("body").on('tap','.place-btn',function() {
        $(this).parent().find(".place-btn").removeClass("place-btn-selected");
        $(this).addClass("place-btn-selected");
        map = new BMap.Map(container); // 创建地图实例
        var index = $(this).data("index");
        //console.log(country[index].Lon);
        var point = new BMap.Point(index.split(",")[0], index.split(",")[1]);
        map.centerAndZoom(point, 4);
        addMarker(point,map);
    });
    function addMarker(point,mapPara) {
        // 创建图标对象
        var myIcon = new BMap.Icon("images/pin_red02.png", new BMap.Size(23, 25));
        // 创建标注对象并添加到地图
        var marker = new BMap.Marker(point, { icon: myIcon });
        mapPara.addOverlay(marker);
    }
    //微信语音识别
    $("body").on('longTap',function(e){
        e.preventDefault();
        $(".voice-container").fadeIn('fast');
    })
    $("#voice_closer,.voice-container").on("touchstart", function(event) {
        event.preventDefault();
        $(".voice-container").fadeOut("fast");
        $(".voice-finger,.point-voice-tip").css("display", "block");
    });
    $(".voice-load").on("touchstart", function(event) {
        event.stopPropagation();
        event.preventDefault();
        if(!localStorage.rainAllowRecord || localStorage.rainAllowRecord !== 'true')
            { 
                wx.startRecord({ success: function(){ localStorage.rainAllowRecord = 'true'; 
                //wx.stopRecord();
            },     
                cancel: function () { 
                    //alert('用户拒绝授权录音'); 
            }
         }); 
        }
        else{
            wx.startRecord();
            $("#voice_ing,.voice-tell,.voice-tip-div,.voice-animate").removeClass("display-none");
            $("#point_tell").addClass("display-none");
            $(".voice-load").attr("src","images/microphone.png");
        }
    });
    $(".voice-load").on("touchend", function() {
        //alert("开始语音识别！");
        $("#voice_ing,.voice-tell,.voice-tip-div,.voice-animate").addClass("display-none");
        $("#point_tell").removeClass("display-none");
        $(".voice-load").attr("src","images/voice_orange.png");
        wx.stopRecord({
            success: function(res) {
                var localId = res.localId.toString();
                wx.translateVoice({
                    localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function(res) {
                        //alert(res.translateResult); // 语音识别的结果
                        var info=[
                            {
                                title:0,
                                keywords:['性格','你的性格','格']
                            },
                            {
                               title:1,
                               keywords:['爱吃啥','吃','喝'] 
                            },
                            {
                               title:2,
                               keywords:['奇葩点','奇葩'] 
                            },
                            {
                                title:3,
                                keywords:['住','住哪','住哪儿']
                            },
                            {
                                title:4,
                                keywords:['成长','成长历程']
                            },
                            {
                                title:5,
                                keywords:['我的故事','故事']
                            },
                            {
                                title:6,
                                keywords:['叫什么','你的名字']
                            }
                        ]
                        var sign = 0;
                        info.every((item,index)=>{
                            item.keywords.every((i)=>{
                               // alert(i);
                                if (res.translateResult.indexOf(i) != -1) {
                                    if(index==6){
                                        //调用百度语音接口
                                        baiduStringVoice($(".AnimalName").text());
                                    }
                                    else{
                                        var disc=new Disc();
                                        var idx=game.currentIndex-index;
                                        // alert(idx);
                                        disc.easeAngle=disc.endAngle=disc.angel+60*idx;
                                        disc.index=index;
                                        disc.isPlay=true;
                                        disc.loop();
                                        var analyseData=new AnalyseData();
                                        analyseData.init(disc.index);
                                        $("body .modal").eq(index).removeClass('zoomOut').addClass('animated bounceInRight show').siblings('.modal').removeClass('animated bounceInRight show');
                                        $(".voice-container").fadeOut("fast");
                                        //$(".voice-finger,.point-voice-tip").css("display", "block");
                                    }
                                    sign = 1;
                                    return false;
                                }  
                            })
                            if(sign==0){
                                return true;
                            }
                            else{
                                return false;
                            }
                           
                        })   
                        if (sign == 0) {
                            alert("请重试");
                        }
                    },
                    error: function(res) {
                        alert("请大声一点");
                    }
                });
            },
            fail: function(res) {
                //alert(JSON.stringify(res));
            }
        });
    });
    //点击"我的"显示侧边栏
    var $body=$('body');
    var $screen=$('.screen');
    var $nav=$('.nav');
    $(".nav").on('touchstart','.nav-left',function(event){
        event.preventDefault();
        event.stopPropagation();
        $nav.toggleClass('nav-open');
        if (!$nav.hasClass('nav-open')) {
            $('.aside').animate({left:"-5.15rem"});
            $screen.animate({right:'0%'})
            $body.css("overflow","visible");
        }
        else {
            $('.aside').animate({left:"0"});
            $screen.animate({right:'-5.15rem'})
            $body.css("overflow","hidden");
            //调用获取用户信息
            getUserInfo();
            getUserLevelAll();
        }   
    })
    $screen.on('touchstart', function () {
        //alert("body");
        if(!$nav.hasClass('nav-open'))return;
        $nav.removeClass('nav-open');
        $('.aside').animate({left:"-5.15rem"});
        $screen.animate({right:'0%'})
        $body.css("overflow","visible");
    });
    //获取用户信息
    function getUserInfo(){
        $.ajax({
            url:'/Zoo/getUserInfo',
            success:function(data){
                $(".aside .userImg img").attr('src',data.pic);
                $(".aside .userName span").eq(0).html(data.name);
            },
            error:function(){
                console.log("获取用户信息失败");
            }
        })
    }
    //获取用户等级
    function getUserLevelAll(){
        $.ajax({
            url:'/Zoo/getUserLevelAll',
            success:function(data){
                console.log(data);
                $(".aside .userName span").eq(1).html(`<img src="${BASEURL+data.path}" />`);
            },
            error:function(){
                console.log("获取用户等级失败");
            }
        })
    }
})  
function getAnimalData(url,callBack,params){
    new Promise(function(resolve,reject){
        $.ajax({
            type:'GET',
            url:url,
            data:params,
            success:function(data){
                // alert(JSON.stringify(data));
                resolve(data);
            }
        })
    }).then(function(data){
        callBack&&callBack.call(AnalyseData,data);
    })
}
//获取动物的信息
function AnalyseData(result){
    this.ModalName=['性格','爱吃啥','奇葩点','住哪','成长历程','我的故事'];
    this.createModal=function(){
        //初始化父元素
        $('body .modal-wrap').empty();
        // alert($('body .modal-wrap').html());
        for(var i=0;i<this.ModalName.length;i++){
             var modal=$("<div />",{
                   class:'modal'
             }) 
         modal.attr('data-type',this.ModalName[i]);
         $('body .modal-wrap ').append(modal);
         if(modal.attr('data-type')=='成长历程'){
            var html=`
                <div class="modal-bg"></div>
                <div class="modal-dialog">
                    <div class="modal-header">
                        <a href="javascript:;" class="close">
                            <img src="images/close.png" alt="">
                        </a>
                    </div>
                    <div class="modal-content">
                    </div>
                </div>
            `;
         }
         else{
            var html=`
            <div class="modal-bg"></div>
            <div class="modal-dialog">
                <div class="modal-header">
                    <a href="javascript:;" class="close">
                        <img src="images/close.png" alt="">
                    </a>
                    <a href="javascript:;" class="volume">
                        <img src="images/volume.png" alt="">
                    </a>
                </div>
                <div class="modal-content">
                </div>
            </div>
        `;
         }
         modal.append(html);
        }
    }
    this.init=function(index){
        $('body .modal').find('.modal-content').empty();
        // if(this.data[index].status){
        //     return false;
        // }
        // this.data[index].status=true;
        this.data[index].params.animalName=sessionStorage.getItem('animalName');
        // alert(sessionStorage.getItem('animalName'))
        //alert(JSON.stringify(this.data));
        getAnimalData(this.data[index].url,this.data[index].method,this.data[index].params);
    }
    //住哪
    this.analyseHome = function(data) {
        var country = data,countryHtml = "";
         var HomeTitle=$('<div />',{
              class:'HomeTitle'
          });
        
         var html=`
            <p class="place_title">本</p>
            <p class="place_title" id="place_name">${getAnimalNameClass()}</p>
            <p class="place_title">住</p>
            <p class="place_title">在</p>
          `;
         HomeTitle.append(html);  
         $('body .modal').eq(3).find('.modal-content').append(HomeTitle); 
         var mapFrame=$('<div />',{
             class:'mapFrame'
         });
         var btnDiv=$('<div />',{
              class:'btn-div'
         })
         for (var i in country) {
            countryHtml +=
                '<label class="place-btn" data-index="' +
                country[i].lon+","+country[i].lat +
                '">' +
                country[i].country +
                "</label>";
        }
        btnDiv.append(countryHtml);
        $('body .modal').eq(3).find('.modal-content').append(mapFrame); 
        $('body .modal').eq(3).find('.modal-content').append(btnDiv); 
        var container=$('<div />',{
            id:'container'
        })
        mapFrame.append(container);   
    }; 
      //奇葩点
    this.analyseFeature=function(data){
        var featureList = data,featureHtml = "";
        var featureTitle=$("<div />",{
            class:'featureTitle'
        })
        var html=`
            <p class="place_title">奇</p>
            <p class="place_title">葩</p>
            <p class="place_title">点</p>
        `;
        featureTitle.append(html);  
        $('body .modal').eq(2).find('.modal-content').append(featureTitle); 
        var featureContain=$('<div />',{
            class:'feature-contain'
        })
        for (var i in featureList) {
          featureHtml +=
            `<div>
                <h1>
                    <p>
                        ${featureList[i].title} 
                    </p>
                </h1>
                <div class="describe-wrapper wrapper1">
                    <p class="description-feature">
                        ${featureList[i].content} 
                    </p>
                </div>
                <div class='img_wrapper'>
                    <img class="img" src="${'http://www.zooseefun.net/data/'+featureList[i].pic}" />
                </div>
             </div>`;
        }
        console.log(featureHtml);
        featureContain.html(featureHtml);
        $('body .modal').eq(2).find('.modal-content').append(featureContain);  
    }
    //成长历程
    this.analyseGrowth = function(data) {
        var growthList=data;
        var grow=$('<div />',{
            class:'grow'
        })
        var html=`
            <div class="growTitle">
                <p>成</p>
                <p>长</p>
                <p>历</p>
                <p>程</p>
            </div>
        `;
        grow.append(html);
        var Swipercontainer=$('<div />',{
            class:'swiper-container'
        })
        grow.append(Swipercontainer);
        Swipercontainer.append('<div class="swiper-wrapper"></div>');
        for(var i=0;i<growthList.length;i++){
             var html=`
                          <div class="swiper-slide">
                              <div style="background-image:url(${'http://www.zooseefun.net/data/'+growthList[i].pic})"></div>	
                          </div>
                  `;
              console.log(html);
              console.log($('.grow'));    
             grow.find('.swiper-wrapper').append(html);
        }
        var temlate=`
          <div class="a-btn-div">
                <label class="grow-btn grow-btn-selected">幼年</label>
                <label class="grow-btn">成年</label>
                <label class="grow-btn">老年</label>
          </div>
        `;
         grow.append(temlate);
        $('body .modal').eq(4).find('.modal-content').append(grow);  
        //当swiper-container动态生成,swiper必须在load事件,才可以生效
        tabsSwiper = new Swiper('.swiper-container',{
            //autoplay:1000,
            //loop:true,
            speed:500,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
            onInit:function(){
                console.log("swiper jia zai");     
            }, 		
            onSlideChangeStart: function(){
                $(".a-btn-div").find(".grow-btn").removeClass("grow-btn-selected");
                $(".a-btn-div").find(".grow-btn").eq(tabsSwiper.activeIndex).addClass("grow-btn-selected");
        //	            $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active')  
            }  
        })
        $("body").on('tap','.modal .grow-btn',function() {
            $(this).parent().find(".grow-btn").removeClass("grow-btn-selected");
            $(this).addClass("grow-btn-selected");
            var idx=$(this).index();
            console.log(idx);
            tabsSwiper.slideTo(idx,500);
        });
    };

      //性格
      this.analyseCharacter = function(data) {
        var characterContent = [],characterStar = [];  
        var character = data.classify;
        var characterHtml = "";
        var maxStarIndex = 0,
        maxStar = "";
        var sign = 0;
        var characterDiv=$('<div />',{
            class:'character-div'
        })
        for (var key in character) {
          console.log(key);
          characterHtml += "<div> <span>" + character[key].classify + "</span>";
          if (character[key].scores > maxStarIndex) {
            maxStarIndex = parseInt(character[key].scores);
            maxStar = character[key].classify;
          }
          for (var i = 0; i < character[key].scores; i++) {
            characterHtml += '<img src="images/character-04.png">';
          }
          characterHtml += "</div>";
          characterContent.push(character[key].classify);
          characterStar.push(parseInt(character[key].scores) * 20);
        }
        characterDiv.append(characterHtml);
        var charContent=$('<div />',{
            class:'char_content'
        })
        var html=`<div class="person_title">
                 本${getAnimalNameClass()}是${maxStar}的！
        </div>`;
        charContent.append(html);
        var describrWrapper=$('<div />',{
            class:'describe-wrap'
        })
        var html=`
             <p class="description-p">${data.description}</p>
        `;
        var describrWrapper02=$('<div />',{
            class:'describe-wrap describe-wrapTitle'
        })
        var titleText=`
            <p class="description-p">本${getAnimalNameClass()}的性格分析图 <span style="display:none">如下:<span></p>
        `;
        describrWrapper02.append(titleText);
        describrWrapper.append(html);
        charContent.append(describrWrapper);
        charContent.append(characterDiv); 
        charContent.append(describrWrapper02);
        $(".person_title").html("本" + getAnimalNameClass() + "是" + maxStar + "的！");
        $(".description-p").html(data.description);
        console.log()
        var radar_chart=$("<div />",{
            id:"radar_chart"
       })
       radar_chart.css('height','5rem');
       radar_chart.css('width','5.3rem');
       console.log(characterContent);
       console.log(characterStar);
       charContent.append(radar_chart);
    //    id=document.getElementById("radar_chart");
       //console.log(id);
       $("body .modal").eq(0).find('.modal-content').append(charContent);
         //开始绘制性格图
         var id=radar_chart.get(0);
         console.log(id);
         console.log(id.style.height);
         initRadar(id,characterContent,characterStar);
      };
      //爱吃啥
      this.analyseFood = function(data) {
            var foodList=data;
            var foodContent=$('<div />',{
                class:'foodContent '
            })
            var foodHtml = "";
            var loveFood=$("<div />",{
                    class:'loveFood'
            })
            var html=`
                <p class="place_title">本</p>
                <p class="place_title">${getAnimalNameClass()}</p>
                <p class="place_title">爱</p>
                <p class="place_title">吃</p>
            `;
            loveFood.append(html);
            $('body .modal').eq(1).find('.modal-content').append(loveFood); 
            // foodHtml +=
            // '<div class="love_food"><p>本' +
            // result.name.substring(result.name.length - 1) +
            // "最爱吃</p></div>";
            foodHtml+='<div class="item clearfix">'
            for (var i in foodList) {
            foodHtml += '<div class="itemList"><div class="loveFoodImg"><img src="http://www.zooseefun.net/data/'+ foodList[i].pic + '"/></div><div class="grade">';
            for (var k = 0; k < foodList[i].star; k++) {
                foodHtml += '<img src="images/love.png">';
            }
            foodHtml += "<p>" + foodList[i].food + "</p></div></div>";
            }
            foodHtml+='</div>'
            console.log(foodHtml);
            foodContent.append(foodHtml);
         $("body .modal").eq(1).find('.modal-content').append(foodContent);
      };
      //我的故事
      this.analyseStory=function(data){
                var storyList=data;
                var story=$('<div />',{
                    class:'story'
                })
                var html=`
                    <div class="growTitle">
                        <p>我</p>
                        <p>的</p>
                        <p>故</p>
                        <p>事</p>
                    </div>
                `;
                story.append(html);
                var Swipercontainer=$('<div />',{
                    class:'swiper-container'
                })
                story.append(Swipercontainer);
                Swipercontainer.append('<div class="swiper-wrapper"></div>');
                for(var i=0;i<storyList.path.length;i++){
                    var html=`
                                <div class="swiper-slide">
                                        <div style="background-image:url(${'http://www.zooseefun.net/data/'+storyList.path[i]})"></div>
                                </div>
                        `;
                    console.log(html);
                    story.find('.swiper-wrapper').append(html);
                }
                var temlate=`
                    <p class="story_des">${storyList.Text}</p>
              `;
              story.append(temlate);
              $('body .modal').eq(5).find('.modal-content').append(story);  
              new Swiper('.swiper-container',{
                autoplay:3000,
                loop:true,
                speed:500,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
                onInit:function(){
                    console.log("swiper jia zai");     
                }
            })
      }
      this.data=[
        {
           url:'/Zoo/getClassify',
           method:this.analyseCharacter,
           params:{
                animalName:sessionStorage.getItem('animalName')
           },
           status:false
        },
        {
            url:'/Zoo/getFood',
            method:this.analyseFood,
            params:{
                animalName:sessionStorage.getItem('animalName')
            },
            status:false
         }, 
         {
            url:'/Zoo/getMiracle',
            method:this.analyseFeature,
            params:{
                animalName:sessionStorage.getItem('animalName')
            },
            status:false
         },
         {
            url:'/Zoo/getHome',
            method:this.analyseHome,
            params:{
                animalName:sessionStorage.getItem('animalName')
            },
            status:false
         },
         {
            url:'/Zoo/getGrowth',
            method:this.analyseGrowth,
            params:{
                animalName:sessionStorage.getItem('animalName')
            },
            status:false
         },
         {
            url:'/Zoo/getStory',
            method:this.analyseStory,
            params:{
                animalName:sessionStorage.getItem('animalName'),
                zooId:sessionStorage.getItem('zooid')||GetQueryString("zooid")
            },
            status:false
         }
    ]
}

//获取页面信息
function DataForPage(result){
    this.init=function(){
        // alert("加载页面信息");
        this.analyseSound();
        this.analyseAnimalSeal();
        this.analyseName();
    }
    this.analyseSound=function(){
        var animateSound="http://www.zooseefun.net/data/"+result.animalInfo.soundpath;
        $("#animateSound").prop('src',animateSound);       
     }
     this.analyseAnimalSeal=function(){
        if(!result.seal){
            //alert("没有加载印章");
            $(".seal img").remove();
            return;
        }
        else{
            //$(".seal").html('src',result.seal.path);
            //alert("加载印章") 
            $(".seal").html(`<img src=${result.seal.path}>`);
            window.sessionStorage.setItem("sealId",result.seal.sealid); 
        }
        
     }
     this.analyseName=function(){
       // alert(result.animalInfo.name);
        $(".AnimalName span").html(result.animalInfo.name);
        var temp='';
        var len=result.animalInfo.name.length;
        var pyStr=result.pinyin.split("-");
        for(var i=0;i<len;i++){
             temp+=`${result.animalInfo.name.substr(i,1)}<rp>(</rp><rt>${pyStr[i]}</rt><rp>)</rp>`;
        }
        $(".AnimalName-2 span ruby").html(temp);
    }
}
//获取动物名称中的类
function getAnimalNameClass(){
    var animalName=sessionStorage.getItem("animalName");
    return animalName.substring(animalName.length - 1);
}