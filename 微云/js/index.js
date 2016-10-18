;(function (){
		//让下面这一块自适应屏幕的高度
		var weiyunContent = tools.$(".weiyun-content")[0];
		var header = tools.$(".header")[0];
		changeHeight();
		function changeHeight(){
		    var clinetH = tools.view().H;  //可视区的高
		    weiyunContent.style.height = clinetH - header.offsetHeight + "px";  
		  }
		  //绑定一个resize
		  tools.addEvent(window,"resize",changeHeight);
		  //准备数据
		  var datas = data.files;
		  //先渲染文件区域
	  function createFilesHtml(datas,id){
	    var childs = dataAction.getChildsById(datas,id);
	    var str = '';
	    for( var i = 0; i < childs.length; i++ ){
	      str += view.createFileConstruct(childs[i]);
	    }
	    return str;
    }
	  //文件区域的容器
	  var fileList = tools.$(".file-list")[0];
	  fileList.innerHTML = createFilesHtml(datas,0);
	  //文件导航区域
	  var pathNav = tools.$(".path-nav")[0];
	  pathNav.innerHTML = view.createPathNavConstruct(datas,0);
	  //菜单区域的容器
	  var treeMenu = tools.$(".tree-menu")[0];
	  treeMenu.innerHTML = view.createTreeHtml(datas,-1);

  	//--------------------渲染文件和导航和树形区域--------------------

		function renderFileNavTree(fileId){
		    //渲染文件区域
		    fileList.innerHTML = createFilesHtml(datas,fileId);
		    //导航区
		    pathNav.innerHTML = view.createPathNavConstruct(datas,fileId);
		    //定位到属性导航区中某一个菜单上
		    var prev = tools.getTreeById("tree-title",prevId);
		    var tree = tools.getTreeById("tree-title",fileId);
		    tools.removeClass(prev,"tree-nav");
		    tools.addClass(tree,"tree-nav");
		    prevId = fileId;
		    //重新生成了文件区域的文件结构，所以需要重新把checkbox绑定事件处理程序
		    checkboxAddEvent();
		}
    //找到那些被选中的file-item
    function whoSelect(){
        var arr = [];
        for( var i = 0; i < checkboxs.length; i++ ){
            if( tools.hasClass(checkboxs[i],"checked") ){
                arr.push(tools.parents(checkboxs[i],".file-item"));
            }
        }
        return arr;
    }
    //提示框的封装
    var fullTipBox = tools.$(".full-tip-box")[0];
    var fullText = tools.$(".text",fullTipBox)[0];
    function fullTip(classNames,message){
        fullTipBox.style.transition = "none";
        fullTipBox.style.top = "-32px";
        setTimeout(function (){
           tools.addClass(fullTipBox,classNames);
            fullTipBox.style.transition = ".3s";
            fullTipBox.style.top = 0;     
        },0);
        fullText.innerHTML = message;
        clearTimeout(fullTipBox.timer);
        fullTipBox.timer = setTimeout(function (){
            fullTipBox.style.top = "-32px";   
        },2000);
    }
  
  //-----------------文件区域的功能--------------------
    tools.addEvent(fileList,"mouseover",function (ev){
        if( isDrag ) return;
        var target = ev.target;
        if( target = tools.parents(target,".file-item") ){
          tools.addClass(target,"file-checked");
        }
    });
    tools.addEvent(fileList,"mouseout",function (ev){
        var target = ev.target;
        if( target = tools.parents(target,".file-item") ){
            //找到这个元素中的checkbox
            var checkbox = tools.$(".checkbox",target)[0];
            if( !tools.hasClass(checkbox,"checked") ){
                 tools.removeClass(target,"file-checked");
            }
        }
    });
    var prevId = 0;  
    //文件区域
    tools.addClass(tools.getTreeById("tree-title",prevId),"tree-nav");
    tools.addEvent(fileList,"click",function (ev){
        var target = ev.target;
        if(target = tools.parents(target,".file-item")){
            var fileId = target.dataset.fileId;
            renderFileNavTree(fileId);
            tools.removeClass(checkedAll,"checked");
        }
        if(fileItems.length == 0){
       		fileList.style.background = "#ccc";
       }
        you();
    });
    //导航区域
    tools.addEvent(pathNav,"click",function (ev){
    	fileList.style.background = "";
        var target = ev.target;
        if( target = tools.parents(target,"a") ){
            var fileId = target.dataset.fileId;
            renderFileNavTree(fileId);
            tools.removeClass(checkedAll,"checked");
        } 
        you();
    });
    //树形菜单区域
    tools.addEvent(treeMenu,"click",function (ev){
        var target = ev.target;
        if( target = tools.parents(target,".tree-title") ){
            var fileId = target.dataset.fileId;
            renderFileNavTree(fileId);
            tools.removeClass(checkedAll,"checked");
        }
        if(fileItems.length == 0){
       		fileList.style.background = "#ccc";
       }else{
       		fileList.style.background = "";
       }
       you()
    });
    //全选按钮
    var checkedAll = tools.$(".checked-all")[0];
    //找到所有的文件
    var fileItems = tools.$(".file-item",fileList);
    //找到所有的checkbox
     var checkboxs = tools.$(".checkbox",fileList);
    tools.addEvent(checkedAll,"click",function (){
        var isAddClass = tools.toggleClass(this,"checked");
        if( isAddClass ){ 
            for( var i = 0; i < fileItems.length; i++ ){
                tools.addClass(fileItems[i],"file-checked");
                tools.addClass(checkboxs[i],"checked");
            }
        }else{
            for( var i = 0; i < fileItems.length; i++ ){
                tools.removeClass(fileItems[i],"file-checked");
                tools.removeClass(checkboxs[i],"checked");
            }
        }
    });
    tools.addEvent(checkedAll,"mousedown",function (ev){
          ev.stopPropagation();  
    })
    //给每一个checkbox添加点击处理程序
    checkboxAddEvent();
    you()
    function checkboxAddEvent(){
        for( var i = 0; i < checkboxs.length; i++ ){
          alone(checkboxs[i]);
        } 
    }
    function alone(checkbox){
          tools.addEvent(checkbox,"click",function (ev){
                var isAddClass = tools.toggleClass(this,"checked");
                if( isAddClass ){
                    if( whoSelect().length === checkboxs.length  ){
                        tools.addClass(checkedAll,"checked");
                    }
                }else{
                    tools.removeClass(checkedAll,"checked");
                }
                ev.stopPropagation();
            })
            tools.addEvent(checkbox,"mousedown",function (ev){
                ev.stopPropagation();
            })
    }
    //新建文件夹
    var create = tools.$(".create")[0];
    tools.addEvent(create,"click",function (ev){
    	fileList.style.background = "";
        if( this.isCreateFile ){
            return;
        }
        this.isCreateFile  = true;
        var html = view.createFileConstruct({
            id:tools.uuid()
        });
        fileList.innerHTML = html + fileList.innerHTML;
        var first = fileList.firstElementChild;
        var fileTitle = tools.$(".file-title",first)[0];
        var fileEdtor = tools.$(".file-edtor",first)[0];
        fileTitle.style.display = "none";
        fileEdtor.style.display = "block";
        var edtor = tools.$(".edtor",first)[0];
        edtor.focus();
        tools.addEvent(edtor,"click",function (ev){
            ev.stopPropagation();    
        });
        tools.addEvent(edtor,"mousedown",function (ev){
            ev.stopPropagation();    
        });
    });
    //点击document，判断是否新建
    tools.addEvent(document,"mousedown",function (){
        if( create.isCreateFile ){
            var first = fileList.firstElementChild;
            var fileTitle = tools.$(".file-title",first)[0];
            var fileEdtor = tools.$(".file-edtor",first)[0];
            var edtor = tools.$(".edtor",first)[0];
            var edtorVal = edtor.value.trim();
            //导航中最后一个元素
            var pathNavLast = tools.$("span",pathNav)[0];
            var pid = pathNavLast.dataset.fileId;
            if( edtorVal === "" ){  
                fileList.removeChild(first);
                 if(fileItems.length == 0){
                   	fileList.style.background = "#ccc";
                  }
            }else if(dataAction.reName(datas,pid,edtorVal)){
                fileList.removeChild(first);
                fullTip("warn","重名了");
            }else{ 
                fileTitle.innerHTML = edtorVal;
                fileTitle.style.display = "block";
                fileEdtor.style.display = "none";
                //向数据中添加一条新的文件信息
                var newFile = {
                    id: first.dataset.fileId,
                    pid:pid,
                    title:edtorVal,
                    type:"file"
                };
                datas.unshift(newFile);
                tools.removeClass(fullTips,"warn");
                //提醒
                fullTip("ok","新建文件夹成功");
                you()
                //要找到当前这个新建的文件的父级对应的左侧树形菜单
                var tree = tools.getTreeById("tree-title",pid);
                var nextUl = tree.nextElementSibling;
                nextUl.innerHTML += view.createTreeLi(datas,newFile);
                //要让有子数据的菜单有箭头
                tools.removeClass(tools.getTreeById("tree-title",pid),"tree-contro-none");
                tools.addClass(tools.getTreeById("tree-title",pid),"tree-contro");
                tools.removeClass(checkedAll,"checked");
                //给所有的checkbox添加事件处理
                checkboxAddEvent();
                fileList.style.background = "";
            }
            create.isCreateFile = false;
        }
    });
    //框选
    var newDiv = null;
    var disX = disY = 0;
    var shadowTarget = null;
    var tips = null;
    tools.addEvent(document,"mousedown",function (ev){
        var target = ev.target;
        ev.preventDefault(); 
        if( tools.parents(target,".handleFile") || 
            tools.parents(target,".tree-menu")  ||
            tools.parents(target,".lay-aside")  || checkboxs.length === 0
            || delect.delect || move.isMove
          ){
            return;
        }
        newDiv = null;
        disX = ev.clientX;
        disY = ev.clientY;
        //拖拽移动
        if( tools.parents(target,".file-item") ){
            tools.addEvent(document,"mousemove",moveFileFn);
            tools.addEvent(document,"mouseup",upFileFn);
            shadowTarget = tools.parents(target,".file-item");
            checkboxAddEvent();
            return;
        }
        tools.addEvent(document,"mousemove",moveFn);
        tools.addEvent(document,"mouseup",upFn);
        for( var i = 0; i < fileItems.length; i++ ){
            tools.removeClass(fileItems[i],"file-checked");
            tools.removeClass(checkboxs[i],"checked");
        }
        tools.removeClass(checkedAll,"checked");
    })
    var shadow = null;
    var isDrag = false;  
    var pengObj = null;  
    function moveFileFn(ev){
        if( Math.abs(ev.clientX - disX) > 10 ||  Math.abs(ev.clientY - disY) > 10 ){     
            if(!shadow){
                shadow = view.moveFileShadow();
                document.body.appendChild(shadow);
                shadow.style.display = 'block';
                tips = document.createElement("div");
                tips.style.cssText = 'width:30px;height: 30px;position:absolute;left:0;top:0;'
                document.body.appendChild(tips);
            }
            isDrag = true;
            tips.style.left = ev.clientX + 'px';
            tips.style.top = ev.clientY + 'px';
            shadow.style.left = ev.clientX+5 + 'px';
            shadow.style.top = ev.clientY+5 + 'px';
            if( !tools.hasClass(shadowTarget,"file-checked") ){
                //清空所有的
                for( var i = 0; i < fileItems.length; i++ ){
                    tools.removeClass(fileItems[i],"file-checked");
                    tools.removeClass(checkboxs[i],"checked");
                }
                tools.addClass(shadowTarget,"file-checked");
                var checkbox = tools.$(".checkbox",shadowTarget)[0];
                tools.addClass(checkbox,"checked");
            }
            //计数
            var selectArr = whoSelect();
            var sum = tools.$(".sum",shadow)[0];
            var icons = tools.$(".icons",shadow)[0];
            sum.innerHTML = selectArr.length;
            var str = '';
            var len = selectArr.length > 4 ? 4 : selectArr.length;
            for( var i = 0; i < len; i++ ){
                str += '<i class="icon icon'+i+' filetype icon-folder"></i> '
            }
            icons.innerHTML = str;
            pengObj = null;
            //碰撞检测
            for( var i = 0; i < fileItems.length; i++ ){
                //要碰撞的元素是否存在于被选中的数组中
                if(!indexOf(selectArr,fileItems[i]) && tools.duang(tips,fileItems[i])  ){
                    fileItems[i].style.background = "skyblue";
                    pengObj = fileItems[i];
                }else{
                    fileItems[i].style.background = "";
                }
            }
        }
    }
    function indexOf(arr,item){
        for( var i = 0; i < arr.length; i++ ){
            if( arr[i] === item ){
            return true;
            }
        }  
        return false;
    }
    function upFileFn(){
        tools.removeEvent(document,"mousemove",moveFileFn);
        tools.removeEvent(document,"mouseup",upFileFn);
        if( shadow ){
            document.body.removeChild(shadow);
            document.body.removeChild(tips);
            shadow = null;
        }   
        if( pengObj ){
                var moveId = pengObj.dataset.fileId;
                var selectArr = whoSelect();
                var childsTitle = dataAction.getChildsById(datas,moveId);
                var a = true;
                b:for( var i = 0; i < selectArr.length; i++ ){
                    a = true;
                    var getData = dataAction.getDataById(datas,selectArr[i].dataset.fileId);
                    //判断数据的 title
                    for( var j = 0; j < childsTitle.length; j++ ){
                        if( childsTitle[j].title == getData.title ){
                            fullTip("warn","部分移动失败,重名了");
                            a = false;
                            break;
                        }
                    }
                    if( a ){
                         getData.pid = moveId;
                    }  
                }
                //文件区域渲染
                var cur = tools.$(".current-path")[0].dataset.fileId;
                fileList.innerHTML = createFilesHtml(datas,cur);
                //菜单区域渲染
                treeMenu.innerHTML = view.createTreeHtml(datas,-1);
                //定位到某个菜单上
                tools.addClass(tools.getTreeById("tree-title",cur),"tree-nav");
                pengObj = null;
        }
        isDrag  =false; 
    }
    function moveFn(ev){ 
        if( Math.abs(ev.clientX - disX) > 20 ||  Math.abs(ev.clientY - disY) > 20 ){
            if( !newDiv ){
                newDiv = document.createElement("div");
                newDiv.className = "selectTab";
                newDiv.style.left = disX + "px";
                newDiv.style.top = disX + "px";
                document.body.appendChild(newDiv);
            }
            newDiv.style.width = Math.abs(ev.clientX - disX) + "px";
            newDiv.style.height = Math.abs(ev.clientY - disY) + "px";
            newDiv.style.left = Math.min(ev.clientX , disX)+1 + "px";
            newDiv.style.top = Math.min(ev.clientY , disY)+1 + "px";
            for( var i = 0; i < fileItems.length; i++ ){
                if( tools.duang(newDiv,fileItems[i]) ){
                   tools.addClass(fileItems[i],"file-checked");
                   tools.addClass(checkboxs[i],"checked");
                }else{
                   tools.removeClass(fileItems[i],"file-checked");
                   tools.removeClass(checkboxs[i],"checked");
                }
            }
        }  
    }
    function upFn(){
        tools.removeEvent(document,"mousemove",moveFn);
        tools.removeEvent(document,"mouseup",upFn);
        if( newDiv ) document.body.removeChild(newDiv);
        if( whoSelect().length === checkboxs.length ){
            tools.addClass(checkedAll,"checked");
        }
    }
    //删除
    var delect = tools.$(".delect")[0];
    tools.addEvent(delect,"click",function (){
        delect.delect = true;
        var selectArr = whoSelect();
        if( selectArr.length === 0 ) {
            fullTip("warn","请选择文件");
            delect.delect = false;
        }else{
        	zhao.style.display = "block";
            //删除 文件区域删除 树形菜单删除
            dialog({
                title:"删除文件",
                content:"<h4>确定要删除这个文件夹吗？</h4>",
                okFn:function (){
                    var idArr = [];
                    for( var i = 0; i < selectArr.length; i++ ){
                        fileList.removeChild(selectArr[i]);
                        var fileId = selectArr[i].dataset.fileId;
                        var tree = tools.getTreeById("tree-title",fileId);
                        tree.parentNode.parentNode.removeChild(tree.parentNode);
                        idArr.push(fileId);
                    }
                    dataAction.batchDelect(datas,idArr);   
                    delect.delect = false;
                    tools.removeClass(checkedAll,"checked");  
                    zhao.style.display = "none";
                    if(fileItems.length == 0){
                   		fileList.style.background = "#ccc";
                   }
                },
                noFn:function (){
                	delect.delect = false;
                	zhao.style.display = "none";
                },
                noFn1:function (){
                	delect.delect = false;
                	zhao.style.display = "none";
                }
            }) 
        }
    })
    //移动到
    var move = tools.$(".move")[0];
    tools.addEvent(move,"click",function (){
        var selectArr = whoSelect();
        if( selectArr.length === 0 ) {
            fullTip("warn","请选择要移动的");
        }else{
        	zhao.style.display = "block";
            move.isMove = true;
            var moveId = 0; 
            var isMove = true;
            dialog({
                title:"选择存储位置",
                content:view.moveDialogHtml(),
                okFn:function (){
                    //可以移动
                    if( !isMove ){
                        var childsTitle = dataAction.getChildsById(datas,moveId);
                        var a = true;
                        b:for( var i = 0; i < selectArr.length; i++ ){
                             a = true;
                            var getData = dataAction.getDataById(datas,selectArr[i].dataset.fileId);
                            //判断 title是否重名
                            for( var j = 0; j < childsTitle.length; j++ ){
                                if( childsTitle[j].title == getData.title ){
                                    fullTip("warn","部分移动失败,重名了");
                                    a = false;
                                    break;
                                }
                            }
                            zhao.style.display = "none";
                            if( a ){
                                 getData.pid = moveId;
                            }  
                        }
                        //文件区域渲染
                        var cur = tools.$(".current-path")[0].dataset.fileId;
                        fileList.innerHTML = createFilesHtml(datas,cur);
                        //菜单区域渲染
                        treeMenu.innerHTML = view.createTreeHtml(datas,-1);
                        //定位到某个菜单上
                        tools.addClass(tools.getTreeById("tree-title",cur),"tree-nav");
                        move.isMove = false;
                    }
                    if(fileItems.length == 0){
                   		fileList.style.background = "#ccc";
                   }
                    checkboxAddEvent();
                    return isMove;       
                },
                noFn:function (){
                	move.isMove = false;
                	zhao.style.display = "none";
                },
                noFn1:function (){
                	move.isMove = false;
                	zhao.style.display = "none";
                }
            }); 
            //弹框的父级
            var fullPop = tools.$(".full-pop")[0];
            //渲染弹框中的树形菜单
            var dirTree = tools.$(".dirTree",fullPop)[0];
            tools.addClass(dirTree,"tree-menu-comm");
            dirTree.innerHTML = view.createTreeHtml(datas,-1);
            //填写内容
            var fileName = tools.$(".file-name",fullPop)[0];
            var fileNum = tools.$(".file-num",fullPop)[0];
            var selectFirstId = selectArr[0].dataset.fileId;
            //错误信息提示
            var error = tools.$(".error",fullPop)[0];
            fileName.innerHTML = dataAction.getDataById(datas,selectFirstId).title;
            if( selectArr.length>1 ){
                fileNum.innerHTML = '等 '+selectArr.length+' 个文件 ';
            }
            var prevId = 0;
            tools.addEvent(dirTree,"click",function (ev){
                var target = ev.target;
                if( target = tools.parents(target,".tree-title") ){
                    isMove = false;
                    //点击菜单的那个id
                    var clickFileId = target.dataset.fileId;
                    tools.removeClass(tools.getTreeById("tree-title",prevId,dirTree),"tree-nav");
                    tools.addClass(target,"tree-nav");
                    prevId = clickFileId;
                    error.innerHTML = "";
                    //被移动的元素的父id
                    var firstSelectId = selectArr[0].dataset.fileId;
                    var parent = dataAction.getParent(datas,firstSelectId);
                    if( clickFileId == parent.id ){
                        error.innerHTML = "文件已经在当前文件夹下";
                        isMove = true;
                    }
                    for( var i = 0; i < selectArr.length; i++ ){
                        //找到选中元素的所有的子孙数据
                        var selectId = selectArr[i].dataset.fileId;
                        var childs = dataAction.getChildsAll(datas,selectId);

                        for( var j = 0; j < childs.length; j++ ){
                            if( childs[j].id == clickFileId ){
                                error.innerHTML = "不能移动到本身或子孙元素下";
                                isMove = true;
                                break;
                            }
                        }
                    }
                    moveId = clickFileId;
                } 
            })
        }
    })
    //////重命名/////
    var fullTips = document.getElementsByClassName('full-tip-box')[0]
	var rename = document.getElementsByClassName('rename')[0]
	tools.addEvent(rename, 'click', function() {
		if(whoSelect().length === 0) {
			fullTip("warn", "请选择文件！！！");
		}
		if(whoSelect().length > 1) {
			fullTip("warn", "请选择一个文件！！！");
		}
		if(whoSelect().length == 1) {
			var fileitems = document.getElementsByClassName('file-item')
			for(var i = 0; i < fileitems.length; i++) {
				if(tools.hasClass(fileitems[i], 'file-checked')) {
					//获取当前文件夹得id，通过id来渲染数据
					var fileid = fileitems[i].dataset.fileId;
					var spans = fileitems[i].getElementsByTagName('span')
					var inputs = fileitems[i].getElementsByTagName('input')[0]
					tools.addEvent(inputs, 'mousedown', function(ev) {
						ev.stopPropagation()
					})
					spans[0].style.display = 'none';
					spans[1].style.display = 'block';
					inputs.value = spans[0].innerHTML;
					inputs.focus();
					inputs.select();
				}
			}
			tools.addEvent(inputs,"mousedown",function (ev){
				ev.stopPropagation();   //阻止冒泡
			});
		    tools.addEvent(inputs,"click",function (ev){
		      	ev.stopPropagation();     //阻止冒泡
		    });
			function nones() {
				spans[0].innerHTML = inputs.value;
				spans[1].style.display = 'none';
				spans[0].style.display = 'block';
				//循环数据，改变该id的title
				for(var i = 0; i < datas.length; i++) {
					if(datas[i].id == fileid) {
						datas[i].title = inputs.value;
					}
				}
				//重新渲染左边树形菜单。treeMenu是左边的容器，createTreeHtml结构名称
				treeMenu.innerHTML = view.createTreeHtml(datas, -1);
				//获取最后一个span
				var currentPath = tools.$('.current-path')[0];
				//找到最后span的id
				var currentPathId = currentPath.dataset.fileId;
	
				//通过id找到对应的class名为tree-title标签
				var trre = tools.getTreeById('tree-title', currentPathId)
					//给这个标签添加背景的classname
				tools.addClass(trre, 'tree-nav');
				tools.removeClass(fullTips, 'warn');
				fullTip("ok", "重命名成功！！！");
				tools.removeEvent(document, 'mousedown', nones)
			}
			tools.addEvent(document, 'mousedown', nones);
			tools.addEvent(document, 'onkeydown', nones)
			document.onkeydown = function(ev){
				if(ev.keyCode == 13){
					nones();
					var fileItem = tools.$(".file-item"); 
					var aCheckbox = tools.$(".checkbox",fileItem[i]);
					for(var i = 0; i < fileItem.length; i++){
						tools.removeClass(fileItem[i],"file-checked");
						tools.removeClass(aCheckbox[i],"checked");
					}
					
				}
			}
		}
	})
   	//键盘事件
   	jianpan()
   	function jianpan(){
   		//键盘按下
   		document.onkeydown = function(ev){
   			if(ev.keyCode == 13){
		        if( create.isCreateFile ){
		            var first = fileList.firstElementChild;
		            var fileTitle = tools.$(".file-title",first)[0];
		            var fileEdtor = tools.$(".file-edtor",first)[0];
		            var edtor = tools.$(".edtor",first)[0];
		            var edtorVal = edtor.value.trim();
		            //导航中最后一个元素
		            var pathNavLast = tools.$("span",pathNav)[0];
		            var pid = pathNavLast.dataset.fileId;
		            if( edtorVal === "" ){  
		                fileList.removeChild(first);
		            }else if(dataAction.reName(datas,pid,edtorVal)){
		                fileList.removeChild(first);
		            }else{ 
		                fileTitle.innerHTML = edtorVal;
		                fileTitle.style.display = "block";
		                fileEdtor.style.display = "none";
		                //向数据中添加一条新的文件信息
		                var newFile = {
		                    id: first.dataset.fileId,
		                    pid:pid,
		                    title:edtorVal,
		                    type:"file"
		                };
		                datas.unshift(newFile);
		                //提醒
		                fullTip("ok","新建文件夹成功");
		                //要找到当前这个新建的文件的父级对应的左侧树形菜单
		                var tree = tools.getTreeById("tree-title",pid);
		                var nextUl = tree.nextElementSibling;
		                nextUl.innerHTML += view.createTreeLi(datas,newFile);
		                //要让有子数据的菜单有箭头
		                tools.removeClass(tools.getTreeById("tree-title",pid),"tree-contro-none");
		                tools.addClass(tools.getTreeById("tree-title",pid),"tree-contro");
		                tools.removeClass(checkedAll,"checked");
		                //给所有的checkbox添加事件处理
		                checkboxAddEvent();
		            }
		            create.isCreateFile = false;
		        }
   			}
   		}
   	}
   	//右键点击
   	//鼠标右键事件(右击菜单出现的时候，触发的事件)
   	you();
   	function you(){
   		for(var j = 0; j < fileItems.length; j++){
	   		fileItems[j].index = j;
	   		fileItems[j].oncontextmenu = function(ev){
				for( var i = 0; i < fileItems.length; i++ ){
		            tools.removeClass(fileItems[i],"file-checked");
		            tools.removeClass(checkboxs[i],"checked");
		        }
	   			tools.addClass(this,"file-checked");
				tools.addClass(checkboxs[this.index],"checked");
				box3.style.display = "block";
				box3.style.left = ev.clientX + "px";
				box3.style.top = ev.clientY + "px";
				//阻止浏览器默认行为
				ev.preventDefault();
				ev.stopPropagation();
				shanchu();
				mingming();
				checkboxAddEvent();
			}
   		}
   	}
	tools.addEvent(document,"mousedown",function (){
		box3.style.display = "none";
	})
	var aSpan = box3.getElementsByTagName("span");
	for(var i = 0; i < aSpan.length; i++){
		aSpan[i].onmouseover = function(){
			this.style.background = "#0048C9"
		}
		aSpan[i].onmouseout = function(){
			this.style.background = ""
		}
	}
	//右键删除
	function shanchu(){
		tools.addEvent(shan,"mousedown",function (ev){
			ev.stopPropagation();
			shanEvent();
			checkboxAddEvent();
		})
		function shanEvent(){
			zhao.style.display = "block";
			delect.delect = true;
		 	var selectArr = whoSelect();
		 	box3.style.display = "none";
            //删除 文件区域删除 树形菜单删除
            dialog({
                title:"删除文件",
                content:"<h4>确定要删除这个文件夹吗？</h4>",
                okFn:function (){
                    var idArr = [];
                    for( var i = 0; i < selectArr.length; i++ ){
                        fileList.removeChild(selectArr[i]);
                        var fileId = selectArr[i].dataset.fileId;
                        var tree = tools.getTreeById("tree-title",fileId);
                        tree.parentNode.parentNode.removeChild(tree.parentNode);
                        idArr.push(fileId);
                    }
                    dataAction.batchDelect(datas,idArr);   
                    delect.delect = false;
                    tools.removeClass(checkedAll,"checked");  
                    zhao.style.display = "none";
                    if(fileItems.length == 0){
                   		fileList.style.background = "#ccc";
                   }
                    var fullPop = tools.$(".full-pop");
                    for(var j = 0; j < fullPop.length; j++){
                    	fullPop[j].style.display = "none";
                    }
                    checkboxAddEvent();
                    you()
                },
                noFn:function (){
                	delect.delect = false;
                	checkboxAddEvent();
                	zhao.style.display = "none";
                	for( var i = 0; i < fileItems.length; i++ ){
			            tools.removeClass(fileItems[i],"file-checked");
			            tools.removeClass(checkboxs[i],"checked");  
			        }
                	var fullPop = tools.$(".full-pop");
                    for(var j = 0; j < fullPop.length; j++){
                    	fullPop[j].style.display = "none";
                    }
                },
                noFn1:function (){
                	delect.delect = false;
                	 checkboxAddEvent();
                	zhao.style.display = "none";
                	for( var i = 0; i < fileItems.length; i++ ){
			            tools.removeClass(fileItems[i],"file-checked");
			            tools.removeClass(checkboxs[i],"checked");
			        }
                	var fullPop = tools.$(".full-pop");
                    for(var j = 0; j < fullPop.length; j++){
                    	fullPop[j].style.display = "none";
                    }
                }
            })  
		}
		tools.removeEvent(document, 'onkeydown',shanEvent);
		
	}
	//右键重命名	
	function mingming(){
		tools.addEvent(ming,"mousedown",function (ev){
			ev.stopPropagation();
		})
		tools.addEvent(ming,"click",function (ev){
			ev.stopPropagation();
			box3.style.display = "none";
			var fileitems = document.getElementsByClassName('file-item')
			for(var i = 0; i < fileitems.length; i++) {
				if(tools.hasClass(fileitems[i], 'file-checked')) {
					//获取当前文件夹得id，通过id来渲染数据
					var fileid = fileitems[i].dataset.fileId;
					var spans = fileitems[i].getElementsByTagName('span')
					var inputs = fileitems[i].getElementsByTagName('input')[0]
					tools.addEvent(inputs, 'mousedown', function(ev) {
						ev.stopPropagation();
						checkboxAddEvent();
					})
					spans[0].style.display = 'none';
					spans[1].style.display = 'block';
					inputs.value = spans[0].innerHTML;
				}
			}
			//inputs.focus();
			console.log(inputs)
			inputs.select();
			tools.addEvent(inputs,"mousedown",function (ev){
				ev.stopPropagation();   //阻止冒泡
			});
		    tools.addEvent(inputs,"click",function (ev){
		      	ev.stopPropagation();     //阻止冒泡
		    });
			function nones() {
				spans[0].innerHTML = inputs.value;
				spans[1].style.display = 'none';
				spans[0].style.display = 'block';
				//循环数据，改变该id的title
				for(var i = 0; i < datas.length; i++) {
					if(datas[i].id == fileid) {
						datas[i].title = inputs.value;
					}
				}
				//重新渲染左边树形菜单。treeMenu是左边的容器，createTreeHtml结构名称
				treeMenu.innerHTML = view.createTreeHtml(datas, -1);
				//获取最后一个span
				var currentPath = tools.$('.current-path')[0];
				//找到最后span的id
				var currentPathId = currentPath.dataset.fileId;
	
				//通过id找到对应的class名为tree-title标签
				var trre = tools.getTreeById('tree-title', currentPathId)
					//给这个标签添加背景的classname
				tools.addClass(trre, 'tree-nav');
				tools.removeClass(fullTips, 'warn');
				fullTip("ok", "重命名成功！！！");
				tools.removeEvent(document, 'mousedown', nones);
				checkboxAddEvent();
			}
			tools.addEvent(document, 'mousedown', nones);
			tools.addEvent(document, 'onkeydown', nones);
			checkboxAddEvent();
		})
	}
}());

