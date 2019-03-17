$(function(){
   $(".InputRecharge_C input").on('change',function(){
       if($(this).val()>3000){  
           alert("嘻范币的输入的最大值为3000");
       }
       else if(isNaN($(this).val())){
           alert("请输入合法的数字!"); 
       }
       else{
        getMoney($(this).val());
       }
   })
   $(".recharge-btn").on('tap',function(){   
         pay($("#moneyVal").val());
   })
   $(".items ul li").on('tap',function(){
       $(this).addClass('active').siblings().removeClass('active');
       var money=parseFloat($(this).find('span').eq(1).html());
       $("#moneyVal").val(money);
       $(".recharge-btn span").html("¥"+money);
   })
})  
function getMoney(money){
    $.ajax({
        url:"/Zoo/getMoney",
        type:'POST',
        data:{
            "xifanbi":money
        },
        success:function(data){
            console.log(data);
            $("#moneyVal").val(data.money);
            $(".recharge-btn span").html("¥"+data.money);
        }
    })
}
function topup(xifanbi){
    $.ajax({
        url:"/Zoo/topup",
        type:'POST',
        data:{
            "xifanbi":xifanbi 
        },
        success:function(data){
            console.log(data);
        }
    })
}

//调起支付
function pay(proPrice){  
    alert("开始支付");
	if (typeof WeixinJSBridge == "undefined"){    
        if( document.addEventListener ){    
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);    
        }else if (document.attachEvent){    
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);     
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);    
        }    
        }else{    
            toPay(proPrice);    
        }     
    } 
    function toPay(proPrice){ 
        $.ajax({  
            url : "/WchatPay/toPayInit",  
            type:"POST",  
            dataType:'json', // 服务器返回的格式,可以是json或xml等  
            data:{  
                attach:"livePay",
                body:"嘻范科技-直播",
                price:proPrice,
                openid:window.sessionStorage.getItem("openid")
                //code:window.localStorage.getItem('code')
    //          userWeixinOpenId:'用户operId'  
            },  
            success : function(result) { // 服务器响应成功时的处理函数  
                alert("调用微信支付成功！");
                //开始微信支付
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                    "appId":result['appId'],     //公众号名称，由商户传入     
                    "timeStamp":result['timeStamp'],         //时间戳，自1970年以来的秒数     
                    "nonceStr":result['nonceStr'], //随机串     
                    "package":result['package'],     
                    "signType":result['signType'],         //微信签名方式：     
                    "paySign":result['paySign'] //微信签名 
                },
                function(res){   
                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                            alert("支付成功!");
                            topup($(".InputRecharge_C input").val());
                            // $.ajax({
                            //     url:'/Zoo/creatBuyCode',
                            //     type:'POST',
                            //     dataType:'text',
                            //     data:{
                            //         trade:orderNum
                            //     },
                            //     success:function(data){
                            //         console.log(data);
                            //         location.href="./shop_code.html";
                            //     }
                            // })
                    }     
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    else if (res.err_msg == "get_brand_wcpay_request:cancel")  {  
                            alert("支付过程中用户取消");  
                    }
                    else{
                        //支付失败  
                        alert(res.err_msg)  
                }       
        })
        },  
        error : function(data, status, e) { // 服务器响应失败时的处理函数  
            alert(JSON.stringify(e));
            //$.toptip("初始化支付接口失败，请联系系统运营商", 'error');  
        }  
       });  
} 