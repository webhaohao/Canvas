// $(window).on('load',function(){
// })
//初始id值
var zooId=1;
$(function(){
    getZoo();
    //将格林时间转化为 标准年月日
    Date.prototype.stringify =function(){
        var s=this.getFullYear() + '-' + (this.getMonth() + 1<10?"0"+(this.getMonth()+1):this.getMonth()+1) + '-' + (this.getDate()<10?"0"+(this.getDate()):this.getDate());
        return s;
    }
    var userForMap= new UserForMap();
    var tabsNav=new Swiper('.tabs',{
        freeMode : true,
          slidesPerView : 'auto',
        onInit:function(){
        //	$('.tabsNav .swiper-slide').eq(0).find('a').addClass('active');	
        } , 
        onClick:function(swiper){
           // tabsSwiper.slideTo(tabsNav.clickedIndex,500,function(){
            // $('.tabsNav .swiper-slide').eq(tabsNav.clickedIndex).addClass('active');
            // })
        }
    })
    $(".header span").on('tap',function(){
            $(".modal").addClass('active');
    })
    $('.modal .icon').on('tap',function(){
        $(".modal").removeClass('active');
    })
    $('.modal-content ul').on('tap','li',function(){
           zooId=$(this).data('id');
           userForMap.init();
           $(".header span").html($(this).html());
           $(".modal").removeClass('active');
    })
    $('.item ul li').on('tap',function(){
            $(this).addClass('active').siblings().removeClass('active');
            userForMap.init();
    })
    $(".tabs .swiper-slide a").on('tap',function(){
          $(this).addClass('active').parent().siblings().children('a').removeClass('active');
          userForMap.init();
        //   var html=$(this).html();
        //   console.log(html);
    })
     var startTime= new LCalendar();
     startTime.init({
        'trigger': '#startTime', //标签id
        'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        'minDate': '2018-5-5', //最小日期
        'maxDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() //最大日期
    });
    var endTime= new LCalendar();
    endTime.init({
        'trigger':'#endTime', //标签id
        'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        'minDate': '2018-5-5', //最小日期
        'maxDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() //最大日期
    }); 
})
// 获取动物园列表
function getZoo(){
    $.ajax({
        type:'get',
        url:'http://www.zooseefun.net/ReportForms/zoo/getZoo',
        success:function(data){ 
            // console.log(data);
            $.each(data,function(i,item){
                 var html=`
                         <li data-id="${item.zooId}">${item.name}</li>
                 `; 
               $(".modal-content ul").append(html);  
            })
        }
    })     
}
 //通过用户不同的选择执行不同的统计图
 function UserForMap(){
    this.mapType="";
    this.timeType="";
    this.changeDateInput=function(){
            console.log(this.timeType);
            switch (this.timeType){
                case "昨日":
                var preDateStart=new Date(new Date(new Date().getTime()-24*60*60*1000)).stringify()+' 00:00';
                var preDateEnd=new Date(new Date(new Date().getTime()-24*60*60*1000)).stringify()+' 23:59';
                break;
                case "本月":
                var preDateStart=new Date().getFullYear() + '-' + (new Date().getMonth() + 1<10?"0"+(new Date().getMonth() + 1):new Date().getMonth() + 1) + '-01' ; 
                var preDateEnd=new Date().getFullYear() + '-' + (new Date().getMonth() + 1<10?"0"+(new Date().getMonth() + 1):new Date().getMonth() + 1) + '-' + (new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate());
                break;
                case "上月":
                var preDateStart=lastMonthDate().firstDay;
                var preDateEnd=lastMonthDate().lastDay;
                break;
                case "今年":
                var preDateStart=new Date().getFullYear() + '-01' + '-01' ; 
                var preDateEnd=new Date().getFullYear() + '-' + (new Date().getMonth() + 1<10?"0"+(new Date().getMonth() + 1):new Date().getMonth() + 1) + '-' + (new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate());
            }
            $("#startTime").val(preDateStart);
            $("#endTime").val(preDateEnd);
            var time=JSON.stringify({
                startTime:preDateStart,
                endTime:preDateEnd
            })
            this.getData(time);
    }
    this.init();
}
UserForMap.prototype.init=function(){
    var _self=this;
    $('.item ul li').each(function(){
         console.log($(this));
         if($(this).hasClass('active')){
            _self.mapType=$.trim($(this).data('type'));
            // console.log(this.mapType);
         }
    })
    $('.timeItem .swiper-slide').each(function(){
        if($(this).find('a').hasClass('active')){
            _self.timeType=$.trim($(this).find('a').text());
            // console.log(this.timeType)
         }
    })
    _self.changeDateInput();
   
}      
UserForMap.prototype.getData=function(time){
    var myChart = echarts.init(document.getElementById('main'));
    var myChart02 = echarts.init(document.getElementById('main02'));
    var _self=this;
    myChart.showLoading();
    $.ajax({
        type:'get',
        url:'http://www.zooseefun.net/ReportForms/report/getReportFormsByTime',
        // async:false,
        data:{time:time,zooId:zooId},
        success:function(data){
            myChart.hideLoading();
            console.log(data);
            //合并数据中的相同项,并进行相加数量
            var hash={};
            var i=0;
            var res=[];
            (data.constructor==Array)&&data.forEach(function(item){
                    var name=item.name;
                    hash[name]?res[hash[name]-1].count+=parseInt(item.count):hash[name]=++i&&res.push({
                        animalId:item.animalId,
                        count:parseInt(item.count),
                        name:name,
                        lat:item.lat,
                        Lon:item.Lon
                    })
            })
            console.log(res);
            if(_self.mapType=="heatmap"){
                $("#main").fadeOut();
                $("#main02").fadeIn();
                drawHeartMap(res,myChart02,_self.mapType);
            }
            else{
                $("#main").fadeIn();
                $("#main02").fadeOut();
                drawHeartMap(res,myChart,_self.mapType);
            }
           
        }
    })
}
 function lastMonthDate(){
    var Nowdate = new Date();
         var vYear = Nowdate.getFullYear();
         var vMon = Nowdate.getMonth() + 1;
         var vDay = Nowdate.getDate();
     　　//每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
         var daysInMonth = new Array(0,31,28,31,30,31,30,31,31,30,31,30,31);
         if(vMon==1){
             vYear = Nowdate.getFullYear()-1;
             vMon = 12;
        }else{
            vMon = vMon -1;
        }
    　　//若是闰年，二月最后一天是29号
        if(vYear%4 == 0 && vYear%100 != 0  || vYear%400 == 0){
            daysInMonth[2]= 29;
        }
        // if(daysInMonth[vMon] < vDay){
            vDay = daysInMonth[vMon];
        // }
        if(vDay<10){
            vDay="0"+vDay;
        }
        if(vMon<10){
            vMon="0"+vMon;
        }
        var date={};
        console.log(vMon);
        date.firstDay=vYear+"-"+ vMon +"-01";
        date.lastDay=vYear+"-"+ vMon +"-"+ vDay;
        return date;
 }
 function drawHeartMap(data,myChart,mapType){
    console.log(mapType); 
    //myChart.clear();
   if(mapType=="heatmap"){
        var option = {
            baseOption: {
                title:{
                    left: 'center',
                    top: 20,
                    textStyle:{
                        color: 'white',
                        fontSize: 20
                    },
                    subtextStyle:{
                        color: 'white',
                        fontSize: 16
                    }
                },
                timeline: {
                    // autoPlay:false,
                    // // data: ["2018-05-15 00:00","2018-05-17 00:00"],
                    // axisType: 'category',
                    // padding: [5,5,5,5],
                    // playInterval:1500,
                    // lineStyle:{color:'white'},
                    // label:{
                    //     normal:{
                    //         textStyle:{
                    //             color: 'white',
                    //             fontSize: 18
                    //         }
                    //     }
                    // }
                },
                bmap: {
                    center: [116.343376,39.947735],
                    zoom:18,
                    roam: true,
                    mapStyle: {
                                styleJson: [
                    {
                                'featureType': 'land',     //调整土地颜色
                                'elementType': 'geometry',
                                'stylers': {
                                        'color': '#081734'
                                }
                    },
                    {
                                'featureType': 'building',   //调整建筑物颜色
                                'elementType': 'geometry',
                                'stylers': {
                                        'color': '#04406F'
                                }
                    },
                    {
                                'featureType': 'building',   //调整建筑物标签是否可视
                                'elementType': 'labels',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'highway',     //调整高速道路颜色
                                'elementType': 'geometry',
                                'stylers': {
                                'color': '#015B99'
                                }
                    },
                    {
                                'featureType': 'highway',    //调整高速名字是否可视
                                'elementType': 'labels',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'arterial',   //调整一些干道颜色
                                'elementType': 'geometry',
                                'stylers': {
                                'color':'#003051'
                                }
                    },
                    {
                                'featureType': 'arterial',
                                'elementType': 'labels',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'green',
                                'elementType': 'geometry',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'water',
                                'elementType': 'geometry',
                                'stylers': {
                                        'color': '#044161'
                                }
                    },
                    {
                                'featureType': 'subway',    //调整地铁颜色
                                'elementType': 'geometry.stroke',
                                'stylers': {
                                'color': '#003051'
                                }
                    },
                    {
                                'featureType': 'subway',
                                'elementType': 'labels',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'railway',
                                'elementType': 'geometry',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'railway',
                                'elementType': 'labels',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'all',     //调整所有的标签的边缘颜色
                                'elementType': 'labels.text.stroke',
                                'stylers': {
                                        'color': '#313131'
                                }
                    },
                    {
                                'featureType': 'all',     //调整所有标签的填充颜色
                                'elementType': 'labels.text.fill',
                                'stylers': {
                                        'color': '#FFFFFF'
                                }
                    },
                    {
                                'featureType': 'manmade',   
                                'elementType': 'geometry',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'manmade',
                                'elementType': 'labels',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'local',
                                'elementType': 'geometry',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'local',
                                'elementType': 'labels',
                                'stylers': {
                                'visibility': 'off'
                                }
                    },
                    {
                                'featureType': 'subway',
                                'elementType': 'geometry',
                                'stylers': {
                                        'lightness': -65
                                }
                    },
                    {
                                'featureType': 'railway',
                                'elementType': 'all',
                                'stylers': {
                                        'lightness': -40
                                }
                    },
                    {
                                'featureType': 'boundary',
                                'elementType': 'geometry',
                                'stylers': {
                                        'color': '#8b8787',
                                        'weight': '1',
                                        'lightness': -29
                                }
                    }]
                    }
                },
                visualMap: {
                    min: 0,
                    max: 200,
                    splitNumber:4,
                    inRange: {
                        color: ['#72baae', '#ebac37', '#e57e3d', '#cd4676']
                    },
                    textStyle: {
                        color: '#fff'
                    },
                    top:10
                },
                series: [{
                    type:"heatmap",
                    mapType:"none",
                    coordinateSystem: 'bmap',
                    blurSize:50,
                    data:[]
                }]
            },
            options: [
                {
                    series:[{
                        data :heartData(data)
                    }]
                }
            ]
        }
  }
  else{
        var  option = {
            //color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            //   dataZoom: [
            //         {
            //             type: 'inside'
            //         }
            //   ],
            xAxis : [
                {
                    type : 'category',
                    data : itemName(data),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            dataZoom: [
                {
                    type: 'slider',
                    //show:true,
                    start: 0,
                    end: 10,
                    showDetail: false,
                    realtime:false
                }, {
                    start: 0,
                    end: 10,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }
                    // {
                    //     type: 'slider',
                    //     show: true,
                    //     start: 94,
                    //     end: 100,
                    //     handleSize: 8,
                    //     showDetail: false

                    // }
                    // {
                    //     type: 'inside',
                    //     start: 94,
                    //     end: 100
                    // },
                    // {
                    //     type: 'slider',
                    //     show: true,
                    //     yAxisIndex: 0,
                    //     filterMode: 'empty',
                    //     width: 12,
                    //     height: '70%',
                    //     handleSize: 8,
                    //     showDataShadow: false,
                    //     left: '93%'
                    // }
            ],
            series : [
                {
                    name:'直接访问',
                    type:mapType,
                    //   barWidth: '60%',
                    data:convertData(data),
                    barGap:'-100%',
                    barCategoryGap:'40%',
                    // coordinateSystem:'cartesian2d',
                    itemStyle:{
                        normal: {
                            // 随机显示
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#83bff6'},
                                    {offset: 0.5, color: '#188df0'},
                                    {offset: 1, color: '#188df0'}
                                ]
                            )
                            }
                        
                            // 定制显示（按顺序）
                            // color: function(params) { 
                            //     var colorList = ['#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ]; 
                            //     return colorList[params.dataIndex] 
                            // }
                    }
                }
            ]
        };
  }
  // Enable data zoom when user click bar.
// var zoomSize = 6;
// myChart.on('click', function (params) {
//     console.log(itemName(data)[Math.max(params.dataIndex - zoomSize / 2, 0)]);
//     myChart.dispatchAction({
//         type: 'dataZoom',
//         startValue: itemName(data)[Math.max(params.dataIndex - zoomSize / 2, 0)],
//         endValue: itemName(data)[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
//     });
// });;
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option,true);
 // myChart.clear();
  //更多地图选项         
  // var bmap = myChart.getModel().getComponent('bmap').getBMap();
  // bmap.addControl(new BMap.MapTypeControl());
  //console.log(convertData(value,100));
 }     
 var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        // var geoCoord = geoCoordMap[data[i].name];
        // if (geoCoord) {
        //     res.push(geoCoord.concat(data[i].value+ (Math.random()-0.5)*n ));
        // }
        // console.log(geoCoord.concat(data[i].value+ (Math.random()-0.5)*n ));
        res.push(data[i].count);
    }
    console.log(res);
    return res;
};
var itemName=function(data){
    var res = [];
    for (var i = 0; i < data.length; i++) {
            // var geoCoord = geoCoordMap[data[i].name];
            // if (geoCoord) {
            //     res.push(geoCoord.concat(data[i].value+ (Math.random()-0.5)*n ));
            // }
            // console.log(geoCoord.concat(data[i].value+ (Math.random()-0.5)*n ));
            res.push(data[i].name);
        }
        console.log(res);
        return res;
}
var heartData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        // var geoCoord = geoCoordMap[data[i].name];
        // if (geoCoord) {
        //     res.push(geoCoord.concat(data[i].value+ (Math.random()-0.5)*n ));
        // }
        // console.log(geoCoord.concat(data[i].value+ (Math.random()-0.5)*n ));
        var arr=[parseFloat(data[i].Lon),parseFloat(data[i].lat),parseFloat(data[i].count)];
        res.push(arr);
        console.log(data.length);
    }
    console.log(res);
    return res;
};