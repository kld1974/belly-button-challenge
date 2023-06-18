const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise 
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Initialize the dashboard
dataPromise.then(data => {
    var selector = d3.select("#selDataset");
    var sampleNames = data.names;

    // Add the sample names to the dropdown menu options
    sampleNames.forEach(sample => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });

    // Set the first sample name as the initial sample displayed on the dashboard
    var initialSample = sampleNames[0];

    // Show information and charts for the initial sample
    buildMetadata(initialSample, data);
    buildCharts(initialSample, data);
});

// This function runs when the user selects a new sample from the dropdown menu
function optionChanged(newSample) {
    // Update the information and charts for the new sample
    dataPromise.then(data => {
        buildMetadata(newSample, data);
        buildCharts(newSample, data);
    });
}

function buildMetadata(sample, data) {

    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = metadataArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(selectedSample).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
    });
}

// show the charts
function buildCharts(sample, data) {

    var samples = data.samples;
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = sampleArray[0];
    var otu_ids = selectedSample.otu_ids;
    var otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values;
    var wfreq = metadataArray[0].wfreq;

    // Bar Chart

      var yticks = otu_ids.slice(0,10).map(outId => `OTU ${outId}`).reverse();
      var barData = [{
          x: sample_values.slice(0,10).reverse(),
          y: yticks,
          type: "bar",
          orientation: "h",
          text: otu_labels.slice(0,10),
      }];
      Plotly.newPlot("bar", barData);


//Gauge Chart

 var degrees = 180 - wfreq * 20,
 radius = .5;
var radians = degrees * Math.PI / 180;  
var x = radius * Math.cos(radians); 
var y = radius * Math.sin(radians); 

// path for the needle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
var path = mainPath.concat(pathX, space, pathY, pathEnd);

// needle path
var mainPath = 'M ',
pathX1 = -1 * Math.sin(radians) * .025,
pathY1 = Math.cos(radians) * .025,
pathX2 = -1 * pathX1,
pathY2 = -1 * pathY1; 

var path = mainPath.concat(pathX1, ' ', pathY1, ' L ', pathX2, ' ', pathY2, ' L ', String(x), ' ', String(y), ' Z'); 

// scatter plot & pie chart 
var scatterData = { 
type: 'scatter',
x: [0], y: [0],
marker: {
    size: 28, 
    color:'850000',
    },
showlegend: false,
text: wfreq,
hoverinfo: 'text'
};

var pieData = { 
values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
rotation: 90,
text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2','0-1', ''],
textinfo: 'text',
textposition:'inside',	  
marker: { 
    colors: ['rgba(15, 128, 0, .5)', 'rgba(15, 128, 0, .45)', 'rgba(15, 128, 0, .4)',
            'rgba(110, 154, 22, .5)', 'rgba(110, 154, 22, .4)','rgba(110, 154, 22, .3)',
            'rgba(210, 206, 145, .5)','rgba(210, 206, 145, .4)','rgba(210, 206, 145, .3)',
            'rgba(255, 255, 255, 0)']
    },
hole: .5,
type: 'pie',
hoverinfo: 'text',
showlegend: false
};



var gaugeData = [scatterData, pieData];

var gaugeLayout = {
    // Needle
    shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: { color: '850000' }
    }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
    height: 500, width: 500,
    xaxis: { zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
    yaxis: { zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', gaugeData, gaugeLayout);  // Create the gauge chart

    // Bubble Chart
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          },
          text: otu_labels
      }];
  
      var bubbleLayout = {
          xaxis: {title: "OTU ID"}
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }
  