/**
 * 通讯录鼠标事件
 */
/*$('.oper > button').hover(
	function (){
		$(this).find('p').find('font').css({"color": "#ffffff","font-size":"13px"});
	},
	function (){
		$(this).find('p').find('font').css({"color": "#4ca6ff","font-size":"13px"});
	}
);*/
/*$('#addParent').hover(
	function (){
		$(this).find('p').find('img').attr('src',path+'/resources/image/addressbook/establish-click.png');
	},
	function (){
		$(this).find('p').find('img').attr('src',path+'/resources/image/addressbook/establish.png');
	}
);
$('#edit').hover(
	function (){
		$(this).find('p').find('img').attr('src',path+'/resources/image/addressbook/edit-click.png');
	},
	function (){
		$(this).find('p').find('img').attr('src',path+'/resources/image/addressbook/edit.png');
	}
);
$('#remove').hover(
	function (){
		$(this).find('p').find('img').attr('src',path+'/resources/image/addressbook/delete-click.png');
	},
	function (){
		$(this).find('p').find('img').attr('src',path+'/resources/image/addressbook/delete.png');
	}
);
$('#expand').hover(
	function (){
		$(this).find('p').find('img').attr('src',path+'/resources/image/addressbook/open-click.png');
	},
	function (){
		$(this).find('p').find('img').attr('src',path+'/resources/image/addressbook/open.png');
	}
);*/
function endWith(str1, str2){
 if(str1 == null || str2 == null){
  return false;
 }
 if(str1.length < str2.length){
  return false;
 }else if(str1 == str2){
  return true;
 }else if(str1.substring(str1.length - str2.length) == str2){
  return true;
 }
 return false;
}
function imageBack(button){
	$(button).parent().find("button").each(function(i,o){
		var imgSrc=$(o).find("img");
		var isCilicImg=endWith(imgSrc.attr("src"),"-click.png");
		if($(button).attr("id")==$(o).attr("id")){
			$(o).attr("class","btn click_btn_1");
			if(!isCilicImg){
				imgSrc.attr("src",imgSrc.attr("src").replace(".png","-click.png"));
			}
		}else{
			if(isCilicImg){
				imgSrc.attr("src",imgSrc.attr("src").replace("-click",""));
			}
			$(o).attr("class","btn");
			
		}
	});
}
$('#addParent').click(function (){
	imageBack(this);
	//$(this).toggleClass('click_btn_1');
});
$('#edit').click(function (){
	imageBack(this);
	//$(this).toggleClass('click_btn_2');
});
$('#remove').click(function (){
	imageBack(this);
	//$(this).toggleClass('click_btn_3');
});
$('#expand').click(function (){
	imageBack(this);
	//$(this).toggleClass('click_btn_4');
});