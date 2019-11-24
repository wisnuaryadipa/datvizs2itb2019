


$(document).ready(function(){

    google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawLineChart);

    function drawLineChart() {
      $.getJSON( "linechart.json", function(d) {
        var data = new google.visualization.DataTable();
        data.addColumn('number', '');
        data.addColumn('number', 'fearness');

        data.addRows(d.data);

        var options = {
            colors: ['red'],
            backgroundColor: { fill: 'transparent', stroke: 'transparent' },
            axes: {
                x: {
                    0: {
                        side: 'bottom', 
                        label: ""
                    }
                },
                y: {
                    0: {
                        side: 'left', 
                        label: "fearness"
                    }
                }
            },
            hAxis: { 
                format: '',
                textPosition: 'none', 
                fontSize: 0, 
                textStyle: { 
                    fontSize: 15,
                }, 
                maxValue: 2018, 
                viewWindow: { 
                    max: 2018, 
                    min: 1995 
                }, 
                gridlines: { 
                    color: 'transparent'
                }, 
                minorGridlines: { 
                    color: 'transparent'
                },
                
            },
          vAxis: { 
                title:"Fearness",
                gridlines: { 
                    color: 'transparent'
                }, 
                textPosition: 'none', fontSize: 0, textStyle: { fontSize: 0 } },
          legend: {position: 'none'}
        };

        var chart = new google.charts.Line(document.getElementById('line_top_x'));

        chart.draw(data, google.charts.Line.convertOptions(options));

      });

      
    }


    $('.btn-mowapa').on('click', function(){
        $('.wakwaw').show();
    })

    $('#btn-close').on('click', function(){
        $('.wakwaw').hide();
    })

    var timelineData;
    
    $.getJSON( "timeline.json", function(data) {
        timelineData = data.data;
    });

    google.charts.load("current", {packages:["timeline"]});
    google.charts.setOnLoadCallback(drawTimeline);

    function drawTimeline(){
        var item = timelineData;
        table = ["Team", "qwerty",{ type: 'string', id: 'style', role: 'style' }, {type: 'date', label: 'Season Start Date'}, {type: 'date', label: 'Season End Date'}];
        item.splice(0,0,table);
        var container = document.getElementById('example5.1');
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.arrayToDataTable(item);
        var options = {
            tooltip:{trigger:'none'}
        };
        chart.draw(dataTable, options);
    }

    
    
});

var LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [40, 40],
    }
});

var assaultRifle = new LeafIcon({iconUrl: 'icon/assault-rifle.png'}),
    bankIcon = new LeafIcon({iconUrl: 'icon/bank.png'}),
    bombIcon = new LeafIcon({iconUrl: 'icon/bomb.png'});


var markersLayer = new L.markerClusterGroup();
var arr2 = [];
var map = L.map('map',{
    center: [-2.952641, 117.182954],
    zoom: 5
});

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



