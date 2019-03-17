// window.localStorage.removeItem("wxUserInfo");
function getUrlParameter(para) {
  var url = window.location.href;
  if (url.indexOf(para) < 0) {
    return;
  }
  var paramStr = url.split("?")[1];
  if(!paramStr) return;
  var params = paramStr.split("&");
  var result;
  params.forEach(function(param) {
    var key = param.split("=")[0];
    var value = param.split("=")[1];
    if (key === para) {
      result = value;
    }
  });
  return result;
}
function wxAuthor(WX_APPID) {
  var wxUserInfo = window.localStorage.getItem("wxUserInfo"); 
  var redirectUrl = encodeURIComponent("http://www.eliter.cn/Zoo/zooseefun.jsp");
  if (!wxUserInfo) {
    var code = getUrlParameter("code");
    if (code) {
      getWxUserInfo(code);
    } else {
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
}

function getWxUserInfo(par) {
  if (par) var code = par;
  $.ajax({
	async: false,
	dataType: 'json',
    data: { code: code },
    type: "GET",
    url: "/Zoo/jsweixin", // 請求路由
    success: function(json) {
      if (json) {
        try {
          //保证写入的wxUserInfo是正确的
		  //var data = JSON.parse(json);
          if (json.userid) {
            window.localStorage.setItem("wxUserInfo", json.userid); //写缓存--微信用户信息
          }
        } catch (e) {
          // TODO: handle exception
        }
      }
    },
  });
}
/* zcf 添加結束 */
$(function () {
	getFontSize();
	$.ajax({
		type: "post",
		dataType: "json",
		url: "/Zoo/jsweixin",
		//async:false,
		data: {
			url: location.href.split('#')[0]
		},
//		complete: function() {
//			alert("5");
//		},
		success: function(msg) {
			var data = msg['success'];
			
			if(data) {
				wx.config({
					debug:false, //
					appId: msg['appId'], // 必填，公众号的唯一标识
					timestamp: msg['timestamp'], // 必填，生成签名的时间戳
					nonceStr: msg['nonceStr'], // 必填，生成签名的随机串
					signature: msg['signature'], // 必填，签名，见附录1
					jsApiList: ['chooseImage','uploadImage' ,'startRecord','stopRecord','translateVoice','getLocation', 'openLocation']
						// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				wx.ready(function() {
					/**/ wx.checkJsApi({
						jsApiList: ['chooseImage','uploadImage' ,'startRecord','stopRecord','translateVoice'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
						success: function(res) {
							// 以键值对的形式返回，可用的api值true，不可用为false
							// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
							//alert("hello:"+res);
							// alert(JSON.stringify(res))
						}
					});
					wx.getLocation({
						type : 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						success : function(res) {
								alert(res);
								// alert(JSON.stringify(res));
								var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
								// $("#latitude").val(latitude);
								var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
								// $("#longitude").val(longitude);
								var speed = res.speed; // 速度，以米/每秒计
								// $("#speed").val(speed);
								var accuracy = res.accuracy; // 位置精度
								// $("#accuracy").val(accuracy);
						},
						fail:function(){
								alert("111");  
						},
						cancel : function(res) {
								alert('用户拒绝授权获取地理位置');
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
	   
	//拍照2
	$(".seefun_btn,#seefun").on('touchstart', function () {
		var wxUserInfo = window.localStorage.getItem("wxUserInfo"); 
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				//alert(localIds);
//    	        $(".scan_img").fadeIn("slow");
//    	        $("body").css("background","url("+localIds+") 0 0/100% 100%");
//    	        $("#homeIndex").css("visibility", "hidden");
				setTimeout(function(){
					wx.uploadImage({
						localId: localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
						isShowProgressTips: 1, // 默认为1，显示进度提示
						success: function (res) {
							var serverId = res.serverId; // 返回图片的服务器端ID
							$.ajax({
								type: "POST",
								async:false,
								url: "/Zoo/weixinimage",
								data:{
									userid:wxUserInfo,
									imageid:serverId,
									getAllInfo:"0"
								},
								dataType: "JSON",
								success: function(msg){
									//alert(location.hostname+"/Zoo/seefun.jsp?serverId="+serverId+"&id="+msg.id);
									location.href="http://"+location.hostname+"/Zoo/seefun.jsp?serverId="+localIds+"&id="+msg.id;
								},
								error: function(msg){
									alert(111+msg);
									location.href="http://"+location.hostname+"/Zoo/seefun.jsp?serverId="+localIds+"&id="+msg.id;
								}
							}); 
						}
					})
				},100);
			}
		});
	});
	
	

	$(window).resize(function () {
		getFontSize();
	});
});


function getFontSize() {  //通过计算屏幕宽高比定页面基础字体大小
	var desW =375,
		winW = document.documentElement.clientWidth,
		oMain = document.querySelector('.container');
	if (winW > 750) {
			oMain.style.width = 750 + 'px';
			document.documentElement.style.fontSize = '100px';
			return;
	}
	document.documentElement.style.fontSize = winW  / desW * 100 + 'px';
}