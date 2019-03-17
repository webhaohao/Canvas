$(function(){
    //获取动物园id
    var id = GetQueryString("id"); 
    getUserImage(id);
    function getUserImage(id){
        $.ajax({
            url:'/Zoo/getImage',
            data:{
                animalid:id
            },
            success:function(data){
                console.log(data);
                $.each(data,function(i,item){
                    var html=`
                         <div class="col-xs-3">
                                <img src="${'http://www.zooseefun.net/Zoo'+item}"/>
                         </div>
                    `;
                    $(".myPic .row").append(html);
                })
                
            }
        })
    }
  
})