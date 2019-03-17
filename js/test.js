// const countMoney=(function(){
//     let money=0;
//     let args=[]
//     const res = function (){
//         if(arguments.length===0){
//             for(let i=0;i<args.length;i++){
//                 money+=args[i];
//             }
//             return money;
//         }
//         else{
//             args.push(...arguments);
//             return res;
//         }
//     }
//     return res;
// })();
// countMoney(1);
// console.log(countMoney(2));

//定义公共变量
const  BASEURL="http://www.zooseefun.net/data";
//公用的方法
//window.localStorage.removeItem("wxUserInfo");
function getFontSize() {
    //通过计算屏幕宽高比定页面基础字体大小
    var desW = 750,
    winW = document.documentElement.clientWidth;
    if (winW > 750) {
        document.documentElement.style.fontSize = "100px";
        return;
    }
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}
/*************截取地址参数**************/
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function wxAuthor(WX_APPID) {
var wxUserInfo = window.sessionStorage.getItem("wxUserInfo"); 
//alert(wxUserInfo);
var locationHref=window.location.href;
console.log(locationHref);
//var redirectUrl = encodeURIComponent("http://www.zooseefun.net/Zoo/zooseefun.html");
var redirectUrl = encodeURIComponent(locationHref);
    if (!wxUserInfo) {
        var code = GetQueryString("code");
        if (code) {
			 //alert(code);
			 getUserLocationZoo().then(function(data){
				getWxUserInfo(code,data); 
			 })
        } 
        else {
        //没有微信用户信息，没有授权-->> 需要授权，跳转授权页面
        window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            WX_APPID + // WX的appid怎么获取
            "&redirect_uri=" +
            redirectUrl +
            "&response_type=code&scope=snsapi_userinfo" +
            "&state=STATE#wechat_redirect";
        }
	}
	else{
		$(".nav .nav-left span").html(window.sessionStorage.getItem('city'));
	}
}
function getUserLocationZoo(){
	return new Promise(function(resolve,reject){
		wx.ready(function(){
			wx.getLocation({
				type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function (res) {
					try {
						var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						var speed = res.speed; // 速度，以米/每秒计
						var accuracy = res.accuracy; // 位置精度
						//alert(lat);
						getBaiduPosition(lng,lat).then(function(config){
							var point=new BMap.Point(config.lng,config.lat);
							var getData = new BMap.Geocoder();
							//alert(JSON.stringify(config));
							getData.getLocation(point, function(rs)
								{
								var xiangxi = rs.addressComponents;
								var adress=xiangxi.city+ xiangxi.district;
								$(".nav .nav-left span").html(adress);
								window.sessionStorage.setItem('city',adress);		
								if(xiangxi.city=="漳州市"){
									resolve(4);
									$("header").css("display","none");
									$(".Navigation").css("display","none");
								}
								else if(xiangxi.city=="北京市"){
									resolve(1);
								}
								else{
									resolve(1);
								}
							});
						})
					} catch (e) {
						alert(e.message);
					}
				}
			})
		})	
	})
} 
//将微信定位坐标转化为百度坐标
function getBaiduPosition(lng,lat) {
    //alert(lng);
   //alert(lat);
   return new Promise(function(resolve,reject){
		var url ="http://api.map.baidu.com/geoconv/v1/?coords="+lng+","+lat+"&from=1&to=5&ak=f99kAEYGls7AOagGUFFBkgwb";
		$.ajax({
			url: url,
			type: 'GET',
			async:false,
			contentType: "application/json",
			dataType: 'jsonp',//这里要用jsonp的方式不然会报错
			success: function(data) {
				//alert(data);
				var config={};
				config.lng = data.result[0].x;//经度
				config.lat  = data.result[0].y;//纬度
				resolve(config);
			//    alert(config.lng+','+config.lat);
			//    fillPersonPosition(config.lng,config.lat);
			//    var currentInfo={};
			//    currentInfo.lng=GetQueryString("lng");
			//    currentInfo.lat=GetQueryString("lat");
			//    if(currentInfo.lng&&currentInfo.lat){
			//        $(".start_navigation").css('display','block');
			//    }
			//    WalkLine(config,currentInfo);
			//    allAttr(config);
			}
		});
   })
} 
function getWxUserInfo(par,zooid) {
	if (par) var code = par;
    $.ajax({
        async: false,
        dataType: 'json',
		data: {
			code: code,
			zooid:4
		},
        type: "GET",
        url: "/Zoo/jsweixin", // 請求路由
        success: function(json) {
            //alert("usersuccess");
            if (json) {
               // alert("返回的用户json:"+json);
            try {
                //保证写入的wxUserInfo是正确的
                //var data = JSON.parse(json);
                if (json.userid) {
                	window.sessionStorage.setItem("wxUserInfo", json.userid); //写缓存--微信用户信息  
				}
				if(json.openid){
					window.sessionStorage.setItem("openid", json.openid);
				}
				if(json.unionid){
					window.sessionStorage.setItem('unionid',json.unionid);
				}
            } catch (e) {
                // TODO: handle exception
            }
            }
        },
    });
  }
