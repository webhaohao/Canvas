var p=new Promise((res,rej)=>{
    //setTimeout(()=>{
        res("111");
    //})
})
//var x=function (){
   var  x = p.then(res=>{
            console.log(res);
            return res;
   })
   
//}
console.log(x);