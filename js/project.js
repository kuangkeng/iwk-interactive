$(document).ready(function() {

    var width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
    var chart1a, chart1b, chart2, chart3a, chart3b, chart4; 
    var guessX, guessY, yourState, payAnswer, payExtra;
    var userInputs = [];
    var email;
    var answered1, answered2;
    var clicked2, clicked3, clicked4, clicked5;
    var chart1Loaded, chart3Loaded, chart4Loaded;
    var form1clicked, form2clicked, form3clicked;
    var guessDataset = [];
    var diffDataset = [];
    var rightUser, rightPct, playerNum, resultVal;

    var answers1 = [
        "You’re a genius! You’ve got the exact answer. Are you cheating? Only <div class='compareUser1'>50%</div> people before you have got it right.",
        "Bingo! Your guess is very close to the answer. It is more accurate than <div class='compareUser1'>50%</div> of those who have played this quiz.",
        "You’ve underestimated how much water Malaysians waste! But that's alright because <div class='compareUser1'>50%</div> of those who have played this quiz did worse than you.",
        "Malaysians are more prudent than you thought! But you still do better than <div class='compareUser1'>50%</div> of those who have played this quiz.",
        "Seriously? Are you sure you can survive with this little water? Only <div class='compareUser1'>50%</div> of those who have played this quiz did worse than you.",
        "No way! Malaysia might have run out of water if your guess is right. Only <div class='compareUser1'>50%</div> of those who have played this quiz did worse than you.",
    ];

    var answers2 = [
        "Unbelievable! You’ve got the exact answer. IWK should offer you a job!",
        "Not bad! Looks like you know the situation well.",
        "Sorry, your guess is far from the actual charge rate. Go check your IWK bill!",
    ];

    var dataCountryWater = [
        {name:"Taiwan (2018)",y:280},
        {name:"US (2016)",y:222},
        {name:"Malaysia (2017)",y:201, color:"#00c853"},
        {name:"UN recommendation",y:165},
        {name:"Singapore (2017)",y:143},
        {name:"Thailand (2011)",y:90},
    ];

    var dataStateWater = [
        {name:"Pulau Pinang",y:277},
        {name:"Perlis",y:245},
        {name:"Melaka",y:228},
        {name:"Perak",y:227},
        {name:"N. Sembilan",y:222},
        {name:"Selangor, KL &amp;<br>Putrajaya",y:222},
        {name:"Kedah",y:217},
        {name:"Terengganu",y:204},
        {name:"National<br>average",y:201, color:"#00c853"},
        {name:"Johor",y:200},
        {name:"Pahang",y:190},
        {name:"UN<br>recommendation",y:165, color:"#00c853"},
        {name:"Sarawak",y:165},
        {name:"Kelantan",y:141},
        {name:"Sabah",y:108},
    ];

    var dataCost = [
        {name:"Tokyo,<br>Japan", y:10.43},
        {name:"Sydney,<br>Australia", y:5.91},
        {name:"London<br>UK",y:5.03},
        {name:"Global<br>average", y:4.15},
        {name:"Singapore", y:2.97},
        {name:"Johannesburg,<br>South Africa", y:2.22},
        {name:"Istanbul<br>Turkey", y:1.84},
        {name:"Beijing,<br>China", y:0.84},
        {name:"Malaysia", y:0.34, color:"#00c853"},
        {name:"Hanoi,<br>Vietnam", y:0.13},
    ];

    var dataSubsidy1 = [
        {year:"2003",y:75},
        {year:"2004",y:51},
        {year:"2005",y:0},
        {year:"2006",y:0},
        {year:"2007",y:0},
        {year:"2008",y:0},
        {year:"2009",y:0},
        {year:"2010",y:0},
        {year:"2011",y:0},
        {year:"2012",y:0},
        {year:"2013",y:0},
        {year:"2014",y:0},
        {year:"2015",y:0},
        {year:"2016",y:0},
        {year:"2017",y:0, color:"#00c853"},
        {year:"2018",y:0, color:"#00c853"},
        {year:"2019",y:0, color:"#00c853"},
        {year:"2020",y:0, color:"#00c853"},
    ];
    var dataSubsidyCat = [];
    for (var i = 0; i < dataSubsidy1.length; i++){
        dataSubsidyCat.push(dataSubsidy1[i].year);
    }

    function getAnswer1(d) {
        return d == 201 ? answers1[0] :
               d >= 181 && d <= 221  ? answers1[1] :
               d >= 101 && d <= 180  ? answers1[2] :
               d >= 222 && d <= 301  ? answers1[3] :
               d <= 100  ? answers1[4] :
               answers1[5] ;
    }

    function getAnswer2(d) {
        return d == 0.34 ? answers2[0] :
               d >= 0.01 && d <= 2 ? answers2[1] :
               answers2[2] ;
    }

    //Retrieve previous users data from google spreadsheet and convert them into arrays
    var spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1DzmWJe6eH3sllxiEe3lLcjKaIRIckAlgHUKcEHt2GpM/pubhtml';
    Tabletop.init( { key: spreadsheet_url,
                    callback: showInfo,
                    simpleSheet: true } )

    //Convert data in the spreadsheet to json and store them in "dataset"
    function showInfo(data, tabletop) {
        //call out the data from column "guess" in google sheet and push it into an array called dataset
        for(var i in data) {guessDataset.push(data[i].guess);}
        //calculate the number of entries in google sheet
        playerNum = guessDataset.length;
        //count how many previous users got it right at 201
        rightUser = 0;
        for (var i in guessDataset){
          if(guessDataset[i]== 201){rightUser++;}
        }   
        //calculate the percentage of right users
        rightPct = Math.round(rightUser/playerNum * 100);
        //calculate the difference of each answer and the correct answer 201
        for(var i in data) {diffDataset.push(Math.abs(data[i].guess-201));}
    }

    function calResult(){
        if (guessX == 201){
            resultVal = rightPct+"%";
        } else {
            var diffGuess = Math.abs(guessX - 201);
            var worseUser = 0;
            for (var i in diffDataset){
                if(diffGuess<diffDataset[i]){worseUser++;}
              }  
            var worsePct = Math.round(worseUser/playerNum * 100);
            var betterPct = 100-worsePct;
            resultVal = worsePct+"%";
        }
    }


    if (width<500){
        //For chart1a mobile
        $('#chart-container-1a').on("touchmove", function(e) {       
            if (answered1 == 1){} else {
                e.preventDefault();
                var xaxis = chart1a.xAxis[0];
                xaxis.removePlotLine('plot-line-x');
                var x = xaxis.toValue(e.touches[0].pageX-27, true);
                xaxis.addPlotLine({
                    value: x,
                    color: '#f44336',
                    width: 2,
                    id: 'plot-line-x',
                });
                guessX = x.toFixed(0);
                $("#guess-value-1").html(guessX);
                $('#guess-btn-1').fadeIn();
            }
        }); 

        $('#guess-btn-1').click(function(){
            $('#guess-btn-1').prop('disabled',true);
            answered1 = 1;
            calResult();
            $("#answer1").html(getAnswer1(guessX));
            $(".compareUser1").html(resultVal).addClass("changeBackground");
            chart1a.series[0].addPoint({
                x:  201,
                y:  10,
                color: '#00c853',
                marker: {radius: 7},   
                id: 'point-my', 
                name: 'Malaysia<br>(2017)',
                dataLabels: {borderColor: '#00c853', borderWidth: 2, backgroundColor: '#043A66', y:15, verticalAlign: 'top'}
            },true,false);  
            chart1a.series[0].addPoint({
                x:  guessX,
                y:  10,
                color: '#f44336',
                marker: {radius: 7},   
                id: 'point-new', 
                name: 'Your guess',
                dataLabels: {borderColor: '#f44336', borderWidth: 2, backgroundColor: '#043A66'}
            },true,false);                          
            dataCountryWater.push({name:"Your guess", y:parseInt(guessX), color:"#f44336"});
            dataCountryWater = dataCountryWater.sort(function (a, b) {
                return b.y - a.y;
            });
            var dataCountryWaterCat=[];
            for (var i = 0; i < dataCountryWater.length; i++){
                dataCountryWaterCat.push(dataCountryWater[i].name);
            }
            $("#answer-box-1").fadeTo(500, 1, makeChart1b(dataCountryWaterCat));
            $('#guess-btn-1').hide();
            sendGuess();
        });    

        //For chart3a mobile
        $('#chart-container-3a').on("touchmove", function(e) {       
            if (answered2 == 1){} else {
                e.preventDefault();
                var xaxis = chart3a.xAxis[0];
                xaxis.removePlotLine('plot-line-x');
                var x = xaxis.toValue(e.touches[0].pageX-27, true);
                xaxis.removePlotLine('plot-line-x');
                xaxis.addPlotLine({
                    value: x,
                    color: '#f44336',
                    width: 2,
                    id: 'plot-line-x',
                });
                guessY = x.toFixed(2);
                $("#guess-value-2").html(guessY);
                $('#guess-btn-2').fadeIn();
            }
        }); 

        $('#guess-btn-2').click(function(){
            $('#guess-btn-2').prop('disabled',true);
            answered2 = 1;
            $("#answer2").html(getAnswer2(guessY));
            chart3a.series[0].addPoint({
                x:  0.34,
                y:  10,
                color: '#00c853',
                marker: {radius: 7},   
                id: 'point-my', 
                name: 'Malaysia',
                dataLabels: {borderColor: '#00c853', borderWidth: 2, backgroundColor: '#537590', y:15, verticalAlign: 'top'}
            },true,false);
            chart3a.series[0].addPoint({
                x:  guessY,
                y:  10,
                color: '#f44336',
                marker: {radius: 7},   
                id: 'point-new', 
                name: 'Your guess',
                dataLabels: {borderColor: '#f44336', borderWidth: 2, backgroundColor: '#537590'}
            },true,false);                
            dataCost.push({name:"Your guess", y:Number(guessY), color:"#f44336"});
            dataCost = dataCost.sort(function (a, b) {
                return b.y - a.y;
            });
            var dataCostCat=[];
            for (var i = 0; i < dataCost.length; i++){
                dataCostCat.push(dataCost[i].name);
            }
            $("#answer-box-3").fadeTo(500, 1, makeChart3b(dataCostCat));
            $('#guess-btn-2').hide();
        }); 


    } else {
        // Chart1a desktop
        $('#chart-container-1a').mousemove(function(e){      
            if (answered1 == 1){} else {
                var xaxis = chart1a.xAxis[0];
                xaxis.removePlotLine('plot-line-x');
                var x = xaxis.toValue(e.offsetX-11, true); 
                xaxis.addPlotLine({
                    value: x,
                    color: '#f44336',
                    width: 2,
                    id: 'plot-line-x',
                });
                guessX = x.toFixed(0);
                $("#guess-value-1").html(guessX);
            }
        });  
    
        $('#chart-container-1a').click(function(e){    
            if (answered1 == 1){} else {
                chart1a.series[0].addPoint({
                    x:  guessX,
                    y:  10,
                    color: '#f44336',
                    marker: {radius: 7},   
                    id: 'point-new', 
                    name: 'Your guess',
                    dataLabels: {borderColor: '#f44336', borderWidth: 2, backgroundColor: '#043A66'}
                },true,false);
                $("#guess-value-1").html(guessX);
                answered1 = 1;
                calResult();
                $("#answer1").html(getAnswer1(guessX));
                $(".compareUser1").html(resultVal).addClass("changeBackground");
                chart1a.series[0].addPoint({
                    x:  201,
                    y:  10,
                    color: '#00c853',
                    marker: {radius: 7},   
                    id: 'point-my', 
                    name: 'Malaysia<br>(2017)',
                    dataLabels: {borderColor: '#00c853', borderWidth: 2, backgroundColor: '#043A66', y:15, verticalAlign: 'top'}
                },true,false);
                dataCountryWater.push({name:"Your guess", y:parseInt(guessX), color:"#f44336"});
                dataCountryWater = dataCountryWater.sort(function (a, b) {
                    return b.y - a.y;
                });
                var dataCountryWaterCat=[];
                for (var i = 0; i < dataCountryWater.length; i++){
                    dataCountryWaterCat.push(dataCountryWater[i].name);
                }
                $("#answer-box-1").fadeTo(500, 1, makeChart1b(dataCountryWaterCat));
                sendGuess();            
            }
        }); 

        // Chart3b desktop
        $('#chart-container-3a').mousemove(function(e){      
            if (answered2 == 1){} else {
                var xaxis = chart3a.xAxis[0];
                xaxis.removePlotLine('plot-line-x');
                var x = xaxis.toValue(e.offsetX-11, true); 
                xaxis.addPlotLine({
                    value: x,
                    color: '#f44336',
                    width: 2,
                    id: 'plot-line-x',
                });
                guessY = x.toFixed(2);
                $("#guess-value-2").html(guessY);
            }
        });  
    
        $('#chart-container-3a').click(function(e){    
            if (answered2 == 1){} else {
                chart3a.series[0].addPoint({
                    x:  guessY,
                    y:  10,
                    color: '#f44336',
                    marker: {radius: 7},   
                    id: 'point-new', 
                    name: 'Your guess',
                    dataLabels: {borderColor: '#f44336', borderWidth: 2, backgroundColor: '#537590'}
                },true,false);
                $("#guess-value-2").html(guessY);
                answered2 = 1;
                $("#answer2").html(getAnswer2(guessY));
                chart3a.series[0].addPoint({
                    x:  0.34,
                    y:  10,
                    color: '#00c853',
                    marker: {radius: 7},   
                    id: 'point-my', 
                    name: 'Malaysia',
                    dataLabels: {borderColor: '#00c853', borderWidth: 2, backgroundColor: '#537590', y:15, verticalAlign: 'top'}
                },true,false);
                dataCost.push({name:"Your guess", y:Number(guessY), color:"#f44336"});
                dataCost = dataCost.sort(function (a, b) {
                    return b.y - a.y;
                });
                var dataCostCat=[];
                for (var i = 0; i < dataCost.length; i++){
                    dataCostCat.push(dataCost[i].name);
                }
                $("#answer-box-3").fadeTo(500, 1, makeChart3b(dataCostCat));            
            }
        });         

    }  
    
    $(".btnState").click(function(){
        if (clicked2 == 1){}else{
            yourState = $(this).html(); 
            var dataStateWaterCat = [];
            for (var i = 0; i < dataStateWater.length; i++){
                dataStateWaterCat.push(dataStateWater[i].name);
                if (dataStateWater[i].name == yourState){
                    dataStateWater[i].color = "#f44336";
                    dataStateWater[i].note = "Your state";
                }
            }
            $("#answer-box-2").fadeTo(500, 1, makeChart2(dataStateWaterCat));
            $(".btnState").css('pointer-events','none');
            $(this).css({"color":"#fff", "background-color":"rgba(0,200,83,1)"});
            clicked2 = 1;
        }
    });

    $(".btnPay").click(function(){
        if (clicked3 == 1){}else{
            payAnswer = $(this).text();
            if(payAnswer == "Yes"){
                $(".payExtra").fadeTo(500, 1);
            } else {
                $(".payExtra").hide();
                $(".moreQuestions").fadeTo(500, 1);
            }
            clicked3 = 1;
            $('.btnPay').prop('disabled',true);
            $(this).css({"background-color":"#999","color":"#fff"});
        }
    })

    $(".btnExtra").click(function(){
        if (clicked4 == 1){} else {
            payExtra = $(this).text();
            clicked4 = 1;
            $(".moreQuestions").fadeTo(500, 1);
            $('.btnExtra').prop('disabled',true);
            $(this).css({"background-color":"#999","color":"#fff"});
        }        
    })

    $(".user-info-radio").click(function(){
        if(this.name == "form1"){form1clicked = 1;}
        if(this.name == "form2"){form2clicked = 1;}
        if(this.name == "form3"){form3clicked = 1;}
        if(form1clicked + form2clicked + form3clicked == 3){
            $("#last-btn").fadeTo(500, 1);
        }
    })

    $("#last-btn").click(function(){
        if (clicked5 == 1){} else {
            var formInputs;
            for(a = 0; a < document.forms.length; a++) {
                formInputs = document.forms[a];
                for (i = 0; i < formInputs.length; i++) {
                    if (formInputs[i].checked) {
                    userInputs.push(formInputs[i].value);
                    }
                    formInputs[i].disabled = true;
                }          
            }
            email = $("#userEmail").val();
            $("#userEmail").prop('disabled', true);
            clicked5 = 1;
            $('#last-btn').prop('disabled',true);
            $(this).css({"background-color":"#999","color":"#fff"});
            $(".thankYou").fadeTo(500, 1);
            sendData()
        }        
    })  

    $("#chart-1-text-1").waypoint(function(direction) {
        if (direction === "down") {
            if(chart1Loaded == 1){} else {
                if (width<500){
                    $("#logo-box-1").delay(1000).fadeIn(1000).delay(1500).fadeOut(1000);
                }
                $("#box-below-chart-1, #box-above-chart-1").fadeTo(1000, 1, makeChart1a());
            }
            chart1Loaded = 1;
        } else {}
    }, {
        offset: "-10%"
    });

    $("#chart-2-text-1").waypoint(function(direction) {
        if (direction === "down") {
            $("#state-menu-container").fadeTo(500, 1);
        } else { }
    }, {
        offset: "10%"
    });

    $("#chart-3-text-1").waypoint(function(direction) {
        if (direction === "down") {
            if(chart3Loaded == 1){} else {
                if (width<500){
                    $("#logo-box-2").delay(1000).fadeIn(1000).delay(1500).fadeOut(1000);
                }
            $("#box-below-chart-2, #box-above-chart-2").fadeTo(500, 1, makeChart3a());
            }
            chart3Loaded = 1;
        } else { }
    }, {
        offset: "-10%"
    });

    var labelstyle ={
        enabled: true,
        allowOverlap: true,
        format: 'Year {point.year}<br>RM{point.y}mil',
        y: -10,
        borderRadius: 5,
        borderWidth: 0,
        borderColor: '#585858',
        backgroundColor: '#fff',
        shape: 'callout',
        style:{
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#033a66'
        },
    };

    $("#chart-4-text-2").waypoint(function(direction) {
        if (direction === "down") {
            $("#box-below-chart-3, #box-above-chart-3").fadeTo(500, 1, makeChart4());
            chart4Loaded = 1;
            chart4.get("seriesSubsidy").points[1].update({dataLabels: labelstyle});              
        } else { }
    }, {
        offset: "80%"
    });



    $("#chart-4-text-3").waypoint(function(direction) {
        if (direction === "down") {
            chart4.get("seriesSubsidy").points[1].update({dataLabels: {enabled: false}});
            chart4.get("seriesSubsidy").points[2].update({y:138});
            chart4.get("seriesSubsidy").points[3].update({y:150});
            chart4.get("seriesSubsidy").points[4].update({y:200,dataLabels: labelstyle});
            chart4.get("seriesSubsidy").points[5].update({y:150});
            chart4.get("seriesSubsidy").points[6].update({y:150,dataLabels: labelstyle});
        } else {

        }
    }, {
        offset: "80%"
    });

    $("#chart-4-text-5").waypoint(function(direction) {
        if (direction === "down") {
            chart4.get("seriesSubsidy").points[4].update({dataLabels: {enabled: false}});
            chart4.get("seriesSubsidy").points[6].update({dataLabels: {enabled: false}});
            chart4.get("seriesSubsidy").points[7].update({y:150});
            chart4.get("seriesSubsidy").points[8].update({y:150});
            chart4.get("seriesSubsidy").points[9].update({y:225});
            chart4.get("seriesSubsidy").points[10].update({y:200});
            chart4.get("seriesSubsidy").points[11].update({y:200});
            chart4.get("seriesSubsidy").points[12].update({y:200});
            chart4.get("seriesSubsidy").points[13].update({y:200,dataLabels: labelstyle});
        } else {

        }
    }, {
        offset: "80%"
    });

    $("#chart-4-text-6").waypoint(function(direction) {
        if (direction === "down") {
            chart4.get("seriesSubsidy").points[13].update({dataLabels: {enabled: false}});
            chart4.get("seriesSubsidy").points[14].update({y:160});
            chart4.get("seriesSubsidy").points[15].update({y:140});
            chart4.get("seriesSubsidy").points[16].update({y:150});
            chart4.get("seriesSubsidy").points[17].update({y:110,dataLabels: labelstyle});
        } else {

        }
    }, {
        offset: "80%"
    });

    $("#chart-4-text-7").waypoint(function(direction) {
        if (direction === "down") {
            
        } else {

        }
    }, {
        offset: "40%"
    });

    function makeChart1a() {
      if (chart1Loaded == 1){} else {
        chart1a = new Highcharts.Chart({
            chart: {
                renderTo: 'chart-container-1a', 
                type: 'scatter',
                backgroundColor: "#043A66",
            },
            title: {text: null,},
            subtitle: {enabled: false,},
            xAxis: {
                title: {
                  text:'litres per person per day',
                  style: {color:"#fff"},
                },
                tickColor: '#b3e5fc',
                lineColor: '#b3e5fc',
                max:300,
                min:50,
                tickPositions: [50, 100, 200, 300],
                labels: {style: {color: '#fff'}}
            },
            yAxis: {    
                title: {text: null},
                labels: {enabled: false},
                gridLineWidth: 2,
                gridLineColor: '#b3e5fc',
            },
            tooltip: {enabled: false,},
            credits: { enabled: false, },
            legend:{enabled: false,},
            plotOptions: {
                series: {
                    stickyTracking: false,
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true,
                        align: 'center',
                        format: '{point.name}<br>{point.x} litres',
                        y: -15,
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: 'rgba(179, 229, 252, 0.2)',
                        backgroundColor: 'rgba(179, 229, 252, 0.2)',
                        shape: 'callout',
                        style:{
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 'normal',
                            textOutline: null,
                        },
                    },
                    states: {hover: {enabled: false}},
                },
                scatter: {
                    marker: {
                        radius: 5,
                        lineColor: '#fff',
                        lineWidth: 1,
                    },
                }
            },
            series: [{data:[
                {"name":"Taiwan<br>(2018)","x":280,"y":10, "color":"#2196f3"},
                {"name":"US (2016)","x":222,"y":10, "color":"#2196f3", dataLabels: {x:-15}},
                {"name":"UN<br>recommendation","x":165,"y":10, "color":"#2196f3", dataLabels: {x:-35,y:15,verticalAlign: 'top'}},
                {"name":"Singapore<br>(2017)","x":143,"y":10, "color":"#2196f3", dataLabels: {x:0}},
                {"name":"Thailand<br>(2011)","x":90,"y":10, "color":"#2196f3", dataLabels: {x:-15}},
            ],
            }],
        });
      } 
    };

    function makeChart1b(cat) {
        chart1b = new Highcharts.Chart({
            chart: {
                renderTo: 'chart-container-1b',
                type: 'bar',
                backgroundColor: "#043A66",
            },
            title: {text: null},
            subtitle: {enabled: false},
            xAxis: {
                categories: cat,
                tickColor: '#b3e5fc',
                labels: {style: {color: '#fff'}}
            },  
            yAxis: {
                title: {text: 'litres per person per day', x:-40, style: {color:"#fff"}},
                endOnTick: false,
                gridLineColor: 'rgba(179, 229, 252, 0.2)',
                labels: {style: {color: '#fff'}}
            },
            credits: {enabled: false},
            legend: {enabled: false},
            tooltip: {
                headerFormat: '{point.key}<br>',
                pointFormat: '<b>{point.y} litres</b>',
                backgroundColor: '#fff',
            },
            plotOptions: {
                series:{
                    borderWidth: 0,
                    groupPadding: 0.05,
                    pointPadding: 0,
                    stickyTracking: false,
                    dataLabels: {
                        enabled: true,
                        inside: true,
                        align: 'right',
                        style: {fontSize: '11px', textOutline: null},
                        format: '{point.y}',
                    }
                },
            },    
            series: [{
                name:"Domestic water consumption", 
                color:"#2196f3", 
                data: dataCountryWater
            }],
        });
    }

    function makeChart2(cat) {
        chart2 = new Highcharts.Chart({
            chart: {
                renderTo: 'chart-container-2',type: 'bar',
                marginLeft: 105,
                backgroundColor: "#E3F9FC",
            },
            title: {text: null},
            subtitle: {enabled: false},
            xAxis: {categories: cat,
                labels: {style: {whiteSpace: "nowrap",color:"#033a66"},},
            },  
            yAxis: {
                title: {text: 'litres per person per day', x:-40, style: {color:"#033a66"}},
                endOnTick: false,
                gridLineColor: 'rgba(3, 58, 102, 0.5)',
                labels: {style: {color: '#033a66'}}
            },
            credits: {enabled: false},
            legend: {enabled: false},
            tooltip: {
                headerFormat: '{point.key}<br>',
                pointFormat: '<b>{point.y} litres</b>',
                backgroundColor: '#fff',
                style: {color: '#033a66'}
            },
            plotOptions: {
                series:{
                    groupPadding: 0.05,
                    pointPadding: 0,
                    stickyTracking: false,
                    dataLabels: {
                        whiteSpace: "nowrap",
                        enabled: true,
                    },
                },
            },    
            series: [{
                dataLabels: [{
                    style: {fontSize: '11px', textOutline: null, color:"#033a66"},
                    format: '{point.y}',
                },{
                    style: {fontSize: '12px', textOutline: null},
                    format: '{point.note}',
                    align: 'left',
                    inside: true,
                }],
                name:"Domestic water consumption", 
                color:"#2196f3", 
                data: dataStateWater,
            }],
        });
    }

    function makeChart3a() {
        if (chart3Loaded == 1){} else {
            chart3a = new Highcharts.Chart({
                chart: {
                    renderTo: 'chart-container-3a', 
                    type: 'scatter',
                    backgroundColor: "#537590",
                },
                title: {
                    text: null,
                },
                subtitle: {
                    enabled: false,
                },
                xAxis: {
                    title: {
                        useHTML: true,
                        text:'RM per m<sup>3</sup> (1000 litres) of wastewater',
                        style: {color:"#fff"},
                    },
                    max:12,
                    min:0,
                    tickPositions: [0, 2, 4, 6, 8, 10, 12],
                    tickColor: '#b3e5fc',
                    lineColor: '#b3e5fc',
                    labels: {style: {color: '#fff'}}
                },
                yAxis: {    
                    title: {text: null},
                    labels: {enabled: false},
                    gridLineWidth: 2,
                    gridLineColor: '#b3e5fc',
                },
                tooltip: {enabled: false,},
                credits: { enabled: false, },
                legend:{enabled: false,},
                plotOptions: {
                    series: {
                        stickyTracking: false,
                        dataLabels: {
                            enabled: true,
                            allowOverlap: true,
                            align: 'center',
                            format: '{point.name}<br>{point.x}',
                            y: -15,
                            borderRadius: 5,
                            borderWidth: 0.5,
                            borderColor: 'rgba(179, 229, 252, 0.2)',
                            backgroundColor: 'rgba(179, 229, 252, 0.2)',
                            shape: 'callout',
                            style:{
                                color: '#fff',
                                fontSize: '11px',
                                fontWeight: 'normal',
                                textOutline: null,
                            },
                        },
                        states: {hover: {enabled: false}},
                    },
                    scatter: {
                        marker: {
                            radius: 5,
                            lineColor: '#fff',
                            lineWidth: 1,
                        },
                    }
                },
                series: [{data:[
                    {"name":"Tokyo,<br>Japan", "x":10.43, "y":10, "color":"#2196f3", dataLabels: {x:-10}},
                    {"name":"Sydney,<br>Australia", "x":5.91, "y":10, "color":"#2196f3", dataLabels: {x:15}},
                    {"name":"Global<br>average", "x":4.15, "y":10, "color":"#2196f3", dataLabels: {x:-13}},
                    {"name":"Singapore", "x":2.97, "y":10, "color":"#2196f3", dataLabels: {x:35, y:15,verticalAlign: 'top'}},
                    {"name":"Hanoi,<br>Vietnam", "x":0.13, "y":10, "color":"#2196f3", dataLabels: {x:10}},
                ],
                }],
            });
        } 
    };

    function makeChart3b(cat) {
        chart3b = new Highcharts.Chart({
            chart: {
                renderTo: 'chart-container-3b',type: 'bar',
                backgroundColor: "#537590",
            },
            title: {text: null},
            subtitle: {enabled: false},
            xAxis: {
                categories: cat,
                tickColor: '#b3e5fc',
                labels: {style: {color: '#fff'}}
            },  
            yAxis: {
                title: {useHTML: true, text: 'RM per m<sup>3</sup> (1000 litres)', x:-40, style: {color:"#fff"}},
                endOnTick: false,
                gridLineColor: 'rgba(179, 229, 252, 0.2)',
                labels: {style: {color: '#fff'},},
            },
            credits: {enabled: false},
            legend: {enabled: false},
            tooltip: {
                headerFormat: '{point.key}<br>',
                pointFormat: '<b>{point.y}</b>',
                backgroundColor: '#fff',
            },
            plotOptions: {
                series:{
                    borderWidth: 0,
                    groupPadding: 0.05,
                    pointPadding: 0,
                    stickyTracking: false,
                    dataLabels: {
                        enabled: true,
                        style: {fontSize: '11px', textOutline: null, color:"#fff"},
                        format: '{point.y}',
                    }
                },
            },    
            series: [{
                name:"Wasterwater cost", 
                color:"#2196f3", 
                data: dataCost
            }],
        });
    }

    function makeChart4() {
        if (chart4Loaded == 1){} else {
            chart4 = new Highcharts.Chart({
                chart: {
                    renderTo: 'chart-container-4',
                    type: 'column',
                    marginLeft: 60,
                    backgroundColor: "#ECEAED",
                },
                title: {text: null},
                subtitle: {enabled: false},
                xAxis: {
                    categories: dataSubsidyCat,
                    labels: {style: {whiteSpace: "nowrap",color:"#033a66"},},
                },  
                yAxis: {
                    title: {text: 'million RM', style: {color:"#033a66"}},
                    endOnTick: false,
                    max: 250,
                    gridLineColor: 'rgba(3, 58, 102, 0.5)',
                    labels: {style: {color: '#033a66'}}
                },
                credits: {enabled: false},
                legend: {enabled: false},
                tooltip: {
                    headerFormat: 'Year {point.key}<br>',
                    pointFormat: '<b>RM{point.y} mil</b>',
                    backgroundColor: '#fff',
                    style: {color: '#033a66'}
                },
                plotOptions: {
                    series:{
                        borderWidth: 0,
                        groupPadding: 0.05,
                        pointPadding: 0,
                        stickyTracking: false,
                        dataLabels: {
                            enabled: false,
                            style: {fontSize: '11px', textOutline: null},
                            format: '{point.y}',
                        }
                    },
                },    
                series: [{
                    name:"seriesSubsidy", 
                    id:"seriesSubsidy", 
                    color:"#2196f3", 
                    data: dataSubsidy1
                }],
            });
        }    
    }    

    function sendGuess() {
        $.ajax({
            type: 'POST',
            url: 'https://docs.google.com/forms/d/e/1FAIpQLSfjP3H4DXVjWNWcrmRsZbVrhzVRIJrh6TgS6OvcPhQyC6-M4A/formResponse',
            data: { 
            "entry.2142550281":guessX,
            "entry.1210402368":document.referrer,
            }
        }); 
    }

    function sendData() {
        $.ajax({
            type: 'POST',
            url: 'https://docs.google.com/forms/d/e/1FAIpQLSc_swFKZ9KH7YmDgKH1mOhHdBKjSXWopWCchKqzSizG38kpnA/formResponse',
            data: { 
            "entry.357644269":guessX,
            "entry.1379904423":yourState,
            "entry.132543271":guessY,
            "entry.970216743":payAnswer,
            "entry.1696631998":payExtra,
            "entry.1587083114":userInputs[0],
            "entry.714099920":userInputs[1],
            "entry.340349913":userInputs[2],
            "entry.282919883":email,
            "entry.1516523261":document.referrer,
            }
        }); 
    }
});     