function isFail(status){
	return status=='fail'? false :true;
}  
$(function () {
	getFontSize();
	(window.onresize = function () {
		getFontSize();
	})();
	//获取用户所在的动物园
	//getUserLocationZoo();
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/Zoo/jsweixin",
		//async:false,
		data: {
			url: location.href.split('#')[0]
		},
		success: function(msg) {
			var data = msg['success'];
			if(data) {
				wx.config({
					debug:false, //
					appId: msg['appId'], // 必填，公众号的唯一标识
					timestamp: msg['timestamp'], // 必填，生成签名的时间戳
					nonceStr: msg['nonceStr'], // 必填，生成签名的随机串
					signature: msg['signature'], // 必填，签名，见附录1
					jsApiList: ['chooseImage','uploadImage','previewImage' ,'startRecord','stopRecord','translateVoice','onMenuShareTimeline','onMenuShareAppMessage','getLocation']
						// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				wx.ready(function() {
					/**/
						wx.checkJsApi({
							jsApiList: ['chooseImage','uploadImage','previewImage','startRecord','stopRecord','translateVoice','onMenuShareTimeline','onMenuShareAppMessage', 'getLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
							success: function(res) {
								// 以键值对的形式返回，可用的api值true，不可用为false
								// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
								//alert("hello:"+res);
							 //alert(JSON.stringify(res))
							}
						}); 
						wx.onMenuShareTimeline({
					          title: '这是我在动物园收集到的印章',
					          link: 'http://www.zooseefun.net/Zoo/seal.html'+window.sessionStorage.getItem("wxUserInfo"),
					          imgUrl:'http://www.zooseefun.net/Zoo/seal_image/zoo-map.jpg',
					          trigger: function (res) {
					            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
					          },
					          success: function (res) {
					             alert('已分享');
					          },
					          cancel: function (res) {
					            // alert('已取消');
					          },
					          fail: function (res) {
					            // alert(JSON.stringify(res));
					          }
					});
			  });
				wx.error(function(res) {
					alert("config error==="+JSON.stringify(res));
					// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

				});
				wxAuthor(msg['appId']);
			}
			else
			{
				alert("data is false")
			}
		},
		error:function(){
			alert("44");
		}
		
	}); 
	//点击印章跳转到用户印章页面
    $("#seal_btn").on('tap',function(e){
        e.preventDefault();
        $("#seal_btn").removeClass('active'); 
        window.location.href="./seal.html?userId="+window.sessionStorage.getItem("wxUserInfo");
    })
	//拍照2
	$(".seefun_btn").on('touchstart', function () {
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				console.log(res);
				var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				//alert(localIds);

				setTimeout(function(){
					wx.uploadImage({
						localId: localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
						isShowProgressTips: 1, // 默认为1，显示进度提示
						success: function (res) {
							$("#loading").fadeIn();
							//var serverId = res.serverId; // 返回图片的服务器端ID
							$.ajax({
								type: "POST",
								//async:false,
								complete:function(){
									$("#loading").fadeOut();
								},
								url: "/Zoo/weixinimage",
								data:{
									imageid:res.serverId
								},
								dataType:'json',
								success: function(msg){
									if(isFail(msg.status)=='false')return;
									var animalData=JSON.stringify(msg);
									switch (msg.status){
										case "fail":
										location.href="http://"+location.hostname+"/Zoo/AnimateNofound.html";
										break;
										default:
										//alert(animalData);
										sessionStorage.setItem('animalData',animalData);
                                        location.href="http://"+location.hostname+"/Zoo/seefun.html";
									}
									
								},
								error: function(msg){
									    alert("返回值错误"+msg);
										//location.href="http://"+location.hostname+"/Zoo/seefun.html?serverId="+localIds+"&id="+msg.id;
								}
							}); 
						}
					})
				},500);
	 		}
   	    });
	});
});
