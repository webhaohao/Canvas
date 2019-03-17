$(function(){
    getFontSize();
    $("body").on('click','.go_shopping',function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("111");
       var productId=$(this).attr('href');
       console.log(productId);
       addCart(productId);
   })
   $("body").on('click','.key_shopping',function(e){
       e.preventDefault();
       console.log("222");
       var productId=$(this).attr('href');
       var price=parseFloat($.trim($(this).parent().siblings('.price').text()).substring(1));
       console.log(price);
       keyShopping(productId,price);
   })
   //点击搜索框
   $(".header").on('click','.search_box',function(e){
        if(e.target.nodeName=='a'){
            e.preventDefault();
        }
         _self=$(this);
         _self.siblings().fadeOut();
         $(this).animate({width:'85%',left:'10%'},500,
            function(){
                $(".header").prepend('<span class="cancel">取消</span>');
                $(".header").addClass('headerfix');
                $(".sel_modal").fadeIn();
                $(".sel_modal").css("zIndex","99");
                $("html,body").css("overflow","hidden");
            }
         )
         if($(".sel_modal").css('display')=='block'){
             console.log("1111");
                $(".header").off('click','.search_box');
          }
   })
   $(".header").on('click','.cancel',function(){
          $(".header span.cancel").fadeOut();
            $(".search_box").animate({
                width:'5rem',
                left:'calc(10px + 0.53rem)'
            },500,function(){
               // $(".header").remove('<span class="cancel">取消</span>');
                
                $(".sel_modal").fadeOut();
                $(".sel_modal").css("zIndex","-1");
                $("html,body").css("overflow","visible");
            })
            $(".search_box").siblings().fadeIn();
   })
   //开始滚动事件
//    $(document).on("scroll",function(){
//         //alert("开始滚动！");
//          var top=$(this).scrollTop();
//          var modal=$(".sel_modal");
//          if(top>0&&modal.css('display')=="block"){
//              modal.animate({'top':'0','paddingTop':'.5rem'},500);
//          }
    
//    });
   //监听input值发现改变
   $(".header").on('change','.search_box>input',function(){
       var val=$(this).val();
       if($.trim(val)){
            getSel(val);
       }
       return;
    })   
});
function getFontSize() {
    //通过计算屏幕宽高比定页面基础字体大小
    var desW = 750,
        winW = document.documentElement.clientWidth,
        oMain = document.querySelector(".container");
    if (winW > 750) {
        oMain.style.width = 750 + "px";
        document.documentElement.style.fontSize = "200px";
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

/************加入购物车******************/
function addCart(productId){
    $.ajax({
        url:'/Zoo/addCart',
        type:'POST',
        data:{
            productID: productId  
        },
        success:function(data){
            //console.log(status);
            if(data.status=="success"){
                $(".modal").fadeIn();
                setTimeout(function(){
                    $(".modal").fadeOut();
                },2000);
            }
            else{
                console.log("加入购物车失败！");
            }
        },
        error:function(){

        }
    })
}
//一键购方法
function keyShopping(productId,price){
    $.ajax({
        url:'/Zoo/weixinstore',
        data:{
            role: "buyOneProduct",
            userId:wxUserInfo,
            productId: productId,
            price:price
        },
        success:function(data){
            var data=JSON.parse(data);
            //console.log(status);
            if(data.code){
              console.log(data.code);
            }
            else{

            }
        },
        error:function(){

        }
    })
}
/*******获取搜索结果************/
function getSel(val){
   $(".sel_modal .Zoo_hot_wrapper ul").empty();
   $.ajax({
       url:'/Zoo/weixinstore',
       data:{
       	role: "searchProduct",
        searchContent:val  
       },
       success:function(data){
            var data=JSON.parse(data);
           if($.isArray(data)){
            $.each(data,function(i,item){
                var html=`
                    <li>
                        <div class="prodcut_list_img">
                            <a href="./product_detail.html?productId=${item.productId}">
                                 <img src="${item.pic}" alt="" />
                            </a>
                        </div>
                        <h5>${item.name}</h5>
                        <div class="product_msg">
                        <div class="price">
                            <b>￥${item.price}</b>
                        </div>
                        <div class="product_btn">
                            <a href="${item.productId}" class="key_shopping"></a>
                            <a href="${item.productId}" class="go_shopping"></a>
                            </div>
                    </div>
                    </li>
                `;
                $(".sel_modal .Zoo_hot_wrapper ul").append(html);
            })
          } 
       },
       error:function(){

       }
   })
}
//生成订单
function setOrder(data,total){
     $.ajax({
         url:'/Zoo/creatOrder',
         type:'POST',
         dataType:'text',
         data:{
             info:data
         },
         success:function(orderNum){
                alert("准备支付")
              console.log(orderNum);
               pay(orderNum,total)  
         },
         error:function(){
             alert("调起接口失败！")
         }
     })   
}

//调起支付
function pay(orderNum,proPrice){  
    alert("开始支付");
	if (typeof WeixinJSBridge == "undefined"){    
        if( document.addEventListener ){    
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);    
        }else if (document.attachEvent){    
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);     
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);    
        }    
        }else{    
            toPay(orderNum,proPrice);    
        }     
    } 
    function toPay(orderNum,proPrice){ 
        $.ajax({  
            url : "/Zoo/toPayInit",  
            type:"GET",  
            dataType:'json', // 服务器返回的格式,可以是json或xml等  
            data:{  
                payMoney:proPrice,  
                body:"123",
                source:"wx",
                trade:orderNum
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
                            $.ajax({
                                url:'/Zoo/creatBuyCode',
                                type:'POST',
                                dataType:'text',
                                data:{
                                    trade:orderNum
                                },
                                success:function(data){
                                    console.log(data);
                                    location.href="./shop_code.html";
                                }
                            })
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