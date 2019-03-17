
//ajax_WX();
var map = new BMap.Map("container");  // 创建地图实例
map.setMapStyle({style:'light'}); 
//getDistance();
//获取我的位置和所有售卖点的距离
function addMarker(point,infoWindow){        
var marker = new BMap.Marker(point);        // 创建标注    
map.addOverlay(marker);              // 将标注添加到地图中 
marker.onclick=(function(){
    //var p = e.target;
    this.openInfoWindow(infoWindow);
    document.getElementsByClassName('imgDemo').onload = function (){
        console.log("1111");
        infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
    }
    }
);   //标注增加点击事件
marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
}     
//将所有地址都存储在local
function getBaiduPosition(lng,lat) {
    //alert(lng);
   //alert(lat);
   var url ="http://api.map.baidu.com/geoconv/v1/?coords="+lng+","+lat+"&from=1&to=5&ak=f99kAEYGls7AOagGUFFBkgwb";
   $.ajax({
       url: url,
       type: 'GET',
       contentType: "application/json",
       dataType: 'jsonp',//这里要用jsonp的方式不然会报错
       success: function(data) {
           //alert(data);
           var config={};
           config.lng = data.result[0].x;//经度
           config.lat  = data.result[0].y;//纬度
           getDis(config);    
       }
   });
}
function getDis(config){
    var pointArray=new Array();
     //alert(config.lng);
    var point = new BMap.Point(116.417854,39.921988);  // 创建点坐标  
    map.centerAndZoom(point, 15);
   // map.centerAndZoom(point,15);
    var pointA = new BMap.Point(config.lng,config.lat);  // 创建点坐标A--大渡口区   
    // var bounds = map.getBounds();
    // var sw = bounds.getSouthWest();
    // var ne = bounds.getNorthEast();
    // var lngSpan = Math.abs(sw.lng - ne.lng);
    // var latSpan = Math.abs(ne.lat - sw.lat);
    var data_info = [
                    [116.417854,39.921988,"地址：北京市东城区"],
                    [116.406605,39.921585,"地址：北京市东城区东华门大街"],
                    [116.412222,39.912345,"地址：北京市东城区正义路甲5号"]
    ]; 

    for (var i = 0; i <data_info.length;i++) {
        pointArray[i]=new BMap.Point(data_info[i][0],data_info[i][1]);
        var num=map.getDistance(pointA,pointArray[i]);
        var dis=num>1000?(num/1000).toFixed(2)+'千米':num.toFixed(2)+'米';
        var sContent =
        "<div class='map_model clear'>"+
        "<img src='./images/msg_s_img.jpg' class='imgDemo'>"+
        "<h4>"+data_info[i][2]+"</h4>" +  
        "<p style='margin:0;line-height:1.5;font-size:13px;'><i class='navigation_btn'></i><span>"+dis+"</span></p>" + 
        "<p class='b_menu'><a href='' class='all_view'>全景</a><a class='go_here' href='go_here.html?lng="+data_info[i][0]+"&"+"lat="+data_info[i][1]+"'>到这去</a></p>"+
        "</div>";
        var infoWindow=new BMap.InfoWindow(sContent);
        infoWindow.addEventListener('open',function(type, target, point){ //窗口打开是，隐藏自带的关闭按钮
            $('.BMap_pop>img').hide();
           })
        addMarker(pointArray[i],infoWindow);
        pointArray[i].attr= data_info[i][2];    
    }
    var attrArr=JSON.stringify(pointArray); 
     localStorage.attrArr=attrArr;
}
//获取覆盖物位置
//function attribute(e){
   
    //searchInfoWindow.open(marker);
//}

// var map = new BMap.Map("container");    
// map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);    
// var walk = new BMap.WalkingRoute(map, {    
//     renderOptions: {map: map}    
// });    
// walking.search("天坛公园", "故宫");
