$(function(){
    getCodeInfo();
})

function getCodeInfo(){
    $.ajax({
        url:'/Zoo/getBuyCode',
        success:function(data){
            console.log(data);
            //var picArr=[];
            //var data=JSON.parse(data);    
            $.each(data,function(i,codeInfo){
                var html=`
			  	 	<div class="item">`;
			  	html+=` 	
			  	 	<div class="shopping_list_img">
			  	 	  <div class="swiper-container">
							  <div class="swiper-wrapper">
					`	
					for(let k=0;k<codeInfo.product.length;k++){
					html+=`	
						<div class="swiper-slide">
							<a href="javascript:;">
								<img src="${codeInfo.product[k].productUrl}" alt="" />
							</a>
						</div>
						`
					}
					  
					  	 		
				html+=`
							</div>
						</div>	  
			  	 	</div>`;
			  	html+=`<div class="shopping_list_info"><ul>`;
				  	 for(let j=0;j<codeInfo.product.length;j++){
		                html+=`
		                        <li class="clear">
		                            <span>${codeInfo.product[j].productName}</span>
		                            <b>x${codeInfo.product[j].count}</b>
		                        </li>
		                    `
	        		    }  	 		
				html+=`</ul></div>`;  	 
				html+=`  	 
				  	 	<div class="here_btn">
				  	 		<p>
				  	 			<span>在哪取</span>
				  	 		</p>
				  	 	</div>
				  	 	<div class="puckUp_code">
			  	 		<p>取货码:<span>${codeInfo.code}</span></p>
			  	 	</div>
			  	 	`;
			  	html+=`</div>`;	
			 $(".shopping_list .container").append(html); 
			 var mySwiper = new Swiper ('.shopping_list_img .swiper-container', {
			        loop: true,
			        // width:'auto',// 如果需要分页器
			        pagination: '.swiper-pagination',
			        pagination: '.swiper-pagination',
			        height:'1.85rem',
			        observer:true,//修改swiper自己或子元素时，自动初始化swiper
			        observeParents:true,//修改swiper的父元素时，自动初始化swiper
			 })  
            })
            //getProPic(picArr);
        },
        error:function(){

        }
    })
}
//function getProPic(picArr){
//  console.log(picArr);
//  for(var i=0;i<picArr.length;i++){
//   var html=`
//          <div class="swiper-slide">
//              <a href="javascript:;">
//                  <img src="${baseUrl+picArr[i]}" alt="" />
//              </a>
//          </div>
//      `;
//    $(".shopping_list_img .swiper-wrapper").append(html);  
//  }
//}