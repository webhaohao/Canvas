var map=new BMap.Map('container');
var AnimalData=allAnimalLoactionData();
var allAnimalInfo=allAnimalLoactionInMap(AnimalData);
var myPoint;
sessionStorage.setItem('isFadeIn','false');
getLocation();
setInterval(getLocation,5000);
function getLocation(){
	wx.ready(function(){
		wx.getLocation({
			type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success: function (res) {
				try {
					var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					var speed = res.speed; // 速度，以米/每秒计
					var accuracy = res.accuracy; // 位置精度
					// alert(lat);
					// alert(lng);
					//alert(JsonUti.convertToString(res));
					//wx.openLocation({
					//    latitude: res.latitude, // 纬度，浮点数，范围为90 ~ -90
					//    longitude: res.longitude, // 经度，浮点数，范围为180 ~ -180。
					//    name: '当前位置', // 位置名
					//    address: '点击查看', // 地址详情说明
					//    scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
					//    infoUrl: "location1.aspx?m=Home&c=Index&a=getlocation&latitude="+latitude+"&longitude="+longitude // 在查看位置界面底部显示的超链接,可点击跳转
					//});
					//alert(latitude+"-"+longitude);
					// var point=new BMap.Point(lng,lat);
					// var mk=new BMap.Marker(point);
					// map.centerAndZoom(point,18);
					// map.addOverlay(mk);
					getBaiduPosition(res).then(function(config){
						//alert(JSON.stringify(config));
						var point=new BMap.Point(config.lng,config.lat);
						var mk=new BMap.Marker(point);
						map.centerAndZoom(point,18);
						AllanimalDistance(allAnimalInfo,point);
						// var currentInfo={};
						// currentInfo.lng=GetQueryString("lng");
						// currentInfo.lat=GetQueryString("lat");
						// WalkLine(point,currentInfo);
						map.addOverlay(mk);
						setTimeout(function(){
							map.removeOverlay(mk);
						},5000)
						
					})
				} catch (e) {
					alert(e.message);
				}
			}
		})
	})
}
//百度定位
//setInterval(getLoaction,3000);
//getLoaction();
function getLoaction(){
	//var point = new BMap.Point(116.331398,39.897445);
	 setInterval(function(){
		var geolocation = new BMap.Geolocation();
		// 开启SDK辅助定位
		geolocation.enableSDKLocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				// var myIcon = new BMap.Icon("./image/myPoint.png", new BMap.Size(25,25),{
				// 	anchor: new BMap.Size(10,20)//这句表示图片相对于所加的点的位置
				// });
				// var mk = new BMap.Marker(r.point,{icon:myIcon});
				var mk=new BMap.Marker(r.point);
				map.centerAndZoom(r.point,15);
			    map.addOverlay(mk);              // 将标注添加到地图
				//console.log(AnimalData);
				//  AllanimalDistance(allAnimalInfo,r.point);
				// var currentInfo={};
				// currentInfo.lng=GetQueryString("lng");
				// currentInfo.lat=GetQueryString("lat");
				// if(currentInfo.lng&&currentInfo.lat){
				// $(".start_navigation").css('display','block');
				// }
				// WalkLine(r.point,currentInfo);
				// myPoint=r.point;
				//alert('您的位置：'+r.point.lng+','+r.point.lat);
			}
			else {
				alert('failed'+this.getStatus());
			} 
		},{
			maximumAge:0
		}
		)
	},3000)	
	 //console.log(objList);  
} 
$(".getLocation_btn").on('tap',function(){
	       moveMap(myPoint.lng,myPoint.lat);  
})
$(".tip-close").on('touchstart',function(){
	$(".tip").fadeOut();
	sessionStorage.setItem('isFadeIn',"false");
})
/**********获取所有点距离我的位置*****************/
function AllanimalDistance(allAnimalInfo,config){	
	$.each(allAnimalInfo,function(idx,obj){
//		   	   var Arr=obj.point.split(',');
//		   	   var lng=Arr[0];
//		   	   var lat=Arr[1];
//		       var point=new BMap.Point(lng,lat);
//	           var marker = new BMap.Marker(point);  // 创建标注
               //初始化调用计算距离函数
               console.log(config);
		       distance(allAnimalInfo[idx],config);
//		       markerArr.push(marker);
//		       console.log(markerArr);
   })
}
function distance(AnimalInfo,config){
	   console.log(AnimalInfo);
	   var marker=AnimalInfo.marker;
	   var point=AnimalInfo.marker.getPosition();
	   var pointA = config;
	   console.log(pointA,point);
	   var num=map.getDistance(pointA,point);
	    if(num<=50){
		   $.ajax({
			   url:'/Zoo/getLocation?groupid='+AnimalInfo.id,
			   type:'GET',
			   dataType:'json',
			   success:function(data){
				   //alert(JSON.stringify(data));
				   if(sessionStorage.getItem('isFadeIn')=='false'){
						$(".tip").fadeIn();
				   }
				   console.log(data);
					var len=AnimalInfo.info.length;
					var html="";
					for(var i=0;i<len;i++){
						 html+=`
						    <span>${AnimalInfo.info.substr(i,1)}</span>
						 `;
					}
					$(".tip-title").html(html);
					var temp='';
					var temp2='';
				    for(var j=0;j<data.length;j++){
						if(j<=2){
							if(j==0){
								temp=`
								<a href="http://www.zooseefun.net/Zoo/seefun.html?id=${data[j].animalid}&zooid=${window.sessionStorage.getItem("zooid")}">
										<img src="http://www.zooseefun.net/data/${data[j].path}" alt="">
										<span>${data[j].animalname}</span>
								   </a>
								`;
								$('.tip-content .tip-row').eq(0).find('.item').eq(0).html(temp);
								temp="";
							}
							if(j==1||j==2){
								temp+=`
									<div class="item-slider">
									<a href="http://www.zooseefun.net/Zoo/seefun.html?id=${data[j].animalid}&zooid=${window.sessionStorage.getItem("zooid")}">
											<img src="http://www.zooseefun.net/data/${data[j].path}" alt="">
											<span>${data[j].animalname}</span>
										</a>
									</div>
								`;		
							}
							$('.tip-content .tip-row').eq(0).find('.item').eq(1).html(temp);
						}
						if(j>2){
							temp2+=`
								<div class="item">
									<a href="http://www.zooseefun.net/Zoo/seefun.html?id=${data[j].animalid}&zooid=${window.sessionStorage.getItem("zooid")}">
										<img src="http://www.zooseefun.net/data/${data[j].path}" alt="">
										<span>${data[j].animalname}</span>	
									</a>	
								</div>`;
							$('.tip-content .tip-row').eq(1).html(temp2);
						}
						
					}
					sessionStorage.setItem('isFadeIn',"true");
					//alert(temp);
			   }
		   })
      }	 
	   var dis=num>1000?(num/1000).toFixed(2)+'千米':num.toFixed(2)+'米';
	   var sContent =
	   `<div class='map_model clear'>
		   <div class='map_content'>
		   <img src="${AnimalInfo.image}" class='imgDemo'>
			   <div class='clear animateInfo'>
				   <h4>${AnimalInfo.info}</h4> 
				   <p><i class='navigation_btn'></i><span>${dis}</span></p>
			   </div>
		    </div>
		   <p class='b_menu'><a href='javascript:;' class='all_view'>全景</a><a class='go_here' data-lat='${point.lat}' data-lng='${point.lng}'>到这去</a></p>
	    </div>`;
	   var infoWindow=new BMap.InfoWindow(sContent);
	   infoWindow.addEventListener('open',function(type, target, point){ //窗口打开是，隐藏自带的关闭按钮
				$('.BMap_pop>img').hide();
				$(".go_here").on('click',function(){
					// var config=$(this).data('config');
					var lng=$(this).data('lng');
					var lat=$(this).data('lat');
					WalkLine(config,lng,lat);
				})
	   })
	  
	   //标注增加点击事件
	    marker.onclick=function(){
	        //var p = e.target;
			console.log(this);	        
			this.openInfoWindow(infoWindow);	        
			document.getElementsByClassName('imgDemo').onload = function (){
					console.log("1111");
					infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
				}
			}
}


