      // decide on the size of the new SVG first
      var w = 600;
      var h = 250;
      var barPadding = 1; // make space between bars

      var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
							11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

      // introduce an ordinal scale to handle the left/right positioning of bars
      // and labels along the x axis
      var xScale = d3.scaleBand() // use ordinal becasue we want the bars to
                          // be drawn from left to right using the same order
                          // in which values occur in our dataset. Ordinal scale
                          // is useful when we have many visual elements (bars)
                          // that are positioned in an arbitrary order but must
                          // be evenly spaced. scale.ordinal is replaced with
                          // scaleBand in 4.0 which includes both ordinal and
                          // rangeBands
                      .domain(d3.range(dataset.length)) // d3.range replaces
                        // a for loop to return an array of values from 0 to
                        // datalength
                      .range([0, w])
                      ;

      var yScale = d3.scaleLinear()
                      .domain([0, d3.max(dataset)])
                      .range([0, h])
                      ;

      // then tell D3 to create an empty SVG element and add it to the DOM
      // this insert a new <svg> element just before the closing </body> tag.
      // this statement also puts the result into a new variable called svg so
      // we can reference the new SVG withouth having to reselect it later using
      // d3.select("svg").
      var svg = d3.select("#graph")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

      // instead of creating divs, we generate rects and add them to svg
      svg.selectAll("rect") // always select whatever it is you are about to act
                            // on, even if that selection is momentarily empty
          .data(dataset)
          .enter()
          .append("rect")
          .attr("x", function(d, i){
            return xScale(i);
          })
          .attr("y", function(d){
            return h - yScale(d); // different from previous bar chart
          })
          .attr("width", xScale.bandwidth() - barPadding) // bandwidth() replaces
                //rangeBand(), automatically calculates width but does not come
                // with padding by default.
          .attr("height", function(d){
            return yScale(d); // different from previous bar chart
          })
          //.attr("fill", "pink") -- put this in if want only 1 color
          .attr("fill", function(d){
            return "rgb(210, 15, " + ( d * 10 ) + ")"; // use this if want to encode
                    //data values as color. Base set to coral 2 here (238,106,80)
          });

      svg.selectAll("text")
          .data(dataset)
          .enter()
          .append("text")
          .text(function(d){
            return d;
          })
          .attr("x", function(d, i){
            return xScale(i) + xScale.bandwidth()/2;
          })
          .attr("y", function(d){
            return h - yScale(d) + 14; // +14 to move label inside bars
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "white")
          .attr("text-anchor", "middle") // center the text horizontally at the
                                  // assigned x value
          ;

      // On click update with new data
      d3.select("#trigger")
        .on("click", function(){
          // New values for dataset
          // Count original length of dataset
          var numValues = dataset.length;
          // Initialize empty array
          dataset = [];
          // Loop numValues times
          for (var i = 0; i < numValues; i++){
            var newNumber = Math.floor(Math.random() * 25);
            dataset.push(newNumber)
          }
          ;

          // Update scale domain
          // Recaliberate scale given the new max of dataset
          yScale.domain([0, d3.max(dataset)]);

          // Update all rects
          svg.selectAll("rect")
              .data(dataset) // similar to the code above, but no enter() and
                            // append()
              .transition()
              .duration(2000)
              .ease(d3.easeElastic) // put this here to change the way chart is animated
              .attr("y", function(d){
                return h - yScale(d);
              })
              .attr("height", function(d){
                return yScale(d);
              })
              .attr("fill", function(d){
                return "rgb(210, 15, " + ( d * 10 ) + ")"
              })
              ;

            // Update all labels
            svg.selectAll("text")
                .data(dataset)
                .transition()
                .duration(2000)
                .ease(d3.easeElastic) // put this here to change the way chart is animated
                .text(function(d){
                  return d;
                })
                .attr("x", function(d, i){
                  return xScale(i) + xScale.bandwidth() / 2;
                })
                .attr("y", function(d){
                  return h - yScale(d) + 14;
                })
        })
        ;

