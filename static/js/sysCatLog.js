
function _loadSecCatType(catType) {
    var catTypeSec=document.getElementById("catTypeSec");
    catTypeSec.options.length=0;
    var option=new Option("��ѡ��","",false,true);
    catTypeSec.add(option);
    if (catType=="0"||catType=="1"||catType=="2")
    {
		var option1=new Option("��������Աͳ��",3); 
		catTypeSec.add(option1);
		var option2=new Option("���������ͳ��",4); 
		catTypeSec.add(option2);
     }
    if (catType=="3")
    {
    	var option4=new Option("����ͳ��",0); 
		catTypeSec.add(option4);
		var option5=new Option("����ͳ��",1); 
		catTypeSec.add(option5);
		var option6=new Option("����ͳ��",2); 
		catTypeSec.add(option6);
		var option7=new Option("���������ͳ��",4); 
		catTypeSec.add(option7);
    }
    if (catType=="4")
    {
    	var option8=new Option("����ͳ��",0); 
		catTypeSec.add(option8);
		var option9=new Option("����ͳ��",1); 
		catTypeSec.add(option9);
		var option10=new Option("����ͳ��",2); 
		catTypeSec.add(option10);
		var option11=new Option("��������Աͳ��",3); 
		catTypeSec.add(option11);
    }    
    
    //��ʼ�����б��չʾ��̧ͷ
    var parent=document.getElementById("catTable"); 
    var last=parent.lastChild;
    while(!(last=="null")){
    	parent.removeChild(last); 
    }
    var catName="";
    if(catType=="0"){
    	catName="����";
    }
    if(catType=="1"){
    	catName="�·�";
    }
    if(catType=="2"){
    	catName="���";
    }
    if(catType=="3"){
    	catName="������Ա";
	}
    if(catType=="4"){
    	catName="��������";
    }
    tr = document.createElement("TR");
	th1=document.createElement("TH");
	th2=document.createElement("TH");
	th3=document.createElement("TH");
	th1.width="15%";
	th1.innerHTML="<strong>���</strong>";
	th2.width="40%";
	th2.innerHTML = "<strong>"+catName+"</strong>";
	th3.width="45%";
	th3.innerHTML = "<strong>��־��</strong>";
	tr.appendChild(th1);
	tr.appendChild(th2);
	tr.appendChild(th3);
	parent.appendChild(tr);
}

function _loadCatTitle(catType,catTypeSec) {
    //��ʼ�����б��չʾ��̧ͷ
    var catName="";
    var catName2="";
    var parent=document.getElementById("catTable"); 
    var last=parent.lastChild;
    while(!(last=="null")){
    	parent.removeChild(last); 
    }
    if(catType=="0"){
    	catName="����";
    }
    if(catType=="1"){
    	catName="�·�";
    }
    if(catType=="2"){
    	catName="���";
    }
    if(catType=="3"){
    	catName="������Ա";
	}
    if(catType=="4"){
    	catName="��������";
    }  
    
    if(catTypeSec=="0"){
    	catName2="����";
    }
    if(catTypeSec=="1"){
    	catName2="�·�";
    }
    if(catTypeSec=="2"){
    	catName2="���";
    }
    if(catTypeSec=="3"){
    	catName2="������Ա";
	}
    if(catTypeSec=="4"){
    	catName2="��������";
    }
    tr = document.createElement("TR");
	th1=document.createElement("TH");
	th2=document.createElement("TH");
	th3=document.createElement("TH");
	th4=document.createElement("TH");
	th1.width="15%";
	th1.innerHTML="<strong>���</strong>";
	th2.width="30%";
	th2.innerHTML = "<strong>"+catName+"</strong>";
	th3.width="30%";
	th3.innerHTML = "<strong>"+catName2+"</strong>";
	th4.width="25%";
	th4.innerHTML = "<strong>��־��</strong>";
	tr.appendChild(th1);
	tr.appendChild(th2);
	tr.appendChild(th3);
	tr.appendChild(th4);
	parent.appendChild(tr);
}




