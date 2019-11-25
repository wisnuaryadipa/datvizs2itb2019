


$(document).ready(function(){

    var arr2Init = [];
    var startSlide = 1995;
    var endSlide = 2018;
    var items = [];

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
    google.charts.setOnLoadCallback(drawBarcodeChart);
    function drawBarcodeChart() {
    $.getJSON( "timeline4.json", function(data) {
        var tahun_awal = 2016;
        var tahun_akhir = 2020;
        var arr2 = data.data;
        console.log(arr2);
        /*for (var i in data){
        if(i<=tahun_akhir && i>=tahun_awal)     
            for(var j in data[i]) {
            for(var k in data[i][j].data) {
                item = data[i][j].data[k].group;
                if(item!='Unknown'){
                arr = [];
                arr.push(data[i][j].data[k].group);
                arr.push(data[i][j].data[k].space);
                arr.push(data[i][j].data[k].color);
                arr.push(data[i][j].data[k].start_date);
                arr.push(data[i][j].data[k].end_date);
                arr2.push(arr);
                }
            }         
            }
        }*/

        table = ["Team", "qwerty",{ type: 'string', id: 'style', role: 'style' }, {type: 'date', label: 'Season Start Date'}, {type: 'date', label: 'Season End Date'}];
        arr2.splice(0,0,table);
        var container = document.getElementById('example5.1');
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.arrayToDataTable(arr2);
        var options = {
        //timeline: { colorByRowLabel: true },
        //tooltip:{trigger:'none'}

        };

        chart.draw(dataTable, options);
    });
    $.getJSON( "timeline.json", function(data) {
        

        //console.log(item);
    });

    }
    
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




    var markersLayer = new L.markerClusterGroup();
    var arr2 = [];
    var map = L.map('map',{
        center: [-2.952641, 117.182954],
        zoom: 5
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.light'
	}).addTo(map);

    console.log(statesData)
    L.geoJSON(statesData).addTo(map);
    
    
    makeSliderRange(startSlide, endSlide);

    var barChart;
    items = createItems(startSlide, endSlide);
    


    google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(drawinitBarChart);
    function drawinitBarChart() {

        var data22 = google.visualization.arrayToDataTable(items);
        
        var options = {
            bars: 'horizontal', // Required for Material Bar Charts.,
            backgroundColor: { fill:'transparent' },
            vAxis : { textPosition : 'none' } 
        };

        barChart = new google.charts.Bar(document.getElementById('barchart_material'));

        barChart.draw(data22, google.charts.Bar.convertOptions(options));
    }

    drawAllViz(startSlide, endSlide);



    function makeSliderRange(startSlide, endSlide){
        var behaviourSlider = document.getElementById('behaviour');

        noUiSlider.create(behaviourSlider, {
            start: [startSlide, endSlide],
            step: 1,
            tooltips: true,
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

        

        behaviourSlider.noUiSlider.on('change', function(val){

            var val = val;
            
            var arr2 = [];
            arr2 = arr2Init.slice(0);
            markersLayer.clearLayers();

            var tahun_awal = val[0]-1;
            var tahun_akhir = val[1]-1;

            drawAllViz(tahun_awal, tahun_akhir);
                
        });

    }

    $('.leaflet-marker-icon').on('click', function(e) {

        id = $(this).attr('id');
        alert(id);
    });


    function createItems(startDate, endDate){
        var itemss = null;
        $.ajax({
            url: 'datav20.json',
            async: false,
            dataType: 'json',
            success: function (data) {
                var tahun_awal = startDate;
                var tahun_akhir = endDate;
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

                                    marker = L.marker([data[i][j].data[k].lat, data[i][j].data[k].lng], {
                                            icon: fnGetIcon(data[i][j].data[k].attack_type)
                                        });
                                    markersLayer.addLayer(marker);
                                }
                            }
                        }

                    } 
                }


                // Create items array
                items = Object.keys(dict).map(function(key) {
                    return [key, dict3[key], dict[key], dict1[key], dict2[key]]
                });

                // Sort the array based on the second element
                items.sort(function(first, second) {
                    return second[1] - first[1];
                });

                items = items.slice(0,10);
                items.splice(0,0,table);
                
                itemss = items.slice(0,10);
            }
        });
        return itemss;
    }

    function drawAllViz(startDate, endDate){
        
            markersLayer.clearLayers();

            $.getJSON( "datav20.json", function(data) {
                var tahun_awal = startDate;
                var tahun_akhir = endDate;
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

                                    marker = L.marker([data[i][j].data[k].lat, data[i][j].data[k].lng], {
                                            icon: fnGetIcon(data[i][j].data[k].attack_type)
                                        });
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
        
                updateBarChart(tahun_awal, tahun_akhir, items);
                
                table = ["Team", "qwerty",{ type: 'string', id: 'style', role: 'style' }, {type: 'date', label: 'Season Start Date'}, {type: 'date', label: 'Season End Date'}];
                arr2.splice(0,0,table);
                

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
    }


    function updateBarChart(startDate, endDate, items){
        
        var data2 = google.visualization.arrayToDataTable(items);
        console.log(data2);
        var options = {
            bars: 'horizontal',
            vAxis : { textPosition : 'in' } 
        };

        barChart.draw(data2, google.charts.Bar.convertOptions(options));
        google.visualization.events.addListener(barChart, 'select', selectHandler);

        function selectHandler() {
            console.log('asasda')
            var arrLatLng = [];
            $.get('./id.json', function(data){
                var json = data.data;
                string = json;
                $.getJSON( "datav20.json", function(data) {
                    var tahun_awal = startDate;
                    var tahun_akhir = endDate;
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
            });
        }     
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
});


