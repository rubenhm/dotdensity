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
    minZoom: 9
  });
  
  var basemap = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer");
  map.addLayer(basemap);

  var layer = new FeatureLayer("https://darcgis.water.ca.gov/arcgis/rest/services/cadre/yolo_tracts_by_race/MapServer/0", {
    outFields: ["tract","White","Hispanic","Asian","Black","Pacific_Islander","American_Indian"]
  });
  
  var createRenderer = function(dotValue) {
    return new DotDensityRenderer({
      fields: [{
        name: "White",
        color: new Color([21, 137, 255])
      }, {
        name: "Hispanic",
        color: new Color([200, 111, 0])
      }, {
        name: "Asian",
        color: new Color([0, 255, 0])
      }, {
        name: "Black",
        color: new Color([255, 0, 0])
      }],
      dotValue: dotValue,
      dotSize: 2,
      outline: new SimpleLineSymbol("solid", new Color([50, 50, 50, 1]), 0.5),
      legendOptions: {
        valueUnit: "people",
        backgroundColor: new Color([32, 32, 32])
      }
    });
  };
  
  var rendererInfos = [
    {
      renderer: createRenderer(400),
      maxZoom: 9,
      minZoom: 9
    }, {
      renderer: createRenderer(100),
      maxZoom: 10,
      minZoom: 10
    }, {
      renderer: createRenderer(25),
      maxZoom: 11,
      minZoom: 11
    }, {
      renderer: createRenderer(6),
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