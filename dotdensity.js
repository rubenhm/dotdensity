require([
  "esri/map",
  "esri/geometry/Extent",
  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/DotDensityRenderer",
  "esri/renderers/ScaleDependentRenderer",
  "esri/Color",
  "dojo/query",
  "dojo/dom",
  "esri/dijit/Legend",
  "dojo/domReady!"
], function(
  Map,
  Extent,
  FeatureLayer,
  ArcGISTiledMapServiceLayer,
  SimpleFillSymbol,
  SimpleLineSymbol,
  DotDensityRenderer,
  ScaleDependentRenderer,
  Color,
  query,
  dom,
  Legend
){

  map = new Map("map", {
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

  var dotSizes = {80:4,20:3,5:3}
  
  var createRenderer = function(dotValue) {
    return new DotDensityRenderer({
      fields: [{
        name: "White",
        color: new Color("#a6cee3")
      }, {
        name: "Hispanic",
        color: new Color("#1f78b4")
      }, {
        name: "Asian",
        color: new Color("#33a02c")
      }, {
        name: "Black",
        color: new Color("#e41a1c")
      },
      {
        name: "Pacific_Islander",
        color: new Color("#984ea3")
      },
      {
        name: "American_Indian",
        color: new Color("#e7298a")
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
      renderer: createRenderer(80),
      maxZoom: 10,
      minZoom: 10
    }, {
      renderer: createRenderer(20),
      maxZoom: 11,
      minZoom: 11
    }, {
      renderer: createRenderer(5),
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