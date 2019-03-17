$(function(){
    var mySwiper = new Swiper ('.Zoodetail .swiper-container', {
        loop: true,
        // 如果需要分页器
        autoplay:3000,
        pagination: '.swiper-pagination',
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        onInit: function(swiper){
        }
    })
    //获取动物园id
    var id = GetQueryString("id"); 
    getZooDetail(id);
    function getZooDetail(id){
        $.ajax({
            url:'/Zoo/getZooDetail',
            data:{
                zooid:id
            },
            success:function(data){
                for (let i=0;i<data.path.length;i++){
                    var html=`
                        <div class="swiper-slide">
                            <img src="${'http://www.zooseefun.net/data/'+data.path[i]}" alt="">
                        </div>
                    `;
                    $(".Zoodetail .swiper-wrapper").append(html);
                }
                $(".header_tit h1").html(data.name);
                $(".Zoodetail .intr").html(data.detail);
            }
        })
    }
})