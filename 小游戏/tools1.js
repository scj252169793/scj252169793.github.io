
function $(selector,content){
	var firstChar = selector.charAt(0);
	content = content || document;
	if( firstChar === '#' ){
		return document.getElementById(selector.slice(1));
	}else if(  firstChar === '.'  ){							// 通过 class  来获取 元素
		var allElement = document.getElementsByTagName('*');   	//首先获取所有元素
		var arr =[];											// 定义一个数组 用来储存获取到的 元素
		for( var i = 0; i < allElement.length ; i++ ){          
			 var classname = allElement[i].className;           //循环所有的元素 并获取其的className
			 var classArr = classname.split(' ');				// 把该元素的 className 解析为数组 用空格分开
			 for( var j = 0; j < classArr.length ; j++ ){       // 循环该元素的className 每一项 如果有一项与传入的 selector.slice(1) 相同 
			 	if( classArr[j] == selector.slice(1) ){			// 则表示该元素 有其 class 并把它放入 数组( arr ) 中 
			 		arr.push( allElement[i] );          
			 		break;                                      // 同事停止该循环
			 	}
			 }
		};
		return arr;                                             //最后输出 该数组中的所有 元素;
	}else{
		return content.getElementsByTagName(selector);
	}
}
function getStyle(obj,attr){     //获取样式
	if( obj.currentStyle ){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj)[attr];s
	}
};
function doMove(obj,attr,speed,target,callBack){    //封装函数 设置参数     控制对象、控制属性、速度、最终值、达到最终值运行的函数
	if( obj.timer ) return;							//运行函数式，如果 该定时器存在  则停止函数运行，否则 运行该函数
	var num = parseFloat( getStyle( obj,attr ) );	// 当前该属性的值
	speed = num > target ? -Math.abs(speed) : Math.abs(speed); //判断 目前属性 与 目标属性的大小 如果 大 则 为减小，相反增加
	obj.timer = setInterval(function(){				// 开启定时器
		num += speed;								//每次增加值
		if(Math.abs(target-num) <= Math.abs(speed)){//判断 运行中的 num 值是否即将到达 目标属性 

			 //也可判断  speed > 0 && num >= target || speed < 0 && num <= target 

			num = target;							//即将到达目标属性则 使 num 值为目标值 （为了防止 与目标属性 微小相差）
			clearInterval(obj.timer);				//到达目标属性 关闭定时器
			obj.timer = null;					//清除该定时器
			obj.style[attr] = num + 'px';			
			(typeof callBack === "function") && callBack();  //判断 实参中有没有输入 运行的函数 没有则为
		}else{
			obj.style[attr] = num + 'px';
		}
	},30)
}
function shake(obj,attr,speed,callBack){                           //抖动
	if(obj.timer) return;   // 如果定时器还在运行则不执行函数
	var n = 0;				// 变量 n 用来控制数组的第 n 项
	var arr = [];			// 生成空的数组用来储存 设置的抖动范围
	for( var i = speed; i>0 ; i -= 3){
		arr.push(-i,i)         
	}
	arr.push(0);            //循环生成数组内容 并在数组的最后一个值加入 0 时期在最后回到初始位置
	var num = parseFloat(getStyle(obj,attr));  //获取 obj[attr] 的值
	obj.timer = setInterval(function(){        //生成定时器
		obj.style[attr] = num + arr[n] + 'px'; //把数组的 第n个值 赋给 obj[attr]
		n++;									// 增加n 值 为下次获取 数组的下一个值
		if( n > arr.length-1 ){           
			clearInterval( obj.timer );         //如果循环到数组的最后一个值 则停止定时器 并清空 obj.timer 的值
			obj.timer = null;
			if( typeof callBack === 'function' ){
				callBack();
			};
		}
	},30)
};
function futurefun(timeStr){
	var now = new Date();
	var future = new Date(timeStr);

	var time = (future.getTime() - now.getTime())/1000;

	var Day = Math.floor(time/86400);
	var Hour = Math.floor(time%86400/3600);
	var Minute = Math.floor(time%86400%3600/60);
	var Second = Math.floor(time%60);
	var onOff = true;
	if( time <= 0 ) onOff = false;
	var json = {
		D:Day,
		H:Hour,
		Min:Minute,
		S:Second,
		onOff:onOff,
	}
	return json;
};
function two(m){
	if(m<0) return m;
	if( m >= 10 ){
		return m;
	}else{
		return '0' + m;
	}
};