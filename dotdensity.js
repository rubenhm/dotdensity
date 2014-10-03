require([
  "esri/map",
  "esri/config",
  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/DotDensityRenderer",
  "esri/renderers/ScaleDependentRenderer",
  "esri/Color",
  "dojo/domReady!"
], function(
  Map,
  Config,
  FeatureLayer,
  ArcGISTiledMapServiceLayer,
  SimpleFillSymbol,
  SimpleLineSymbol,
  DotDensityRenderer,
  ScaleDependentRenderer,
  Color
){

  var D = document;
  Config.defaults.io.corsDetection = false;

  var map = new Map("map", {
      center: [-121.9, 38.6],
      zoom: 10,
      maxZoom: 12,
      minZoom: 10
  });
  

  var basemap = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer");

  var layer = new FeatureLayer("https://darcgis.water.ca.gov/arcgis/rest/services/cadre/yolo_tracts_by_race/MapServer/0", {
    mode: FeatureLayer.MODE_SNAPSHOT,
    outFields: ["tract","White","Hispanic","Asian","Black","Pacific_Islander","American_Indian"]
  });


  var dotSizes = {32:4,8:3,2:3}
  var fields =  [{
        name: "White",
        color: new Color("#a6cee3")
      }, {
        name: "Hispanic",
        color: new Color("#1f78ff")
      }, {
        name: "Asian",
        color: new Color("#11bb07")
      }, {
        name: "Black",
        color: new Color("#e41a1c")
      },
      {
        name: "Pacific_Islander",
        color: new Color("#aa00ff")
      },
      {
        name: "American_Indian",
        color: new Color("#ecef14")
      }];


  var createRenderer = function(dotValue) {
    return new DotDensityRenderer({
      fields:fields,
      dotValue: dotValue,
      dotSize: dotSizes[dotValue],
      outline: new SimpleLineSymbol("solid", new Color([50, 50, 50, 1]), 0.5),
      legendOptions: {
        valueUnit: "mortgages",
        backgroundColor: new Color([32, 32, 32])
      }
    });
  };

  
  var rendererInfos = [
    {
      renderer: createRenderer(32),
      maxZoom: 10,
      minZoom: 10
    }, {
      renderer: createRenderer(8),
      maxZoom: 11,
      minZoom: 11
    }, {
      renderer: createRenderer(2),
      maxZoom: 12,
      minZoom: 12
    }
  ];

  
  var scaleDependentRenderer = new ScaleDependentRenderer({
    rendererInfos: rendererInfos
  });
  layer.setRenderer(scaleDependentRenderer);

  map.addLayers([basemap,layer]);


  var legend = D.getElementById("legend");
  var legend_inner = D.createElement('ul');

  fields.forEach(function(field){
    var item = D.createElement('li');
    item.innerText = spaced(field.name);
    item.style.color = field.color;
    legend_inner.appendChild(item);
  });
  legend.appendChild(legend_inner)


  function spaced(str){
    return str.replace(/_/g, " ");
  }

});