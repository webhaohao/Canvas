$(function(){
    var animalId=window.sessionStorage.getItem("animalId");
    getBanner(animalId);
    getBlast(animalId);
    zooPopluar(animalId); 
    //alert(wxUserInfo); 
    $(".animateTit").click(function(){
        location.href="./animate.html?animalId="+animalId;
    })
    $(".zooHot_tit").click(function(){
        location.href="./allProduct.html";
    })
})
function getBanner(animalId){
    $.ajax({
        url:'/Zoo/getBanner',
        //ansyc:false,
        type:'get',
        dataType:'json',
        data:{
           animalID:animalId
        }, 
        success:function(data){
            var html="";
           // alert();'
             for(var i=0;i<data.length;i++){
                    html=`
                        <div class="swiper-slide">
                           <a href="product_detail.html?productId=${data[i].productId}">
                                <img src="${data[i].img}" alt="" />
                            </a>
                        </div>
                        `; 
                   $(".banner .swiper-container .swiper-wrapper").append(html); 
                           
            }
            var mySwiper = new Swiper ('.banner .swiper-container', {
                 loop: true,
                 // 如果需要分页器
                 autoplay:3000,
                 pagination: '.swiper-pagination',
                 observer:true,//修改swiper自己或子元素时，自动初始化swiper
                 observeParents:true,//修改swiper的父元素时，自动初始化swiper
                 onInit: function(swiper){
                 }
             })
             //mySwiper.reLoop();
        },
        error:function(){
            alert('fail');
        }   
    })
}
/************获取爆款*************/
function getBlast(animalId){
    $.ajax({
        url:'/Zoo/getBlast',
        type:'get',
        data:{
            animalID:animalId
        }, 
        success:function(data){
            console.log(data);
            var html="";
            var s_html="";
            var proList_html="";
            // var s2_html="";
            var i;
            var animalList=data;
            $.each(animalList,function(i,item){
                // console.log(i);
                // console.log(item);
                if(i==0){
                    html=`
                        <div class="left_hot_product_img">
                            <a href="./product_detail.html?productId=${item.productid}">
                                <img src="${item.path}" alt="" />
                            </a>
                        </div>
                        <div class="hot_product_tit">
                            <h5 class="ellipsis-1">${item.name}</h5>
                        </div>
                        <div class="product_msg">
                                <div class="price">
                                    <b>￥${item.price}</b>
                                </div>
                                <div class="product_btn">
                                    <a href="${item.productid}" class="go_shopping"></a>
                                </div>
                        </div>
                    `  
                    $(".hot_sale .hot_wrapper>.left_hot_product").append(html); 
                }
    
                if(i>0&&i<=2){
                        s_html=`
                            <div class="right_hot_product_small">
                                <div class="right_hot_product_img">
                                    <a href="./product_detail.html?productId=${item.productid}">
                                        <img src="${item.path}" alt=""/>
                                    </a>  
                                </div>
                                <div class="right_hot_product_msg">
                                    <div class="product_small_tit">
                                        <h5 class="ellipsis-1">${item.name}</h5>
                                    </div>
                                    <div class="product_info">
                                        <div class="price">
                                        <b>￥${item.price}</b>
                                    </div>
                                    <div class="product_small_btn">
                                        <a href="${item.productid}" class="go_shopping"></a>
                                    </div>
                                </div>
                            </div>
                     `;
                     console.log(s_html);
                    $(".hot_sale .hot_wrapper>.right_hot_product").append(s_html);
                }
                if(i>=3){
                    proList_html=`<li>
                        <div class="right_hot_product_small">
                            <div class="right_hot_product_img">
                                <a href="./product_detail.html?productId=${item.productid}">
                                    <img src="${item.path}" alt=""/>
                                </a>  
                            </div>
                            <div class="right_hot_product_msg">
                                <div class="product_small_tit">
                                    <h5 class="ellipsis-1">${item.name}</h5>
                                </div>
                                <div class="product_info">
                                    <div class="price">
                                    <b>￥${item.price}</b>
                                    </div>
                                    <div class="product_btn">
                                        <a href="${item.productid}" class="go_shopping"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                </li>`; 
                $(".product_list ul").append(proList_html);
                }
            })       
            //$(".right_hot_product").html(s_html); 
            console.log(s_html);
          // $(".hot_sale .hot_wrapper>.right_hot_product").append(s2_html);
            //console.log($(".hot_sale .hot_wrapper").html());
        },
        error:function(){
            alert('fail');
        }   
    })

}

/*********获取园内热品*****************/
function zooPopluar(){
    $.ajax({
        url:'/Zoo/getHot',
        type:'get',
        dataType:'json',
        success:function(data){
            var html="";
            var zooPopList=data;
            console.log(zooPopList);
            $.each(zooPopList,function(i,item){
                html+=`
                        <li>
                            <div class="prodcut_list_img">
                               <a href="./product_detail.html?productId=${item.productid}">
                                 <img src="${item.path}" alt=""/>
                               </a>  
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
                `
            })  
            $("#Zoo_hot .Zoo_hot_wrapper ul").append(html);
        },
        error:function(){
            alert('fail');
        }   
    })

}