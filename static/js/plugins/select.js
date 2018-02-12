/**
 * 李双
 * select通用方法
 */
//为select绑定数据
function BindSelectData(ctrlName, data,id,text) {
   var control = $('#' + ctrlName);
   control.empty();//清空下拉框
   $.each(data, function (i, item) {
       control.append("<option value='" + item[id] + "'>"+item[text] + "</option>");
   });
}
//为select绑定数据
function BindSelectUrl(ctrlName,url,id,text) {
   var control = $('#' + ctrlName);
   control.empty();
   //绑定Ajax的内容
   $.getJSON(url, function (data) {
  	 control.append("<option  value=''>全部</option>");
       $.each(data, function (i, item) {
           control.append("<option  value='" + item[id] + "'>"+item[text] + "</option>");
       });
   });
   //设置Select2的处理
   setTimeout("initSelect('"+ctrlName+"');",500);
}
function BindSelectIsp(ctrlName,url,id,text) {
	var control = $('#' + ctrlName);
	control.empty();
	//绑定Ajax的内容
	$.getJSON(url, function (data) {
		$.each(data, function (i, item) {
			control.append("<option  value='" + item[id] + "'>"+item[text] + "</option>");
		});
	});
	//设置Select2的处理
	setTimeout("initSelect('"+ctrlName+"');",500);
}

function BindSelectUrlWu(ctrlName,url,id,text) {
	   var control = $('#' + ctrlName);
	   control.empty();
	   //绑定Ajax的内容
	   $.getJSON(url, function (data) {
	  	 control.append("<option  value=''>无</option>");
	       $.each(data, function (i, item) {
	           control.append("<option  value='" + item[id] + "'>"+item[text] + "</option>");
	       });
	   });
	   //设置Select2的处理
	   setTimeout("initSelect('"+ctrlName+"');",500);
	}


//为select绑定数据
function BindSelectOrgan(ctrlName, url,type) {
    var control = $('#' + ctrlName);
    control.empty();
    //绑定Ajax的内容
    $.getJSON(url, function (data) {
   	 control.append("<option  value=''>全部</option>");
        $.each(data, function (i, item) {
       	 if(type=='organ'){
       		 //获取等级
           	 var str='';
           	 for(var i=0;i<item.level;i++){
           		 str+="&nbsp;&nbsp;";
           	 }
                control.append("<option  value='" + item.id + "'>"+str+item.text + "</option>");
       	 }else if(type=='dept'){
       		 control.append("<option  value='" + item.deptId + "'>"+item.deptName + "</option>");
       	 }else if(type=='company'){
       		 control.append("<option value='" + item.companyId + "'>"+item.companyName + "</option>");
       	 }
        });
    });
    //设置Select2的处理
    setTimeout("initSelect('"+ctrlName+"');",500);
}

function initSelect(obj){
	var control = $('#' + obj);
	control.select2();
}


function initNoSearchSelect(obj){
	var control = $('#' + obj);
	control.select2({
		 minimumResultsForSearch: -1
	});
}

//为select绑定数据
function BindSelectOrganN(ctrlName, url,type) {
    var control = $('#' + ctrlName);
    control.empty();
    //绑定Ajax的内容
    $.getJSON(url, function (data) {
        $.each(data, function (i, item) {
       	 if(type=='organ'){
       		 //获取等级
           	 var str='';
           	 for(var i=0;i<item.level;i++){
           		 str+="&nbsp;&nbsp;";
           	 }
                control.append("<option  value='" + item.id + "'>"+str+item.text + "</option>");
       	 }else if(type=='dept'){
       		 control.append("<option  value='" + item.deptId + "'>"+item.deptName + "</option>");
       	 }else if(type=='company'){
       		 control.append("<option value='" + item.companyId + "'>"+item.companyName + "</option>");
       	 }
        });
    });
    //设置Select2的处理
    setTimeout("initSelect('"+ctrlName+"');",500);
}


