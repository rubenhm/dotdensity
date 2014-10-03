require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/DotDensityRenderer",
  "esri/renderers/ScaleDependentRenderer",
  "esri/Color",
  "esri/dijit/Legend",
  "dojo/domReady!"
], function(
  Map,
  FeatureLayer,
  ArcGISTiledMapServiceLayer,
  SimpleFillSymbol,
  SimpleLineSymbol,
  DotDensityRenderer,
  ScaleDependentRenderer,
  Color,
  Legend
){


  var map = new Map("map", {
      center: [-121.9, 38.6],
      zoom: 10,
      maxZoom: 12,
      minZoom: 10
  });
  

  var basemap = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer");
  map.addLayer(basemap);

  var layer = new FeatureLayer("https://darcgis.water.ca.gov/arcgis/rest/services/cadre/yolo_tracts_by_race/MapServer/0", {
    mode: FeatureLayer.MODE_SNAPSHOT,
    outFields: ["tract","White","Hispanic","Asian","Black","Pacific_Islander","American_Indian"]
  });


  var dotSizes = {32:4,8:3,2:3}
  
  var createRenderer = function(dotValue) {
    return new DotDensityRenderer({
      fields: [{
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
      }],
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
  map.addLayer(layer);



  var legend = new Legend({
    map: map,
    layerInfos: [{ layer: layer }]
  }, "legend");
  legend.startup();

});