function moveMap(lng,lat){
    //alert("!111");
    if(lng&&lat){
        var point=new BMap.Point(lng,lat);
        map.centerAndZoom(point,18);
        map.panTo(point);
   }
    return;
}

/**************将所有动物馆的经纬度点数据************/
function allAnimalLoactionData(){
	var Data=$.ajax({
		url:"./common/AnimalMap.json",
		async:false,
		contentType:"application/json"
	})
	return Data.responseText;
}

/******************将所有动物馆的经纬度点遍历到地图上*********************/
function allAnimalLoactionInMap(data){
	var allAnimalInfo=[];
	var data=JSON.parse(data);
	$.each(data,function(idx,obj){
		   	   var Arr=obj.point.split(',');
		   	   var lng=Arr[0];
		   	   var lat=Arr[1];
		       var point=new BMap.Point(lng,lat);
	           map.centerAndZoom(point,13);
	           var myIcon = new BMap.Icon("./image/animalPoint.png", new BMap.Size(25,28),{
				anchor: new BMap.Size(10,20)//这句表示图片相对于所加的点的位置
				});
	           var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
               map.addOverlay(marker);              // 将标注添加到地图
               //初始化调用计算距离函数
		       //distance(point,obj,marker);
		      
    	       allAnimalInfo.push({
		       	  marker:marker,
		       	  info:obj.animalLocation,
				  image:obj.image,
				  point:obj.point,
				  id:obj.id
					 
		       });
//		       console.log(markerArr);
   })
   return allAnimalInfo;
}
/*************截取地址参数**************/
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
/*****************获取我的位置到点击地图点的路线***********************/
function WalkLine(config,lng,lat){
	// marker.disableMassClear();
    var myP1=new BMap.Point(config.lng,config.lat);
    var myP2=new BMap.Point(lng,lat);
    var walking = new BMap.WalkingRoute(map, {
		renderOptions:{map: map,
			 //autoViewport: true
			},
        onSearchComplete:function(res){
		  map.clearOverlays();
          if(walking.getStatus()==BMAP_STATUS_SUCCESS){  
                var plan=res.getPlan(0);
                console.log(plan);
                var arrPois=[];
            // console.log(plan.getNumRoutes());
                for(var j=0;j<plan.getNumRoutes();j++){
                        var route = plan.getRoute(j);
                        arrPois= arrPois.concat(route.getPath());
                    }
				map.addOverlay(new BMap.Polyline(arrPois, {strokeColor:"#5298ff", strokeWeight:6, strokeOpacity:0.8})); 
				$(".start_navigation").css('display','block');
                $(".start_navigation").tap(function(){
                        location.href="http://api.map.baidu.com/direction?origin="+config.lat+","+config.lng+"&destination="+lat+","+lng+"&mode=walking&region=北京&output=html";
                })
            }   
        }
    });
    walking.search(myP1,myP2);
}