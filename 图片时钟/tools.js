function $(selector,context){
	var firstChar = selector.charAt(0);
	context = context || document;
	if( firstChar === "#" ){
		return document.getElementById(selector.substring(1));
	}else if(firstChar === "."){
		return context.getElementsByClassName(selector.substring(1));
	}else{
		return context.getElementsByTagName(selector);
	}	
}
