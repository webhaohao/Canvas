$(function(){
    ajax_WX();
})
function getBaiduPosition(lng,lat) {
    //alert(lng);
   //alert(lat);
   var config={};
   var url ="http://api.map.baidu.com/geoconv/v1/?coords="+lng+","+lat+"&from=1&to=5&ak=f99kAEYGls7AOagGUFFBkgwb";
   $.ajax({
       url: url,
       type: 'GET',
       async:false,
       contentType: "application/json",
       dataType: 'jsonp',//这里要用jsonp的方式不然会报错
       success: function(data) {
           //alert(data);
          // var config={};
           config.lng = data.result[0].x;//经度
           config.lat  = data.result[0].y;//纬度
           $(".getLocation_btn").click(function(){
               //alert(currentLat);
               moveMap(config.lng,config.lat);  
           })
           fillMap(config.lng,config.lat);
           var currentInfo={};
           currentInfo.lng=GetQueryString("lng");
           currentInfo.lat=GetQueryString("lat");
           if(currentInfo.lng&&currentInfo.lat){
               $(".start_navigation").css('display','block');
           }
           WalkLine(config,currentInfo);
           allAttr(config);
         // alert(config.lat);
       }
   });
}
var map=new BMap.Map('container');
function fillMap(lng,lat,infoWindow){
    console.log("111");
    var point=new BMap.Point(lng,lat);
    map.centerAndZoom(point,15);
    var marker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(marker);              // 将标注添加到地图中
    map.panTo(point);
    marker.onclick=(function(){
        //var p = e.target;
        console.log(this);
        this.openInfoWindow(infoWindow);
        document.getElementsByClassName('imgDemo').onload = function (){
            console.log("1111");
            infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
        }
      }
    );   //标注增加点击事件
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
}
function moveMap(lng,lat){
    //alert("!111");
    if(lng&&lat){
        var point=new BMap.Point(lng,lat);
        map.centerAndZoom(point,15);
        map.panTo(point);
   }
    return;
}
/**************将所有的地图点遍历到地图上************/
function allAttr(config){
var attrArr=JSON.parse(localStorage.attrArr);
var pointA = new BMap.Point(config.lng,config.lat);
   $.each(attrArr,function(idx,obj){
       // console.log(obj.lng);
       var point=new BMap.Point(obj.lng,obj.lat);
       var num=map.getDistance(pointA,point);
       var dis=num>1000?(num/1000).toFixed(2)+'千米':num.toFixed(2)+'米';
       var sContent =
       "<div class='map_model clear'>"+
	       "<img src='./images/msg_s_img.jpg' class='imgDemo'>"+
	       "<h4>"+obj.attr+"</h4>" +  
	       "<p style='margin:0;line-height:1.5;font-size:13px;'><i class='navigation_btn'></i><span>"+ dis+"</span></p>" + 
	       "<p class='b_menu'><a href='' class='all_view'>全景</a><a class='go_here' href='go_here.html?lng="+obj.lng+"&"+"lat="+obj.lat+"'>到这去</a></p>"+
       "</div>";
       var infoWindow=new BMap.InfoWindow(sContent);
       infoWindow.addEventListener('open',function(type, target, point){ //窗口打开是，隐藏自带的关闭按钮
        $('.BMap_pop>img').hide();
       })
        fillMap(obj.lng,obj.lat,infoWindow);
   })
}
/*************截取地址参数**************/
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
/*****************获取我的位置到点击地图点的路线***********************/
function WalkLine(config,currentInfo){
    var myP1=new BMap.Point(config.lng,config.lat);
    var myP2=new BMap.Point(currentInfo.lng,currentInfo.lat);
    var walking = new BMap.WalkingRoute(map, {
        renderOptions:{map: map, autoViewport: true},
        onSearchComplete:function(res){
          if(walking.getStatus()==BMAP_STATUS_SUCCESS){  
                var plan=res.getPlan(0);
                console.log(plan);
                var arrPois=[];
            // console.log(plan.getNumRoutes());
                for(var j=0;j<plan.getNumRoutes();j++){
                        var route = plan.getRoute(j);
                        arrPois= arrPois.concat(route.getPath());
                    }
                map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: 'red'})); 
                $(".start_navigation").click(function(){
                        location.href="http://api.map.baidu.com/direction?origin="+config.lat+","+config.lng+"&destination="+currentInfo.lat+","+currentInfo.lng+"&mode=walking&region=北京&output=html";
                })
            }   
        }
    });
    walking.search(myP1,myP2);
}

