angular.module('quizRT')
    .directive('gameStatPieChart',function(){
        return{
            replace:true,
            restrict:'EA',
            link: function(scope, elem, attrs){
                var canvasWidth = 300,
                    canvasHeight = 300,
                    outerRadius = 100;
                var dataSet=JSON.parse(attrs.chartData);
                var filterDataSet=[];
                var color=[];
                var len=dataSet.length;
                for (i=0;i<len;i++){
                  if(dataSet[i]["magnitude"]!=0){
                    if (dataSet[i]["legendLabel"]=="Correct")
                      color.push("#0F802D");
                    else if(dataSet[i]["legendLabel"]=="Wrong")
                        color.push("#DE0F0F");
                    else
                        color.push("#009688");

                    filterDataSet.push(dataSet[i]);
                  }
                }
                new Promise(function(resolve,reject){
                  setTimeout(function(){
                  resolve();
                  console.log("hello..from");
                },10);
                }).then(function(){
                  console.log("#"+attrs.id+"_pieChart");
                  var vis = d3.select("#"+attrs.id+"_pieChart")
                      .append("svg")
                      .data([filterDataSet])
                      .attr("width", canvasWidth)
                      .attr("height", canvasHeight)
                      .append("g")
                      .attr("transform", "translate(" + 1.5*outerRadius + "," + 1.5*outerRadius + ")")
                  var arc = d3.svg.arc()
                      .outerRadius(outerRadius);
                  var arcOver=d3.svg.arc()
                      .outerRadius(outerRadius+20);
                  var pie = d3.layout.pie()
                      .value(function(d) { return d.magnitude})
                      .sort( function(d) { return null; } );
                  var arcs = vis.selectAll("g.slice")
                      .data(pie)
                      .enter()
                      .append("g")
                      .attr("class", "slice");
                  arcs.append("path")
                      .attr("fill", function(d, i) { return color[i]; } )
                      .attr("d", arc)
                  arcs.append("text")
                      .attr("transform", function(d) {
                          d.outerRadius = outerRadius + 50;
                          d.innerRadius = outerRadius + 45;
                          return "translate(" + arc.centroid(d) + ")";
                      })
                      .attr("text-anchor", "middle")
                      .style("fill", "white")
                      .style("font", "bold 12px Arial")
                      .text(function(d, i) { return "  %" + filterDataSet[i].legendLabel+"   "; });
                  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
                      .attr("dy", ".35em")
                      .attr("text-anchor", "middle")
                      .attr("transform", function(d) {
                          d.outerRadius = outerRadius;
                          d.innerRadius = outerRadius/2;
                          return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
                      })
                      .style("fill", "White")
                      .style("font", "bold 12px Arial")
                      .text(function(d) { return d.data.magnitude.toFixed(2); });
                  arcs.on("click",function(d){
                      console.log(d);
                      console.log(d["data"].legendLabel+","+scope.gameId);
                      scope.getBarChartData(d["data"].userId,scope.gameId,d["data"].legendLabel);
                      var uid=d["data"].userId;
                      var margin = {top: 40, right: 20, bottom: 20, left: 40},
                      width =300 - margin.left - margin.right,
                      height =300 - margin.top - margin.bottom,
                      x = d3.scale.ordinal().rangeRoundBands([0, width],0.85),
                      y = d3.scale.linear().range([height, 0]),

                      xAxis = d3.svg.axis()
                          .scale(x)
                          .orient("bottom")
                          .tickSize(2),
                      yAxis = d3.svg.axis()
                          .scale(y)
                          .orient("left")
                          .ticks(10)
                          .tickSize(2)
                      if(angular.element("#"+uid+"_barChart").length)
                        d3.select("#"+uid+"_barChart").select("svg").remove();
                      var svg = d3.select("#"+uid+"_barChart").append("svg")
                          .attr("width", width + margin.left + margin.right)
                          .attr("height", height + margin.top + margin.bottom)
                          .append("g")
                          .attr("transform","translate(" + margin.left + "," + margin.top + ")");
                          console.log(uid);
                          setTimeout(function(){
                            console.log(scope.uid);
                                data=scope.uid;
                                x.domain(data.map(function(d) { return d.questionNumber;}));
                                y.domain([0, d3.max(data, function(d) { return d.responseTime; })]);

                                //code for tooltip
                                var tip = d3.tip()
                                    .attr('class', 'd3-tip')
                                    .offset([-10, 0])
                                    .html(function(d) {
                                        return "<strong>ResponseTime:</strong> <span style='color:white'>" + d.responseTime + "</span>";
                                    });

                                svg.append("text")
                                    .attr("class", "x label")
                                    .attr("text-anchor", "end")
                                    .attr("x", width+10)
                                    .attr("y", 260)
                                    .text("Question Number");
                                svg.append("g")
                                    .attr("class", "x axis")
                                    .attr("transform", "translate(0," + height + ")")
                                    .call(xAxis)
                                    .selectAll("text")
                                    .style("text-anchor", "end")
                                    .attr("dx", ".3em");


                                //call tooltip
                                svg.call(tip);

                                svg.append("g")
                                    .attr("class", "y axis")
                                    .call(yAxis)
                                    .append("text")
                                    .attr("transform", "rotate(-90)")
                                    .attr("y", 6)
                                    .attr("dy", ".71em")
                                    .style("text-anchor", "end")
                                    .text("Response Time(in sec)");



                                svg.selectAll("bar")
                                    .data(data)
                                    .enter().append("rect")
                                    .style("fill", "#E64E4E")
                                    .attr("x", function(d) { return x(d.questionNumber); })
                                    .attr("width", x.rangeBand())
                                    .attr("y", function(d) { return y(d.responseTime); })
                                    .attr("height", function(d) { return height - y(d.responseTime); })
                                    .on('mouseover', tip.show)
                                    .on('mouseout', tip.hide);
                          },100);

                  });
                  function angle(d) {
                      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
                      return a > 90 ? a - 180 : a;
                  }
                });

            }
        };
    });
