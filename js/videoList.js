$(function(){
    $.ajax({
        url:'/Zoo/getRoomList',
        type:'GET',
        success:function(data){
            console.log(data);
          $.each(data,function(i,item){
                    var html=`
                        <li data-roomId="${item.roomid}" data-url="${item.videourl[2].urlInfo.originPullUrl}" data-roomname="${item.roomname}">
                            <div class="videoCon"></div>
                            <div class="roomName">
                                    ${item.roomname}
                            </div>
                        </li>
                    `;
                    $(".videoList ul").append(html);
          })  
            
        },
        error:function(){

        }
    })
    $(".videoList ul").on('tap','li',function(){
           var roomid= $(this).data('roomid');
           var videoUrl=$(this).data('url');
           var roomname=$(this).data('roomname');
           window.sessionStorage.setItem('roomid',roomid);
           window.sessionStorage.setItem('videoUrl',videoUrl);
           window.sessionStorage.setItem('roomName',roomname)
           location.href='./video.html';
    })  
})