// BarChart
$.get('./id.json', function(data){
    var json = data.data;
    string = json;
    console.log(string);
    var behaviourSlider = document.getElementById('behaviour');
    var startSlide = 1995;
    var endSlide = 2018;
    noUiSlider.create(behaviourSlider, {
        start: [startSlide, endSlide],
        step: 1,
        behaviour: 'drag',
        connect: true,
        format: wNumb({
            decimals: 0
        }),
        range: {
            'min': 1995,
            'max': 2018
        }
    });
    
    $('#startDate').val(startSlide);
    $('#endDate').val(endSlide);
    var splitStartDate = startSlide;
    var splitEndDate = endSlide;
    
    $('.str-startDate').html(splitStartDate);
    $('.str-endDate').html(splitEndDate);
    var barChart;

    $.getJSON( "datav20.json", function(data) {
        var tahun_awal = startSlide;
        var tahun_akhir = endSlide;
        var table = ['kelompok','jumlah aksi'];
        var dict = {};
        var arr2 = [];

        for (var i in data){
            if(i<=tahun_akhir && i>=tahun_awal)			
            for(var j in data[i]) {
                for(var k in data[i][j].data) {
                    item = data[i][j].data[k].group;
                    if(item!='Unknown'){
                        dict[item] = (dict[item] + 1) || 1;
                        arr = [];
                        arr.push(data[i][j].data[k].group);
                        arr.push(data[i][j].data[k].space);
                        arr.push(data[i][j].data[k].color);
                        arr.push(data[i][j].data[k].start_date);
                        arr.push(data[i][j].data[k].end_date);
                        arr2.push(arr);
                        
                        marker = L.marker([data[i][j].data[k].lat, data[i][j].data[k].lng]);
                        markersLayer.addLayer(marker);
                    }
                }
            }
        }

        // Create items array
        var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
        });

        // Sort the array based on the second element
        items.sort(function(first, second) {
        return second[1] - first[1];
        });



        items = items.slice(0, 10);
        items.splice(0,0,table);
        
        //console.log(items);   
        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawBarChart);
        function drawBarChart() {

            var data2 = google.visualization.arrayToDataTable(items);
            console.log(data2);
            var options = {
                bars: 'horizontal', // Required for Material Bar Charts.,
                backgroundColor: { fill:'transparent' }
            };

            barChart = new google.charts.Bar(document.getElementById('barchart_material'));

            barChart.draw(data2, google.charts.Bar.convertOptions(options));
        }
        
        markersLayer.addTo(map);

    var arr2Init = [];
    $.getJSON("RowInit.json", function(data){
        for( var i in data){
            for(var j in data[i]) {
                
                for(var k in data[i][j].data) {
                    arr = [];
                    arr.push(data[i][j].data[k].group);
                    arr.push(data[i][j].data[k].space);
                    arr.push(data[i][j].data[k].color);
                    
                    arr.push(data[i][j].data[k].start_date);
                    arr.push(data[i][j].data[k].end_date);
                    arr2Init.push(arr);
                }
            }
        }


    }); 


    behaviourSlider.noUiSlider.on('change', function(val){

        var arr2 = [];
        arr2 = arr2Init.slice(0);
        markersLayer.clearLayers();
        

        var val = val;
        $('.str-startDate').html(val[0]-1);
        $('.str-endDate').html(val[1]-1);

        $.getJSON( "datav20.json", function(data) {
            var tahun_awal = val[0]-1;
            var tahun_akhir = val[1]-1;
            var table = ['kelompok','fearness', 'jumlah aksi','nkill','nwound'];
            var dict = {};
            var dict1 = {};
            var dict2 = {};
            var dict3 = {};
            var nkill = 0;
            var wonded = 0;

            for (var i in data){
            if(i<=tahun_akhir && i>=tahun_awal) {

                for(var j in data[i]) {
                    
                    for(var k in data[i][j].data) {
                        item = data[i][j].data[k].group;
                        nkill = parseInt(data[i][j].data[k].nkill);
                        wonded = parseInt(data[i][j].data[k].nwound);
                        fearness = parseInt(data[i][j].data[k].fear);

                        if(item!='Unknown'){
                            dict1[item] = (dict1[item] + nkill) || nkill;
                            dict2[item] = (dict2[item] + wonded) || wonded;
                            dict3[item] = (dict3[item] + fearness) || fearness;
                            dict[item] = (dict[item] + 1) || 1;
                            arr = [];
                            arr.push(data[i][j].data[k].group);
                            arr.push(data[i][j].data[k].space);
                            arr.push(data[i][j].data[k].color);
                            
                            arr.push(data[i][j].data[k].start_date);
                            arr.push(data[i][j].data[k].end_date);
                            arr2.push(arr);

                            marker = L.marker([data[i][j].data[k].lat, data[i][j].data[k].lng]);
                            markersLayer.addLayer(marker);
                        }
                    }
                }

            } 
            }


            // Create items array
            var items = Object.keys(dict).map(function(key) {
                return [key, dict3[key], dict[key], dict1[key], dict2[key]]
            });

            // Sort the array based on the second element
            items.sort(function(first, second) {
                return second[1] - first[1];
            });

            items = items.slice(0,10);
            items.splice(0,0,table);
        
            // //console.log(items);
            // google.charts.load('current', {'packages':['bar']});
            // google.charts.setOnLoadCallback(drawChart);



            function drawBarChart() {

                var data2 = google.visualization.arrayToDataTable(items);
                console.log(data2);
                var options = {
                bars: 'horizontal' // Required for Material Bar Charts.
                };

                // var chart = new google.charts.Bar(document.getElementById('barchart_material'));
                console.log(barChart)
                barChart.draw(data2, google.charts.Bar.convertOptions(options));
                google.visualization.events.addListener(barChart, 'select', selectHandler);

                function selectHandler() {

                            var arrLatLng = [];
                    $.get('./id.json', function(data){
                        var json = data.data;
                        string = json;
                        $.getJSON( "datav20.json", function(data) {
                            var tahun_awal = string[val[0]-1];
                            var tahun_akhir = string[val[1]-1];
                            var selection = barChart.getSelection();
                            var row = selection[0].row;
                            var label = data2.getValue(row, 0);
                            markersLayer.clearLayers();
                            for (var i in data){
                                if(i<=tahun_akhir && i>=tahun_awal) {
                                    for(var j in data[i]) {
                                        
                                        for(var k in data[i][j].data) {
                                            item = data[i][j].data[k].group;
                                            if(item == label){
                                                console.log(data[i][j].data[k].index);
                                                marker[data[i][j].data[k].index] = L.marker([data[i][j].data[k].lat, data[i][j].data[k].lng], 
                                                {
                                                    icon: fnGetIcon(data[i][j].data[k].attack_type)
                                                }).on('click', function(e){
                                                    $('#detailModal').modal('show');
                                                    $(this).attr('id',data[i][j].data[k].index);
                                                    
                                                });
                                                markersLayer.addLayer(marker[data[i][j].data[k].index]);
                                                arrLatLng.push(marker[data[i][j].data[k].index]);
                                            }
                                        }
                                    }
                                }	      
                            }
                            console.log(arrLatLng)
                            var group = new L.featureGroup(arrLatLng);
                            map.fitBounds(group.getBounds());

                        });
                    })
                    
                    
                }     
            }
            drawBarChart();
            
            table = ["Team", "qwerty",{ type: 'string', id: 'style', role: 'style' }, {type: 'date', label: 'Season Start Date'}, {type: 'date', label: 'Season End Date'}];
            arr2.splice(0,0,table);
            var container = document.getElementById('example5.1');
            var chart = new google.visualization.Timeline(container);
            var dataTable = new google.visualization.arrayToDataTable(arr2);
            var options = {
                //timeline: { colorByRowLabel: true },
                tooltip:{trigger:'none'}

            };

            chart.draw(dataTable, options);

            $('#btn-detail-timeline').on('click', function(e){
                $("#card-timeline").animate({height: '90%', width: '90%', position: 'absolute'});
                console.log(arr2);
                table = ["Team", "qwerty",{ type: 'string', id: 'style', role: 'style' }, {type: 'date', label: 'Season Start Date'}, {type: 'date', label: 'Season End Date'}];
                arr2.splice(0,0,table);
                var container = document.getElementById('example5.2');
                var chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.arrayToDataTable(arr2);
                var options = {
                    //timeline: { colorByRowLabel: true },
                    tooltip:{trigger:'none'}

                };

                chart.draw(dataTable, options);

            });

        });

        
        markersLayer.addTo(map);
    });
})
    
})

