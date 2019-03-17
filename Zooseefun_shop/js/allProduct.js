$(function(){
        var tabsSwiper = new Swiper('#tabs-container',{
                //autoplay:1000,
                speed:500,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
                onInit:function(){
                    $('.tabs .swiper-slide').eq(0).find('a').addClass('active');	
                }, 		
                onSlideChangeStart: function(){
                    $(".tabs a.active").removeClass('active');
                    $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active')  
                }
            })

        allProduct();
        getSeal();

        getAllType().then(function(data){
            console.log(data);
            $.each(data,function(i,item){
                var html=`
                    <div class="swiper-slide">
                        <a href="javascript:;" data-id="${item.productclassifyid}">
                            ${item.classify}
                        </a>
                    </div>
                `;
               $(".tabs .swiper-wrapper").append(html); 
               var tabsContentHtml=`
                     <div class="swiper-slide">
                        <div class="Zoo_hot" id="allProduct">
                            <div class="container">
                                <div class="Zoo_hot_wrapper">
                                    <ul>
                                    </ul>
                            </div>
                        </div>	            
                     </div>
               ` 
               $("#tabs-container .swiper-wrapper").append(tabsContentHtml);
            })
            var tabsNav=new Swiper('.tabs',{
                freeMode : true,
                slidesPerView : 'auto',
                onInit:function(){
                //	$('.tabsNav .swiper-slide').eq(0).find('a').addClass('active');	
                } , 
                onTap:function(swiper,event){
                    var id=$(event.target).data("id");
                    var index=$(event.target).parent().index();
                    console.log(index);
                    if(id){
                        getTypeDetail(id,index);
                    }
                    tabsSwiper.slideTo(tabsNav.clickedIndex,500,function(){
                // $('.tabsNav .swiper-slide').eq(tabsNav.clickedIndex).addClass('active');
                })
                }
            })
        })
})
//获取动物对应的印章
function getSeal(){
    new Promise(function(resolve,reject){
        $.ajax({
            url:'/Zoo/getSeal',
            success:function(data){
                var list=[];
                for(let i=0;i<data.length;i+=8){
                    list.push(
                        data.slice(i,i+8)    
                    )
                }
                console.log(list);
                resolve(list); 
            }
        })
    }).then(function(data){
         console.log(data);
         $.each(data,function(i,item){
            var html="";
             console.log(item);
              html+=`
                <div class="swiper-slide">
                        <div class="head_wrapper">
                            <ul>`;
                for(let j=0;j<item.length;j++){
                            html+=`
                            <li>
                                <a href="animate.html?animalId=${item[j].animalid}">
                                    <img src="${item[j].url}" alt="" />
                                </a>
                            </li>	
                        `
                }         
                    html+=`
                                </ul>
                                </div>
                    </div>
                    `
                ;
             $(".banner .swiper-wrapper").append(html);       
         })
         var mySwiper = new Swiper ('.banner .swiper-container', {
            //loop: true,
            // 如果需要分页器
            observer:true,//修改swiper自己或子元素时，自动初始化swiper 
            observeParents:true,//修改swiper的父元素时，自动初始化swiper 
            pagination: '.swiper-pagination',
         }) 
    })
}
//全部商品
function allProduct(){
    $.ajax({
        url: "/Zoo/getAllProduct",
        success:function(data){
            // var data=JSON.parse(data);
            $.each(data,function(i,item){    
                var html=`
                    <li>
                        <div class="prodcut_list_img">
                            <a href="product_detail.html?productId=${item.productid}"><img src="${item.path}" alt=""/></a>
                        </div>
                        <h5>${item.name}</h5>
                        <div class="product_msg">
                            <div class="price">
                                <b>￥${item.price}</b>
                            </div>
                            <div class="product_btn">
                                <a href="${item.productid}" class="go_shopping"></a>
                            </div>
                        </div>
                    </li>
                `;
                $("#allProduct ul").append(html);
            }) 
        },
        error:function(){

        }
    })
}
//获取商品分类
function getAllType(){
   return new Promise(function(resolve,reject){
        $.ajax({
            url:"/Zoo/getProductClassify",
            success:function(data){
                 console.log(data)
                 resolve(data);
            }
       })
    })
}
//获取商品分类详情
function getTypeDetail(id,idx){
    $.ajax({
        url:'/Zoo/getProductByClassify',
        data:{
            classifyId:id
        },
        success:function(data){
            console.log(data);
            $("#tabs-container .swiper-slide").eq(idx).find('ul').empty(); 
            $.each(data,function(i,item){   
                var html=`
                    <li>
                        <div class="prodcut_list_img">
                            <a href="product_detail.html?productId=${item.productid}"><img src="${item.path}" alt=""/></a>
                        </div>
                        <h5>${item.name}</h5>
                        <div class="product_msg">
                            <div class="price">
                                <b>￥${item.price}</b>
                            </div>
                            <div class="product_btn">
                                <a href="${item.productid}" class="go_shopping"></a>
                            </div>
                        </div>
                    </li>
                `;
                $("#tabs-container .swiper-slide").eq(idx).find('ul').append(html);
            }) 
        }
    })
}