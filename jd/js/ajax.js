var $={
    ajax:function(options){
        var xhr=null;                               //XMLHttpRequest对象
            url=options.url,                        //url地址
            method=options.method ||'get'           //  ||的含义是‘或者’ ，传输方式，默认为get
            async=typeof (options.async)==="undefined"?true:options.async;
            /**判断是否定义过。
            如果没有定义过，其结果为undefined，所以输出为true即为异步，
            反之为options.async，即其定义的属性 */
            data=options.data||null,                //参数
            params='',                              //设置一个变量存放data数据
            callback=options.success;               //ajax请求成功的回调函数
            error=options.error;                    //获取error函数
            //将data的对象字面量形式转换为字符串形式
            if(data){
                for(var i in data){                 //遍历所有data的值
                    params+=i+'='+data[i]+'&';      //params=username+18031229283+&+pwd123123+第二个params
                }
                params=params.replace(/&$/,"");     //将所有以&结尾的params，其结尾的'&'replace为空
               
            }
            //判断···根据method的值get或者post改变url地址写法
            if(method==="get"){
                url+='?'+params;
            }
        if(typeof XMLHttpRequest != "undefined"){
            xhr =new XMLHttpRequest();
        }else if(typeof ActiveXObject != "undefined"){
            // 将所有可能出现的ActiveXObject版本放在一个数组中
            var xhrArr = ['Microsoft.XMLHTTP','MSXML2.XMLHTTP.6.0','MSXML2.XMLHTTP.5.0','MSXML2.XMLHTTP.4.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP.2.0'];
            // 遍历创建XMLHttpRequest对象
            var len = xhrArr.length;
            for(var i = 0;i<len;i++){
                try{
                    // 创建XMLHttpRequest对象
                    xhr = new ActiveXObject(xhrArr[i]);
                    break;
                }
                catch(ex){

                }
            }
        }else{ 
            throw new Error('No XHR object availabel.');
        }
        xhr.onreadystatechange=function(){
            if(xhr.readyState === 4){
                if((xhr.status>=200 && xhr.status<300)||xhr.status === 304){    //若此项成立，执行下一行代码，即callback回调函数
                    callback && callback(JSON.parse(xhr.responseText))        //数据通过callback转为json.parse格式传回
                }else{
                    error && error();                                         //失败后执行error函数
                }
            }
        }
        //创建发送请求
        xhr.open(method,url,async);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    xhr.send(params);
    },
    jsonp:function(){

    }
}



