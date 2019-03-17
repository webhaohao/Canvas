function ajax_WX(){
    //alert("111");
    $.ajax({
		type: "post",
		dataType: "json",
		url: "/Zoo/jsweixin",
		async:false,
		data: {
			url: location.href.split('#')[0]
		},
//		complete: function() {
//			alert("5");
//		},
		success: function(msg) {
            //alert(msg['signature']);
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
                            jsApiList: ['chooseImage','uploadImage' ,'startRecord','stopRecord','translateVoice','getLocation', 'openLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
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
                                 //alert(res);
                                // alert("开始定位！")
                                // alert(JSON.stringify(res));
                                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                // $("#latitude").val(latitude);
                                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                // $("#longitude").val(longitude);
                                var speed = res.speed; // 速度，以米/每秒计
                                // $("#speed").val(speed);
                                var accuracy = res.accuracy; // 位置精度
                                // $("#accuracy").val(accuracy);
                                //将经纬度转化为百度坐标
                                 getBaiduPosition(longitude,latitude);
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
}