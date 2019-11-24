var LeafIcon = L.Icon.extend({
                options: {
                    iconSize:     [40, 40],
                }
            });

            var assaultRifle = new LeafIcon({iconUrl: 'icon/assault-rifle.png'}),
                bankIcon = new LeafIcon({iconUrl: 'icon/bank.png'}),
                bombIcon = new LeafIcon({iconUrl: 'icon/bomb.png'});
            var markersLayer = new L.LayerGroup();
            var arr2 = [];
            var map = L.map('map',{
            center: [0.7893, 113.9213],
            zoom: 4
            });
        
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);


            //Timeline
            google.charts.load("current", {packages:["timeline"]});
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                $.getJSON( "timeline.json", function(data) {
                var item = data.data;
                table = ["Team", "qwerty",{ type: 'string', id: 'style', role: 'style' }, {type: 'date', label: 'Season Start Date'}, {type: 'date', label: 'Season End Date'}];
                item.splice(0,0,table);
                var container = document.getElementById('example5.1');
                var chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.arrayToDataTable(item);
                var options = {
                    //timeline: { colorByRowLabel: true },
                    tooltip:{trigger:'none'}
                };

                chart.draw(dataTable, options);

                //console.log(item);
                });

                $.getJSON( "timeline.json", function(data) {
                    var item = data.data;
                    table = ["Team", "qwerty",{ type: 'string', id: 'style', role: 'style' }, {type: 'date', label: 'Season Start Date'}, {type: 'date', label: 'Season End Date'}];
                    item.splice(0,0,table);
                    var container = document.getElementById('example5.2');
                    var chart = new google.visualization.Timeline(container);
                    var dataTable = new google.visualization.arrayToDataTable(item);
                    var options = {
                        //timeline: { colorByRowLabel: true },
                        tooltip:{trigger:'none'}
                    };

                    chart.draw(dataTable, options);

                    //console.log(item);
                });

                
            }

            // BarChart
            $.get('./id.json', function(data){
                var json = data.data;
                string = json;
                var behaviourSlider = document.getElementById('behaviour');
                var startSlide = 1;
                var endSlide = 94;
                noUiSlider.create(behaviourSlider, {
                    start: [startSlide, endSlide],
                    step: 1,
                    behaviour: 'drag',
                    connect: true,
                    format: wNumb({
                    decimals: 0
                }),
                range: {
                    'min': 1,
                    'max': 94
                }
                });
                
                $('#startDate').val(string[startSlide]);
                $('#endDate').val(string[endSlide]);
                var splitStartDate = string[startSlide].split("Q");
                var splitEndDate = string[endSlide].split("Q");
                
                $('.str-startDate').html(splitStartDate[0] + ' Quarter ' + splitStartDate[1]);
                $('.str-endDate').html(splitEndDate[0] + ' Quarter ' + splitEndDate[1]);


                $.getJSON( "datav20.json", function(data) {
                    var tahun_awal = string[startSlide].substring(0,4)
                    var tahun_akhir = string[endSlide].substring(0,4);
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
                    google.charts.setOnLoadCallback(drawChart);
                    function drawChart() {

                        var data2 = google.visualization.arrayToDataTable(items);
                        console.log(data2);
                        var options = {
                        bars: 'horizontal' // Required for Material Bar Charts.
                        };

                        var chart = new google.charts.Bar(document.getElementById('barchart_material'));

                        chart.draw(data2, google.charts.Bar.convertOptions(options));
                        google.visualization.events.addListener(chart, 'select', selectHandler);

                        function selectHandler() {
                            alert('You selected ');


                        }     
                    }
                    
                    markersLayer.addTo(map);
            

                behaviourSlider.noUiSlider.on('change', function(val){
                    markersLayer.clearLayers();
                    var arr2 = [];

                    var val = val;
                    $('.str-startDate').html(string[val[0]-1].substring(0,4) + " Quarter " + string[val[0]-1].substring(5,6));
                    $('.str-endDate').html(string[val[1]-1].substring(0,4) + " Quarter " + string[val[1]-1].substring(5,6));

                    $.getJSON( "datav20.json", function(data) {
                        var tahun_awal = string[val[0]-1].substring(0,4);
                        var tahun_akhir = string[val[1]-1].substring(0,4);
                        var table = ['kelompok','jumlah aksi'];
                        var dict = {};

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
                        google.charts.setOnLoadCallback(drawChart);

                        function drawChart() {

                            var data2 = google.visualization.arrayToDataTable(items);
                            console.log(data2);
                            var options = {
                            bars: 'horizontal' // Required for Material Bar Charts.
                            };

                            var chart = new google.charts.Bar(document.getElementById('barchart_material'));

                            chart.draw(data2, google.charts.Bar.convertOptions(options));
                            google.visualization.events.addListener(chart, 'select', selectHandler);

                            function selectHandler() {

                                $.get('./id.json', function(data){
                                    var json = data.data;
                                    string = json;
                                    $.getJSON( "datav20.json", function(data) {
                                        var tahun_awal = string[val[0]-1].substring(0,4);
                                        var tahun_akhir = string[val[1]-1].substring(0,4);
                                        var selection = chart.getSelection();
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
                                                            marker[data[i][j].data[k].index] = L.marker([data[i][j].data[k].lat, data[i][j].data[k].lng], {icon: assaultRifle}).on('click', function(e){
                                                                $('#detailModal').modal('show');
                                                                $(this).attr('id',data[i][j].data[k].index);
                                                                
                                                            });
                                                            markersLayer.addLayer(marker[data[i][j].data[k].index]);
                                                        }
                                                    }
                                                }
                                            }	      
                                        }
                                    });
                                })
                                
                                
                            }     
                        }

                        
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