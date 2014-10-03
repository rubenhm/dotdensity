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


  var dotSizes = {32:4,8:3,2:3};
  var zoomToDots = {10:32,11:8,12:2};

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


  var legend = (function(){
    var legend = D.getElementById("legend");
    var legendTitle = D.createElement('h3');
    var dotScale = D.createElement('h5');
    var legendList = D.createElement('ul');

    legendTitle.innerText = "Mortgages by Race";
    setDotAmount(32);

    fields.forEach(function(field){
      var item = D.createElement('li');
      item.innerText = spaced(field.name);
      item.style.color = field.color;
      legendList.appendChild(item);
    });

    legend.appendChild(legendTitle);
    legend.appendChild(dotScale);
    legend.appendChild(legendList)


    function spaced(str){
      return str.replace(/_/g, " ");
    }

    function setDotAmount(dotAmount){
      dotScale.innerText = "1 Dot = "+dotAmount + " mortgages";
    }


    return {
      node:legend,
      setDotAmount: setDotAmount
    }

  })();


  map.addLayers([basemap,layer]);
  map.on('zoom-end',function(e){
    legend.setDotAmount(zoomToDots[e.level])
  })

});