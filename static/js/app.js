var select = d3.select('select');
var panel = d3.select('.panel-body');

d3.json('samples.json').then(data => {
    var names = data.names;
    names.forEach(name => {
        select.append('option').text(name).property('value', name);
    });

    showDemo(names[0]);
    showGauge(names[0]);
    showBubbles(names[0]);
    showBars(names[0]);
})

function showDemo(name) {
    panel.html('');
    d3.json('samples.json').then(data => {
        var metadata = data.metadata.filter(obj => obj.id == name)[0];
        Object.entries(metadata).forEach(([key, value]) => {
            panel.append('h6').text(`${key.toUpperCase()}: ${value}`)
        });
    });
};

var jsData;

function showBubbles(name) {
    d3.json('samples.json').then(data => {

        jsData = data;

        var sample = data.samples.filter(obj => obj.id == name)[0];

        var bubbleData = [{
            x: sample.otu_ids,
            y: sample.sample_values,
            text: sample.otu_labels,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids,
                colorscale: 'Earth'
            }
        }];

        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            margin: { t: 0 },
            hovermode: 'closest',
            xaxis: { title: 'OTU ID' },
            margin: { t: 30 }
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
};

function showBars(name) {
    d3.json('samples.json').then(data => {
        var sample = data.samples.filter(obj => obj.id == name)[0];
        var samplevalues = sample.sample_values.slice(0, 10).reverse();

        var OTU_top = (sample.otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU" + d);
        var labels = sample.otu_labels.slice(0, 10);

        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        var barData = [trace];

        var layout = {
            title: "Top 10 OTU",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        Plotly.newPlot("bar", barData, layout);
    })
};

function showGauge(name) {
    d3.json('samples.json').then(data => {

        var frq = data.metadata.filter(obj => obj.id == name)[0].wfreq;
        
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: frq,
                title: { text: "Wash Frequency" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [0, 9] } }
              }
            ];
            
            var layout = { width: 600, height: 400 };
        Plotly.newPlot('gauge', data, layout);
        
    });
}


function optionChanged(name) {
    showDemo(name);
    showGauge(name);
    showBars(name);
    showBubbles(name);
};