function $(name,obj){
	//如果有obj就获取obj下的元素，如果没有传obj，就走document
	obj = obj || document; 
	//将传入参数的第一位获取出来。
	var oTag = name.charAt(0);
	//获取页面中所有的元素标签（为了从所有标签下去找我们想要的className）
	var aEle = obj.getElementsByTagName('*');
	//创建一个空数组(存放找到的className)
	var arr = [];
	//如果传入的是id
	if(oTag === '#'){
		//将#后面的字符串截取出来
		var Id = name.substring(1);
		//返回id获取方式
		return document.getElementById(Id);
	}else if(oTag === '.'){
		var aClass = name.substring(1);
		//循环所有的元素（目的为了通过找到所有带className的标签）
		for(var i=0;i<aEle.length;i++){
			//console.log(aEle[i].className);
			//将className用空格分隔出来
			var aSplit = aEle[i].className.split(' ');
			
			//console.log(aSplit);
			//循环所有分隔出来的className,去和传进来的className匹配
			for(var j=0;j<aSplit.length;j++){
				if(aSplit[j]== aClass){ //如果匹配就把找到的元素存到数组中
					arr.push(aEle[i]);
					break;  //当已经找到了，就不再循环了
				}
			}
		}
		return arr;//把已经找到的元素标签返回出去给外面用
	}else{
		//如果不是class也不是id，就走tagName获取。
		return obj.getElementsByTagName(name);
	}
	
}