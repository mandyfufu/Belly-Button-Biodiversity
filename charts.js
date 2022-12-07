function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json('samples.json').then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleResults = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = sampleResults[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds
      .slice(0,10)
      .map(id => "OTU: " + id);
  
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks.reverse(),
      type: "bar",
      orientation: "h"
    }

    var barData = [trace];

    //9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    //Bubble Chart
    // 1. Create the trace for the bubble chart.
    var trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      colorscale: "Portland",
      marker: {
        color: otuIds.map(id => Math.floor((id/3500) * 16777215).toString(16)),
        size: sampleValues.map(sz => sz * 0.5),
      }
    };

      var bubbleData = [trace];

      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        hovermode: 'closest',
        xaxis: {
          title: {
            text: 'OTU ID'}
          },
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
          },
      };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
  
    // Create a variable that holds the first sample in the array.
    // line 65 var result = sampleResults[0]; 

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];
  
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // line 68-70
    // var otuIds = result.otu_ids;
    // var otuLabels = result.otu_labels;
    // var sampleValues = result.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wfreq = metadata.wfreq

    var trace = {
      domain:{ x:[0,1], y:[0,1] },
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: {
        text: "Belly Button Washing Frequency<br>"+
              "<span style='font-size:0.8em;color:black'>Scrubs per Week</span>"
      },
      gauge: {
        bar: {color: 'black'},
        axis: {range: [0,10]},
        steps: [
          { range: [0,2], color: "red" },
          { range: [2,4], color: "orange" },
          { range: [4,6], color: "yellow" },
          { range: [6,8], color: "lime" },
          { range: [8,10], color: "green" }
        ]
    }};
  
    var data = [trace];
    var gaugeLayout = { 
      width: 458, height: 450, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', data, gaugeLayout);

  });
}