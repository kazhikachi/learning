/*------------------声明全局变量------------------*/

var index=0, //当前显示图片的索引，默认值为0 索引名称index
	timer=null,  //定时器
	bannerCenter=byId("banner-center"),	
	prev = byId("prev"),  //上一张
	next = byId("next"),  //下一张
	pics=byId("swiper").getElementsByTagName("div"),   //获取swiper标签中div的个数   *注意getElements和没有s的区别
	dots=byId("dots").getElementsByTagName("span"),
	bannerLeft=byId("banner-left"),
	banner=byId("banner"),
	menuBox=byId("menu-box"),
	menuItems=menuBox.getElementsByClassName("menu-item"),
	subMenu=byId("sub-menu"),
	innerBox=subMenu.getElementsByClassName("inner-box"),
	size=pics.length;	//设置index长度为size
	
	



/*----------------------封装----------------------*/

// 封装gerElemenById()
function byId(id){
	return typeof(id)==="string" ? document.getElementById(id):id;
}

/*封装通用事件绑定方法
	element:绑定事件的DOM元素
	事件名
	事件处理程序
*/

function addHandler(element,type,handler){
	//非IE浏览器判定
	if(element.addEventListener){
		element.addEventListener(type,handler,true);
	}
	//开始判断IE浏览器支持DOM 2还是DOM 0
	//IE浏览器支持DOM2级
	else if(element.attachEvent){
		element.attachEvent("on"+type,handler);
	}
	//IE浏览器支持DOM0级
	else{
		//next.onclick=function 此为DOM 0标准写法。
		//next["onclick"]=****与上述写法相同，任何有.*的地方都可用["*"]来代替。
		//对应写法，不能直接写element.type。原因：type不是事件，而是接受事件的变量。
		element["on"+type]=handler;
	}
}

//自动轮播
function startAutoPlay(){
	timer=setInterval(function(){
		index++;
		if(index>=size) index=0;
		changeImg();
	},3000)  //3000为3秒
}

//将相同代码封装,优化代码性能。
//此封装为切换图片
function changeImg(){
	//遍历所有图片，将图片隐藏，将圆点的类清除。
	for(var i=0;i<size;i++){
		pics[i].style.display="none";
		dots[i].className="";     //dots数量和背景图的数量要保持一致。
	}
	//显示当前图片
	pics[index].style.display="block";
	//当前圆点高亮显示
	dots[index].className="active";
}




/*----------------------调用----------------------*/


// 开始调用封装后的事件绑定方法
// 点击下一张按钮，显示下一张图片
addHandler(next,"click",function(){
	index++;
	if(index>=size) index=0;
	changeImg();
})
  
// 点击上一张按钮，显示上一张图片
addHandler(prev,"click",function(){
	index--;
	if(index<0) index=size-1;
	changeImg();
})

//点击圆点索引
for(var d=0;d<size;d++){
	dots[d].setAttribute("data-id",d);    //data-id为自定义名称，同时包含横线，所以用setAttribute更严谨
	addHandler(dots [d],"click",function(){
		index=this.getAttribute("data-id");  
		changeImg();
	})	
}
 
//清除定时器，停止自动轮播
function stopAutoPlay(){
	if (timer) {   //默认代码if(true)。此段代码为：当timer为true时(即timer内存在代码)，开始clear"timer"
		clearInterval(timer);
	}
}

//鼠标滑过主菜单
for (var m=0,idx,mlen,mlen=menuItems.length;m<mlen;m++){
	//给主菜单定义属性，表明索引。*索引要写在绑定事件之外
	menuItems[m].setAttribute("data-index",m);
	addHandler(menuItems[m],"mouseover",function(){
		
		//显示子菜单所在背景(取消hide)
		subMenu.className="sub-menu";
		//获取当前主菜单索引
		idx=this.getAttribute("data-index");
	
		//遍历所有的子菜单innerBox，将其隐藏
		for (var j=0,jlen=innerBox.length;j<jlen;j++){
			//隐藏所有的子菜单
			innerBox[j].style.display="none";

			//所有主菜单取消背景
			menuItems[j].style.background="none";
		}
		//找到所有的子菜单，将其显示
		innerBox[idx].style.display = "block";
		menuItems[idx].style.background="rgba(0,0,0,0.1)";
	})
}


//鼠标离开banner，隐藏子菜单
addHandler(bannerLeft,"mouseout",function(){
	subMenu.className="sub-menu hide";
	menuItems[idx].style.background="";
})

//鼠标滑入子菜单时，子菜单显示
addHandler(subMenu,"mouseover",function(){
	this.className="sub-menu";
	menuItems[idx].style.background="rgba(0,0,0,0.1)";
})

//鼠标划入banner-center，停止轮播
addHandler(bannerCenter,"mouseover",stopAutoPlay);

//鼠标划出banner-center，开始轮播
addHandler(bannerCenter,"mouseout",startAutoPlay);

//开启自动轮播
startAutoPlay();



/*----------------------示例----------------------*/

/* 
点击圆点索引切换图片(失败)
失败原因：当d=3时跳出循环，因为function的作用域，所以d的值恒为最终值，也就是3
解决方法1：闭包
-----------------------------------
for(var d=0;d<size;d++){
	addHandler(dots[d],"click",function(){
		console.log(index);
	})
}
-----------------------------------
*/





  
/* 
----------------------------------------------
DOM 2级别事件，顺序响应绑定的事件。
next.addEventListener("click",function(){
	alert("1");
});

next.addEventListener("click",function(){
	alert("2");
});
----------------------------------------------
DOM 0级别事件，只能响应最后绑定的事件。
next.onclick=function(){
	alert("1")
}

next.onclick=function(){
	alert("2")
}
----------------------------------------------
*/