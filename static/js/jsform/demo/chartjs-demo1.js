$(function () {
	remainTime();  
	
});



var i = 10;  
function remainTime(){ 
    	var m0 = 0 ;
    	var m1 = 0 ;
    	var m2 = 0 ;
    	var m3 = 0 ;
    	var m4 = 0 ;
    	var m5 = 0 ;
    	var m6 = 0 ;
    	var m7 = 0 ;
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
    			m0 = obj.x0;
    			m1 = obj.x1 ;
    			m2 = obj.x2 ;
    			m3 = obj.x3 ;
    			m4 = obj.x4 ;
    			m5 = obj.x5 ;
    			m6 = obj.x6 ;
    			m7 = obj.x7 ;
    						
    		    var lineData = {
    		        labels: ["7min", "6min", "5min", "4min", "3min", "2min", "1min" , "now"],
    		        datasets: [
    		            {
    		                label: "Example dataset",
    		                fillColor: "rgba(220,220,220,0.5)",
    		                strokeColor: "rgba(220,220,220,1)",
    		                pointColor: "rgba(220,220,220,1)",
    		                pointStrokeColor: "#fff",
    		                pointHighlightFill: "#fff",
    		                pointHighlightStroke: "rgba(220,220,220,1)",
    		                data: [165, 259, 80, 181, 156, 55, 140 , 120]
    		            },
    		            {
    		                label: "Example dataset",
    		                fillColor: "rgba(26,179,148,0.5)",
    		                strokeColor: "rgba(26,179,148,0.7)",
    		                pointColor: "rgba(26,179,148,1)",
    		                pointStrokeColor: "#fff",
    		                pointHighlightFill: "#fff",
    		                pointHighlightStroke: "rgba(26,179,148,1)",
    		                data: [m0, m1, m2, m3, m4, m5, m6 , m7]
    		            }
    		        ]
    		    };

    		    var lineOptions = {
    		        scaleShowGridLines: true,
    		        scaleGridLineColor: "rgba(0,0,0,.05)",
    		        scaleGridLineWidth: 1,
    		        bezierCurve: true,
    		        bezierCurveTension: 0.4,
    		        pointDot: true,
    		        pointDotRadius: 4,
    		        pointDotStrokeWidth: 1,
    		        pointHitDetectionRadius: 20,
    		        datasetStroke: true,
    		        datasetStrokeWidth: 2,
    		        datasetFill: true,
    		        responsive: true,
    		    };
    		    var ctx = document.getElementById("lineChart").getContext("2d");
    		    var myNewChart = new Chart(ctx).Line(lineData, lineOptions);
    			
    		}
    	});    
    setTimeout("remainTime()",3000);  
}  