$('.leaflet-marker-icon').on('click', function(e) {

    id = $(this).attr('id');
    alert(id);
})


function updateBarChart(startDate, endDate){

}


function fnGetIcon(attckType){

    var LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [38, 38],
       shadowSize:   [50, 64],
       iconAnchor:   [22, 94],
       shadowAnchor: [4, 62],
       popupAnchor:  [-3, -76]
    }
    });


    var assassination_icon = new LeafIcon({iconUrl: 'icon/icons8-horror-80.png'}),
        unarmed_assault_icon = new LeafIcon({iconUrl: 'icon/icons8-punching-80.png'}),
        armed_assault_icon = new LeafIcon({iconUrl: 'icon/icons8-assault-rifle-80.png'}),
        facility_icon = new LeafIcon({iconUrl: 'icon/icons8-museum-80.png'}),
        explotion_icon = new LeafIcon({iconUrl: 'icon/icons8-explosion-80.png'}),
        kidnapping_icon = new LeafIcon({iconUrl: 'icon/hostage_icon.png'}),
        hijacking_icon = new LeafIcon({iconUrl: 'icon/hijacking.png'}),
        unknow_icon = new LeafIcon({iconUrl: 'icon/icons8-decision-80.png'});

    if (attckType == 'Armed Assault') {

        return armed_assault_icon;

    } else if(attckType == 'Assassination'){

        return assassination_icon;

    } else if(attckType == 'Bombing/Explosion'){

        return explotion_icon;

    } else if(attckType == 'Hostage Taking (Kidnapping)'){

        return kidnapping_icon;

    } else if(attckType == 'Unarmed Assault'){

        return unarmed_assault_icon;

    } else if(attckType == 'Hostage Taking (Barricade Incident)'){
    
        return kidnapping_icon;

    } else if(attckType == 'Facility/Infrastructure Attack'){

        return facility_icon;

    } else if(attckType == 'Hijacking'){

        return hijacking_icon;

    } else {

        return unknow_icon;

    }
}