//为select绑定数据
function BindSelectUrlN(ctrlName,url,id,text) {
   var control = $('#' + ctrlName);
   control.empty();
   //绑定Ajax的内容
   $.getJSON(url, function (data) {
       $.each(data, function (i, item) {
           control.append("<option  value='" + item[id] + "'>"+item[text] + "</option>");
       });
   });
   //设置Select2的处理
   setTimeout("initSelect('"+ctrlName+"');",500);
}

//添加默认值
function BindSelectUrlD(ctrlName,url,id,text,defaults) {
	   var control = $('#' + ctrlName);
	   control.empty();
	   //绑定Ajax的内容
	   $.getJSON(url, function (data) {
	       $.each(data, function (i, item) {
	    	   if(item[id]==defaults){
	    		   control.append("<option selected  value='" + item[id] + "'>"+item[text] + "</option>");
	    	   }else{
	    		   control.append("<option  value='" + item[id] + "'>"+item[text] + "</option>");
	    	   }
	          
	       });
	   });
	   //设置Select2的处理
	   setTimeout("initSelect('"+ctrlName+"');",500);
	}

//为select绑定数据
function BindSelectOrganD(ctrlName, url,type,defaults) {
    var control = $('#' + ctrlName);
    control.empty();
    //绑定Ajax的内容
    $.getJSON(url, function (data) {
        $.each(data, function (i, item) {
       	 if(type=='organ'){
       		 //获取等级
           	 var str='';
           	 for(var i=0;i<item.level;i++){
           		 str+="&nbsp;&nbsp;";
           	 }
           	 if(item.id==defaults){
           		control.append("<option  selected value='" + item.id + "'>"+str+item.text + "</option>");
           	 }else{
           		control.append("<option  value='" + item.id + "'>"+str+item.text + "</option>");
           	 }
       	 }else if(type=='dept'){
       		 if(item.deptId==defaults){
       			 control.append("<option  selected value='" + item.deptId + "'>"+item.deptName + "</option>");
       		 }else{
       			 control.append("<option  value='" + item.deptId + "'>"+item.deptName + "</option>");
       		 }
       	 }else if(type=='company'){
       		 if(item.companyId==defaults){
       	
       			 control.append("<option selected value='" + item.companyId + "'>"+item.companyName + "</option>");
       		 }else{
       			 control.append("<option value='" + item.companyId + "'>"+item.companyName + "</option>");
       		 }
       		
       	 }
        });
    });
    //设置Select2的处理
    setTimeout("initSelect('"+ctrlName+"');",500);
}

//为select绑定数据
function BindSelectUrlNoSearch(ctrlName,url,id,text) {
   var control = $('#' + ctrlName);
   control.empty();
   //绑定Ajax的内容
   $.getJSON(url, function (data) {
       $.each(data, function (i, item) {
           control.append("<option  value='" + item[id] + "'>"+item[text] + "</option>");
       });
   });
   //设置Select2的处理
   setTimeout("initNoSearchSelect('"+ctrlName+"');",500);
}


//为select绑定数据
function BindSelectAddressN(ctrlName, url) {
    var control = $('#' + ctrlName);
    control.empty();
    //绑定Ajax的内容
    $.getJSON(url, function (data) {
        $.each(data, function (i, item) {
           	 var str='';
           	 for(var i=0;i<item.level;i++){
           		 str+="&nbsp;&nbsp;";
           	 }
             control.append("<option  value='" + item.groupId + "'>"+str+item.groupName + "</option>");
        });
    });
    //设置Select2的处理
    setTimeout("initSelect('"+ctrlName+"');",500);
}
//为select绑定数据

function BindSelectAddress(ctrlName, url) {
    var control = $('#' + ctrlName);
    control.empty();
    //绑定Ajax的内容
    $.getJSON(url, function (data) {
        $.each(data, function (i, item) {
           	 var str='';
           	 for(var i=0;i<item.level;i++){
           		 str+="&nbsp;&nbsp;";
           	 }
             control.append("<option  value='" + item.groupId + "'>"+str+item.groupName + "</option>");
        });
    });
    //设置Select2的处理
    setTimeout("initSelect('"+ctrlName+"');",500);
}