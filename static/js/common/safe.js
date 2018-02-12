   var errorCharacter="EC101";
   var loginTimeOut="LTO102";
   var errorOper="EO103";
   //Ajax全局事件
   $.ajaxSetup({
	    global: false,
	    type: "POST",
	    complete: function (XMLHttpRequest, textStatus) {
	    	 var data = XMLHttpRequest.responseText;
	    /*	 if('parsererror' == textStatus){
	    		 top.location.href='' + path + '/';
	    		 return;
	    	 }*/
	    	 filter(data);
	    },
	    statusCode : {
	    	302 : function(){
	    		top.location.href='' + path + '/';
	    	}
	    }
	});
   
   function filter(str){
	   if((typeof str=='string')&&str.constructor==String){
		   if(str.indexOf(errorCharacter)>0){
			   $.dialog.tips("包含违法字符");
			   return false;
		   }else if(str.indexOf(loginTimeOut)>0){
			   $.dialog.tips("超时登录");
			   top.location.href='' + path + '/';
			   return false;
		   }else if(str.indexOf(errorOper)>0){
			   $.dialog.tips("权限不足,操作失败！");
			   return false;
		   } 
	   }
   }