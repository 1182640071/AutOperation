$(function() {
	var x2008 = 0 ;
	var x2009 = 0 ;
	var x2010 = 0 ;
	var x2011 = 0 ;
	var x2012 = 0 ;
	var x2013 = 0 ;
	var x2014 = 0 ;
	var x2015 = 0 ;
	$.ajax({
		type : "post",
		url  : "/emmvc/logAnalyse",
		contentType : "text/json",
		async : false,
		error : function(event ,request , settings){
			alert(event + " , " + request + " , " + settings);
		},
		success : function(dataE){
			var obj = eval('(' + dataE.replace("[" , "").replace("]" , "") + ')');
			x2008 = obj.x0;
			x2009 = obj.x1 ;
			x2010 = obj.x2 ;
			x2011 = obj.x3 ;
			x2012 = obj.x4 ;
			x2013 = obj.x5 ;
			x2014 = obj.x6 ;
			x2015 = obj.x7 ;
			
		    Morris.Line({
		        element: 'morris-one-line-chart',
		            data: [
							{ year: '2008', value: x2008 },
							{ year: '2009', value: x2009 },
							{ year: '2010', value: x2010 },
							{ year: '2011', value: x2011 },
							{ year: '2012', value: x2012 },
							{ year: '2013', value: x2013 },
							{ year: '2014', value: x2014 },
							{ year: '2015', value: x2015}
		                   ],
		        xkey: 'year',
		        ykeys: ['value'],
		        resize: true,
		        lineWidth:4,
		        labels: ['Value'],
		        lineColors: ['#1ab394'],
		        pointSize:5,
		    });
		    var trlist=document.getElementsByTagName("tspan");
		    for(var i=0; i<trlist.length; i++){
		        if(trlist[i].innerHTML == '2008'){
		        	trlist[i].innerHTML = '40min';
		        }else if(trlist[i].innerHTML == '2009'){
		        	trlist[i].innerHTML = '35min';
		        }else if(trlist[i].innerHTML == '2010'){
		        	trlist[i].innerHTML = '25min';
		        }else if(trlist[i].innerHTML == '2011'){
		        	trlist[i].innerHTML = '20min';
		        }else if(trlist[i].innerHTML == '2012'){
		        	trlist[i].innerHTML = '15min';
		        }else if(trlist[i].innerHTML == '2013'){
		        	trlist[i].innerHTML = '10min';
		        }else if(trlist[i].innerHTML == '2014'){
		        	trlist[i].innerHTML = '5min';
		        }else if(trlist[i].innerHTML == '2015'){
		        	trlist[i].innerHTML = 'now';
		        }
		 
		    }  ;
		}
	});
	
    
    Morris.Area({
        element: 'morris-area-chart',
        data: [{ period: '2010 Q1', iphone: 2666, ipad: null, itouch: 2647 },
            { period: '2010 Q2', iphone: 2778, ipad: 2294, itouch: 2441 },
            { period: '2010 Q3', iphone: 4912, ipad: 1969, itouch: 2501 },
            { period: '2010 Q4', iphone: 3767, ipad: 3597, itouch: 5689 },
            { period: '2011 Q1', iphone: 6810, ipad: 1914, itouch: 2293 },
            { period: '2011 Q2', iphone: 5670, ipad: 4293, itouch: 1881 },
            { period: '2011 Q3', iphone: 4820, ipad: 3795, itouch: 1588 },
            { period: '2011 Q4', iphone: 15073, ipad: 5967, itouch: 5175 },
            { period: '2012 Q1', iphone: 10687, ipad: 4460, itouch: 2028 },
            { period: '2012 Q2', iphone: 8432, ipad: 5713, itouch: 1791 } ],
        xkey: 'period',
        ykeys: ['iphone', 'ipad', 'itouch'],
        labels: ['iPhone', 'iPad', 'iPod Touch'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true,
        lineColors: ['#87d6c6', '#54cdb4','#1ab394'],
        lineWidth:2,
        pointSize:1,
    });

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{ label: "Download Sales", value: 12 },
            { label: "In-Store Sales", value: 30 },
            { label: "Mail-Order Sales", value: 20 } ],
        resize: true,
        colors: ['#87d6c6', '#54cdb4','#1ab394'],
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{ y: '2006', a: 60, b: 50 },
            { y: '2007', a: 75, b: 65 },
            { y: '2008', a: 50, b: 40 },
            { y: '2009', a: 75, b: 65 },
            { y: '2010', a: 50, b: 40 },
            { y: '2011', a: 75, b: 65 },
            { y: '2012', a: 100, b: 90 } ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true,
        barColors: ['#1ab394', '#cacaca'],
    });
   
    Morris.Line({
        element: 'morris-line-chart',
        data: [{ y: '2006', a: 100, b: 90 },
            { y: '2007', a: 75, b: 65 },
            { y: '2008', a: 50, b: 40 },
            { y: '2009', a: 75, b: 65 },
            { y: '2010', a: 50, b: 40 },
            { y: '2011', a: 75, b: 65 },
            { y: '2012', a: 100, b: 90 } ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true,
        lineColors: ['#54cdb4','#1ab394'],
    });

});
