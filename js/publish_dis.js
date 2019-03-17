$(function(){
	$(".z_file").on("touchstart",function(){
		wxChooseImage();
		console.log(images.localId);
	})
	$("#submit").on('click',function(){
		var wxUserInfo = window.localStorage.getItem("wxUserInfo");
		var content=$(".text-panel textarea").val();
		var animalId=1;
		var picList=mediaId.join(",");
		console.log(picList);
		if($.trim(content)==""){
			alert("请添加分享的内容！");
			return;
		}
		 $.ajax({
		 	ansyc:false,
		 	url:'/Zooplus/weixincomment',
		 	type:'post',
		 	data:{
		 		animalId:animalId,
		 		userId:wxUserInfo,
		 		content:content,
		 		picList:picList,
		 		role: "addComment"
		 	},
		 	success:function(msg){
		 	 var msg=JSON.parse(msg);
		 	  alert(msg.status);
	 	      location.href="http://"+location.hostname+"/Zooplus/discuss.html";
		 	}
		 })
	})
});	
var images = {
    localId: [],
    serverId: []
    };
 var img_count = 4;
 var mediaId=[];
//选择图片
function wxChooseImage(obj){
	  wx.chooseImage({
	  count:img_count, // 默认9
	  sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
	  sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
      images.localId=res.localIds;
        img_count = img_count=0?img_count:img_count-images.localId.length;
        if(img_count==0){
        	$(".z_file").css('display','none');
        }
        for(var i=0;i<images.localId.length;i++){
        	//alert(images.localId[i]);
        	var html='';
        	html=`
        		<section class='up-section loading'>
        		   <img  class="up-img" src='${images.localId[i]}'/>
        		</section>
        	 `;
        	$(".z_photo").prepend(html);
        }
       syncUpload(images.localId);
         // alert(images.localId.length);
      }
    });
}
   //上传图片
 function syncUpload(localIds){
    var localId = localIds.pop();
    wx.uploadImage({
        localId: localId,
        isShowProgressTips: 1,
        success: function (res) {
            var serverId = res.serverId; // 返回图片的服务器端ID
			mediaId.push(serverId);
			//alert(mediaId.length);
            //其他对serverId做处理的代码
            if(localIds.length > 0){
                syncUpload(localIds);
            }
        }
    });
}	