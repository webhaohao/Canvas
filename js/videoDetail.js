$(function(){
    $("#roomName").html(window.sessionStorage.getItem("roomName"));
    //获取直播介绍
    $.ajax({
        url:'/Zoo/api/animalInfo',
        data:{
            name:window.sessionStorage.getItem("roomName")
        },
        success:function(data){
            //console.log(data);
            $(".tabs-container .intr").html(data.introduction);
        }
    })
    $("body").on('touchstart',function(){
        $(".gife-list,.bottomInfo").removeClass('active');
        $(".sendG span").removeClass('active');
        $(".gife-list ul li").removeClass('active');
    })
    $(".gif").on('touchstart',function(event){
        // event.preventDefault();
        event.stopPropagation();
        $(".gife-list,.bottomInfo").toggleClass('active');
        //$(".bottomInfo").toggleClass('active');
    })
    $(".gife-list ul").on('touchstart','li',function(event){
        event.stopPropagation();
        $(this).addClass('active').siblings('li').removeClass('active');
        $(".sendG span").addClass('active');
    })
    $(".bottomInfo").on('touchstart','.sendG',function(){
         let len=$(".gife-list ul li").length;
         for (let i=0;i<len;i++){
             if($(".gife-list ul li").eq(i).hasClass('active')){
               let id=$(".gife-list ul li").eq(i).data('id');
               setGift(id);
               break;
             }
         }
    })
    var tabsSwiper = new Swiper('.tabs-container',{
        //autoplay:1000,
        speed:500,
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        onInit:function(){
            //$('.tabsItem .swiper-slide').eq(0).find('a').addClass('active');	
        }, 		
        onSlideChangeStart: function(){
             $(".tabsItem a.active").removeClass('active');
             $(".tabsItem .swiper-slide").eq(tabsSwiper.activeIndex).find('a ').addClass('active')  
        }
    })
    var tabsNav=new Swiper('.tabsItem',{
        freeMode : true,
        slidesPerView : 'auto',
        onInit:function(){
            $('.tabsNav .swiper-slide').eq(0).find('a').addClass('active');	
        } , 
        onTap:function(swiper,event){
        //     var id=$(event.target).data("id");
        //     var index=$(event.target).parent().index();
        //     console.log(index);
        //     if(id){
        //         getTypeDetail(id,index);
        //     }
             tabsSwiper.slideTo(tabsNav.clickedIndex,500,function(){
                // $('.tabsNav .swiper-slide').eq(tabsNav.clickedIndex).addClass('active');
            })
        }
    })
    getGifts();
    getTopup();
    $(".sendM").on('touchstart',function(){
        getMessage($(".message input").val());
    })
    var charRoomId=window.sessionStorage.getItem('roomid');
    RongIMClient.init("pwe86ga5edry6");
    //var token="Sk2VILqUi2lW7WzeW+/D+IZGjjOh9GlW3FPXa/vZboXCqWVLjbflEFo53rm68xFBEsv3ohQzQLLroCSk9PIQ+A==";
    // 连接融云服务器。
    var token="";
    $.ajax({
        url:'/Zoo/getToken',
        async:false,
        success:function(data){
            token=data.token;
        },
        error:function(data){
            console.log("token 获取失败");
        }
    })
    RongIMClient.connect(token, {
            onSuccess: function(userId) {
            console.log("Login successfully."+ userId);
            joinChatRoom();
            //getMessage();
            //userId是申请token时的填写的id，到时候可以封装在下面的extra中传过去
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError:function(errorCode){
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                    info = '不可接受的协议版本';
                    break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                    info = 'appkey不正确';
                    break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                    info = '服务器不可用';
                    break;
            }
            console.log(errorCode);
        }
    });
    // 连接状态监听器
RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
        switch (status) {
            //链接成功
            case RongIMLib.ConnectionStatus.CONNECTED:
                console.log('链接成功');
                break;
            //正在链接
            case RongIMLib.ConnectionStatus.CONNECTING:
                console.log('正在链接');
                break;
            //重新链接
            case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接');
                break;
            //其他设备登陆
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登陆');
                break;
            //网络不可用
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log('网络不可用');
                break;
        }
    }
});
     // 消息监听器
RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
        console.log(message.content.content);
        $('.content_box').append(`<p>${message.content.content}</p>`);
        // 判断消息类型
        switch(message.messageType){

     //console.log(message.content.content);

//message接受到的消息（包含发送的信息，也可以在extra中添加要传递的值，如：时间等）

             //break;
            case RongIMClient.MessageType.ImageMessage:
                // do something...
                break;
            case RongIMClient.MessageType.DiscussionNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.LocationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.RichContentMessage:
                // do something...
                break;
            case RongIMClient.MessageType.DiscussionNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.InformationNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.ContactNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.ProfileNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.CommandNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.CommandMessage:
                // do something...
                break;
            case RongIMClient.MessageType.UnknownMessage:
                // do something...
                break;
            default:
            // 自定义消息
            // do something...
        }
    }

});
function joinChatRoom(){
      // 定义消息类型,文字消息使用 RongIMLib.TextMessage
        console.log(RongIMClient.getInstance());
        var count=5;
        RongIMClient.getInstance().joinChatRoom(charRoomId,count, {
                    // 发送消息成功
                    onSuccess: function () {
                    //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    },
                    onError: function (errorCode) {
                        console.log("加入聊天室失败");
                    }
                }
        );
}
function getMessage(val){
    var msg = new RongIMLib.TextMessage({content:val,extra:"附加要传递的值"});
    var conversationtype=RongIMLib.ConversationType.CHATROOM;
    RongIMClient.getInstance().sendMessage(conversationtype,charRoomId, msg, {
        onSuccess: function (message) {
            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            console.log(message);
            $('.content_box').append(`<p>${val}</p>`);
             //聊天框默认最底部
            $(".message input").val("");
            $(document).ready(function () {
                $(".content_box").scrollTop($(".content_box")[0].scrollHeight);
            });
            console.log("Send successfully");
        },
        onError: function (errorCode,message) {
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                    info = '在黑名单中，无法向对方发送消息';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                    info = '不在讨论组中';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                    info = '不在群组中';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                    info = '不在聊天室中';
                    break;
                default :
                    info = x;
                    break;
            }
            console.log('发送失败:' + info);
        }
    }
);
}
})
//我的余额
function getTopup(){
    $.ajax({
        url:"/Zoo/getTopup",
        type:"GET",
        success:function(data){
            console.log(data);
            $(".InfoRight span").html(data.topup);
        }
    })  
}
function setGift(id){
    $.ajax({
        url:'/Zoo/sendGift',
        type:'POST',
        data:{
            giftId:id,
            roomId:window.sessionStorage.getItem("roomid")
        },
        success:function(data){
                console.log(data);
                if(data.hasOwnProperty("status")&&data.status=='fail'){
                    alert("发送失败");
                }
                else{
                    alert("发送成功");
                    getTopup();
                }
        }

    })
}
function getGifts(){
    $.ajax({
        url:"/Zoo/getGifts",
        type:"GET",
        success:function(data){
            $.each(data,function(i,item){
                var html=`
                    <li data-id="${item.id}">
                        <div class="gifeImg">
                            <img src="${'http://www.zooseefun.net/data/'+item.path}" alt="">
                        </div>
                        <div class="gifeName">
                            ${item.name}
                        </div>
                        <div class="money">
                            ${item.price}嘻范币   
                        </div>
                    </li>
                `;
                $(".gife-list ul").append(html);
            })
        }
    })
}