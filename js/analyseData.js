var map;
var json = {
  character: {
    classify: { 暴躁: "4", 温和: "2", 卖萌: "2" },
    description: "猕猴善于攀援跳跃，会游泳和模仿人的动作，有喜怒哀乐的表现。"
  },
  cartoon: ["齐天大圣", "image/logo.png"],
  name: "猕猴",
  coordinates: { w: 99, h: 198, y: 0, x: 80 },
  miracle: [
    {
      img: "image/bear_name1.png",
      content: "猴王的产生，是从众多优秀的雄猴中\u201c竞选\u201d而来。\n",
      title: "猴王命令无人背"
    },
    {
      img: "img/bear_name2.png",
      content: "猴王都是\u201c三宫六院，妻妾成群\u201d。\n",
      title: "猴王命令无人背"
    },
    {
      img: "img/bear_name3.png",
      content: "屁股没有毛而尾短，能立起来走。\n",
      title: "猴王命令无人背"
    }
  ],
  growth: ["img/bear_name1.png", "image/bear_name1.png", "img/bear_name3.png"],
  image: ["image/bear_name1.png", "image/bear_name2.png", "img/bear_name3.png"],
  danger: "低",
  introduction:
    "猕猴（学名：Macaca mulatta）：体长51-63厘米。是典型的猕猴属动物，主要特征是尾短，具颊囊。" +
    "躯体粗壮，平均体长约50厘米，它们的前肢与后肢大约同样长，拇指能与其它四指相对，抓握东西灵活，前额低，有一突起的棱" +
    "。头部呈棕色，背部棕灰或棕黄色，下部橙黄或橙红色，腹面淡灰黄色。\n栖息广泛，草原、沼泽各类森林。主要栖息在石山峭壁、" +
    "溪旁沟谷和江河岸边的密林中或疏林岩山上，群居。成十余只乃至数百只大群。以树叶、嫩枝、野菜等为食，也吃小鸟、鸟蛋、各种昆虫" +
    "，捕食其它小动物。相互之间联系时会发出各种声音或手势，互相之间梳毛也是一项重要社交活动。猕猴适应性强，容易驯养繁殖，" +
    "生理上与人类较接近，常被用于进行各种医学试验。乱捕滥猎是猕猴致危的主要因素。",
  food: [
    { name: "昆虫", img: "img/bear_name1.png", star: "3" },
    { name: "树叶", img: "image/bear_name1.png", star: "2" },
    { name: "小鸟", img: "img/bear_name3.png", star: "4" },
    { name: "嫩枝", img: "img/bear_name3.png", star: "5" }
  ],
  home: [
    { country: "阿富汗", Lon: "69.11", Lat: "34.28" },
    { country: "巴基斯坦", Lon: "73.10", Lat: "33.40" },
    { country: "印度", Lon: "77.13", Lat: "28.37" },
    { country: "中国", Lon: "116.20", Lat: "39.55" }
  ]
};
var characterContent = [];
characterStar = [];
//var analyseData = new AnalyseData(json);
//                	analyseData.analyseCharacter();
//                    analyseData.analyseFood();
//                    analyseData.analyseName();
//                    analyseData.analyseFeature();
//                    analyseData.analyseGrowth();
////                  analyseData.analysePosition();
//                    analyseData.analyseHome();
//                    analyseData.analyseCartoon();
function addMarker(point,mapPara) {
  // 创建图标对象
  var myIcon = new BMap.Icon("image/pin_red02.png", new BMap.Size(23, 25));
  // 创建标注对象并添加到地图
  var marker = new BMap.Marker(point, { icon: myIcon });
  mapPara.addOverlay(marker);
}
function AnalyseData(result) {
  this.analyseHome = function() {
    var country = result.home,
      countryHtml = "";
    $("#place_name").html(result.name.substring(result.name.length - 1));
    for (var i in country) {
      countryHtml +=
        '<label class="place-btn" data-index="' +
        i +
        '">' +
        country[i].country +
        "</label>";
    }
    $("#animal_home").append(countryHtml);
    $(".place-btn").click(function() {
      $(this).parent().find(".place-btn").removeClass("place-btn-selected");
      $(this).addClass("place-btn-selected");
      map = new BMap.Map("container"); // 创建地图实例
      var index = $(this).data("index");
      var point = new BMap.Point(country[index].Lon, country[index].Lat);
      map.centerAndZoom(point, 4);
      addMarker(point,map);
    });
  };
  this.analyseCartoon = function() {
    console.log(result.cartoon[1]);
    $("#animal_animate").attr("src", result.cartoon[1]);
  };
  this.analyseCharacter = function() {
    var character = result.character.classify;
    var characterHtml = "";
    var maxStarIndex = 0,
      maxStar = "";
    var sign = 0;
    for (var key in character) {
      sign++;
      if (sign > 4) {
        break;
      }
      characterHtml += "<div> <span>" + key + "</span>";
      if (character[key] > maxStarIndex) {
        maxStarIndex = parseInt(character[key]);
        maxStar = key;
      }
      for (var i = 0; i < character[key]; i++) {
        characterHtml += '<img src="image/character-04.png">';
      }
      characterHtml += "</div>";
      characterContent.push(key);
      characterStar.push(parseInt(character[key]) * 20);
    }
    $(".character-div").html(characterHtml);
    var name = result.name.substring(result.name.length - 1);
    $(".person_title").html("本" + name + "是" + maxStar + "的！");
    $("#person_pic").html("本" + name + "的性格分析图");
    $("#char_description").html(result.character.description);
    initRadar();
  };
  this.analyseFood = function() {
    var foodList = result.food,
      foodHtml = "";
    foodHtml +=
      '<div class="love_food"><p>本' +
      result.name.substring(result.name.length - 1) +
      "最爱吃</p></div>";
    for (var i in foodList) {
      foodHtml += '<div><div><img src="' + foodList[i].img + '" />';
      for (var k = 0; k < foodList[i].star; k++) {
        foodHtml += '<img src="image/love.png">';
      }
      foodHtml += "</div><p>" + foodList[i].name + "</p></div>";
    }
    $(".food_list").html(foodHtml);
  };
  this.analyseName = function() {
    var imgList = result.image;
    //初始化轮播
    var dotHtml = "";
    for (var i in imgList) {
      if (i == 0) {
        $("#name_section_img").css(
          "background",
          "url(" + imgList[i] + ") 0 0/100% 95% no-repeat"
        );
        dotHtml += '<li class="name-selected-dot" data-index="' + i + '"></li>';
      } else {
        dotHtml += '<li data-index="' + i + '"></li>';
      }
    }
    $("#name_dot_ul").html(dotHtml);
    $(".name #introductionContent").html(result.introduction);
    // $(".name .arrow").on('click', function () {
    // 	$(".name2 p").html(result.introduction);
    // 	INTRODUCTION =  $(".name2 p").text();
    //     $('.name2').slideDown('slow')
    // });
    $("#name").html(result.name);
    if (result.name.length > 3) {
      $("#name").css("font-size", "0.3rem");
    }
    $("b").html(result.name.substring(result.name.length - 1));
    switch (result.danger) {
      case "高":
        $(".name .describe").html("我的小伙伴越来越少了");
        break;
      case "中":
        $(".name .describe").html("我还有一些小伙伴");
        break;
      case "低":
        $(".name .describe").html("我还有很多小伙伴呢");
        break;
    }
    //自动轮播
    	var imgIndex = -1;
	    function autoPlay() {
	      imgIndex++;
	      if (imgIndex >= imgList.length) imgIndex -= imgList.length;
	      $("#name_section_img").css(
	        "background",
	        "url(" + imgList[imgIndex] + ") 0 0/100% 95% no-repeat"
	      );
	      $("#name_dot_ul li").removeClass("name-selected-dot");
	      $("#name_dot_ul li[data-index=" + imgIndex + "]").addClass(
	        "name-selected-dot"
	      );
	   }
   var timer=setInterval(autoPlay,5000);

    var startX, moveEndX, X;
    $("body").on("touchstart", "#name_frame", function(event) {
      //event.preventDefault();
      clearInterval(timer);
      startX = event.originalEvent.targetTouches[0].pageX;
    });
    $("body").on("touchend", "#name_frame", function(event) {
      //event.preventDefault();
      timer=setInterval(autoPlay,5000);
      moveEndX = event.originalEvent.changedTouches[0].pageX;
      X = moveEndX - startX;

      if (X < 0) {
        imgIndex++;
        if (imgIndex >= imgList.length) {
          imgIndex -= imgList.length;
        }
      } else if (X > 0) {
        imgIndex--;
        if (imgIndex < 0) {
          imgIndex += imgList.length;
        }
      }
      $("#name_section_img").css(
        "background",
        "url(" + imgList[imgIndex] + ") 0 0/100% 95% no-repeat"
      );
      $("#name_dot_ul li").removeClass("name-selected-dot");
      $("#name_dot_ul li[data-index=" + imgIndex + "]").addClass(
        "name-selected-dot"
      );
    });

    //点击轮播
    $("#name_dot_ul li").click(function() {
      imgIndex = $(this).data("index");
      $("#name_dot_ul li").removeClass("name-selected-dot");
      $(this).addClass("name-selected-dot");
      $("#name_section_img").css(
        "background",
        "url(" + imgList[imgIndex] + ") 0 0/100% 95% no-repeat"
      );
    });
  };
  this.analyseFeature = function() {
    var featureList = result.miracle,
      featureHtml = "";
    for (var i in featureList) {
      featureHtml +=
        "<div>" +
        "<h1>" +
        featureList[i].title +
        "</h1>" +
        '<div class="describe-wrapper wrapper1">' +
        '<p class="description-feature">' +
        featureList[i].content +
        "</p>" +
        "</div>" +
        "<div class='img_wrapper'>"+
        '<img class="img" src="' +
        featureList[i].img +
        '" />' +
        "</div>"+
        "</div>";
    }
    $(".feature-contain").html(featureHtml);
  };
  this.analyseGrowth = function() {
    var growthList = result.growth;
//  $("#grow_pic").css("background", "url(" + growthList[0] + ")");
		for(var i=0;i<growthList.length;i++){
			  var html=`
			  		<div class="swiper-slide">
			  		    <div style="background-image:url(${growthList[i]})"></div>	
			  		</div>
			  `;
		  $("#grow_pic .swiper-container .swiper-wrapper").append(html);
  	}
		var tabsSwiper = new Swiper('#grow_pic .swiper-container',{
    		//autoplay:1000,
//  		  loop:true,
	        speed:500,
          observer:true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents:true,//修改swiper的父元素时，自动初始化swiper
	        onInit:function(){
	           
	        }, 		
	        onSlideChangeStart: function(){
	            $(".a-btn-div").find(".grow-btn").removeClass("grow-btn-selected");
	            $(".a-btn-div").find(".grow-btn").eq(tabsSwiper.activeIndex).addClass("grow-btn-selected");
//	            $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active')  
	        }
    })
		$(".grow-btn").click(function() {
	      $(this).parent().find(".grow-btn").removeClass("grow-btn-selected");
	      $(this).addClass("grow-btn-selected");
	      var idx=$(this).index();
	      console.log(idx);
	      tabsSwiper.slideTo(idx,500);
    });
  };
  this.analysePosition = function() {
    var left = result.coordinates["x"],
      top = result.coordinates.y,
      width = result.coordinates.w,
      height = result.coordinates.h;

    var orginX = left + width / 2,
      orginY = top + height / 2,
      radius = Math.sqrt(width * width + height * height) / 2;
    if (orginX - radius < -$(window).width() * 0.07 || orginY - radius < 0) {
      var leftBtn = $(".right_btn_list .btn");
      leftBtn.addClass("right-none");
      for (var k = 0; k < leftBtn.length; k++) {
        leftBtn.eq(k).addClass("right" + (k + 1));
      }
    } else if (
      orginX + radius > $(window).width() ||
      orginY + radius > $(window).height()
    ) {
      var rightBtn = $(".right_btn_list .btn");
      rightBtn.addClass("left-none");
      for (var k = 0; k < rightBtn.length; k++) {
        rightBtn.eq(k).addClass("left" + (k + 1));
      }
    } else {
      var leftBtn = $(".right_btn_list .btn");
      leftBtn.addClass("right-none");
      var btn = $("#btn_list>.btn");
      for (var k = 0; k < btn.length; k++) {
        var deg = (k + 1) * 45 * Math.PI / 180;
        var btnLeft;
        if (Math.sin(deg) == 1) {
          btnLeft = orginX + radius * Math.sin(deg) - $(window).width() * 0.1;
        } else if (Math.sin(deg) > 0) {
          btnLeft = orginX + radius * Math.sin(deg) - $(window).width() * 0.05;
        } else {
          btnLeft = orginX + radius * Math.sin(deg);
        }
        var btnTop = orginY + radius * Math.cos(deg);
        btn.eq(k).css({
          left: btnLeft + "px",
          top: btnTop + "px"
        });
      }
      $("#btn_list>.btn").animate({ width: "20%" });
    }
  };
  this.analyseSound=function(){
  	 var animateSound=result.sound;
  	 console.log(animateSound);
  	 if(animateSound.length==1){
  	 		$("#animateSound").prop('src',animateSound[0]);
  	 		
  	 }
  	 
  	 return;
  }
}
