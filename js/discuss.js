$(function(){
		getFontSize();
		//getDisInfo(animalId);
		
		var mescroll = new MeScroll("mescroll", {
				down: {
					auto:false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
					callback: downCallback, //下拉刷新的回调
				},
				up: {
					auto:true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
					callback: upCallback, //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }	
					noMoreSize:5,
					page:{
						num:0,
						size:10,
						time:null
					}
				},
				noMoreSize:5,
				//clearEmptyId: "dataList"
		 });	
		$(".discuss_con").on('click','.dis_con_pic .pic_panel li img',function(e){
				e.preventDefault();
				e.stopPropagation();
				var imgsurl=[];
				var nowurl=$(this).attr('src');
				var item=$(this).parent().parent().find('li');
				for(var i=0;i<item.length;i++){
					imgsurl[i]=item.eq(i).find('img').attr('src');
				}
				wx.previewImage({
					current:nowurl,
					urls:imgsurl
				});
				console.log(imgsurl);
				console.log(nowurl);
	})
/*下拉刷新的回调 */
var animalId=1;
//var page={num:1,size:10}
function downCallback(pgae){
	//联网加载数据
//	getDisInfo(animalId,true);
getListDataFromNet(1,10, function(curPageData,totalSize){
					//联网成功的回调,隐藏下拉刷新的状态
					//mescroll.resetUpScroll(); 
					console.log(curPageData);
					mescroll.endSuccess();
					//console.log("page.num="+page.num+", page.size="+page.size+", curPageData.length="+curPageData.length);
					//设置列表数据
					setListData(curPageData,false);
		}, function(){
					//联网失败的回调,隐藏下拉刷新的状态
	                mescroll.endErr();
	});
	
}
/****上拉加载*******/

function upCallback(page){
	getListDataFromNet(page.num, page.size, function(curPageData,totalSize){
		//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
		//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
		console.log("page.num="+page.num+", page.size="+page.size+", curPageData.length="+curPageData.length);
		console.log(totalSize);
		//方法一(推荐): 后台接口有返回列表的总页数 totalPage
		//mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)
		
		//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
		//mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)
		
		//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
		//mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)
		
		//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
	 	 mescroll.endBySize(curPageData.length,totalSize);
		
		//设置列表数据
		setListData(curPageData, true);
	}, function(){
		//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr();
	});
}
function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        		//getDisInfo();
            	//联网成功的回调
            	$.ajax({
					url:'/Zooplus/weixincomment',
					type:'post',
					data:{
						pageNum:pageNum,
						pageSize:pageSize,
						animalId:animalId,
						role: "getAll"
					},
					success:function(data){
						mescroll.endSuccess();
						var data=JSON.parse(data); 
				 	    console.log(data.totalNum);
					    successCallback&&successCallback(JSON.parse(data.listResult),data.totalNum);  
					},
					error:function(){
						//联网失败的回调
			    		errorCallback&&errorCallback();
					}
				})
        	
}
//function getDisInfo(){
//	$.ajax({
//		url:'/Zooplus/weixincomment',
//		type:'post',
//		data:{
//			pageNum:page.num,
//			pageSize:page.size,
//			animalId:animalId,
//			role: "getAll"
//		},
//		success:function(data){
//			mescroll.endSuccess();
//			var data=JSON.parse(data); 
//			   successCallback&&successCallback(data.listResult,data.totalNum);  
//		},
//		error:function(){
//			//联网失败的回调
//  		errorCallback&&errorCallback();
//		}
//	})
//}
function setListData(curPageData,isAppend){
	//console.log(typeof(curPageData));
	console.log(curPageData);
	  const baseUrl="http://www.eliter.cn/Zooplus/";
			var $container=$(".discuss_con>ul");
			if(isAppend==false){
				$container.html("");
			}
			$.each(curPageData, function(i,item){
				var userInfo=getUserInfo(item.userId);
				console.log(userInfo);
				var userInfoHtml=`
					<div class="dis_anthor_info">
						<span class="dis_anthor_info_pic">
						    <img src="${userInfo.pic}"/>
						</span>
						<span class="dis_anthor_info_name">
							${userInfo.nickname}
						</span>
					</div>
				`;
				var content=`<div class="dis_con_text">
				            ${item.content}
			        </div>`;
				var $li=$("<li>");
				$li.append(userInfoHtml);
				$li.append(content);
				if(item.commPicList.length>0){
					var picContainer=$("<div class='dis_con_pic'>");
					var ulPanel=$("<ul class='pic_panel'>");
					ulPanel.appendTo(picContainer);
					for(var j=0;j<item.commPicList.length;j++){
						var htm=`<li><img src="${baseUrl+item.commPicList[j]}"></li>`
						//ulPanel.html(`<li><img src="${baseUrl+item.commPicList[j]}"></li>`);
						ulPanel.append(htm);
					}
			      picContainer.appendTo($li);
			 }		
			  $container.append($li);
    })
}
function getUserInfo(userId){
	var UserInfo=$.ajax({
		url:'/Zooplus/weixincomment',
		async:false,
		type:'post',
		data:{
			userId:userId,
			role:'getUserInfo'
		}
	})
	return JSON.parse(UserInfo.responseText);
}
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
})