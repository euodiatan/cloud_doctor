import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import singaporeHigh from '../singaporeHigh.ts'; // Adjust the path accordingly

am4core.useTheme(am4themes_animated);

export default function SingaporeMap() {
  useEffect(() => {
    let map = am4core.create("chartdiv", am4maps.MapChart);
    map.geodata = singaporeHigh;
    map.projection = new am4maps.projections.Miller();

    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#74B266");

    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#367B25");

    // Assuming "SG" is the ID for Singapore in your map data
    const singapore = polygonSeries.getPolygonById("SG");
    if (singapore) {
      map.zoomToMapObject(singapore);
    } else {
      console.error("Singapore polygon not found");
    }

    return () => {
      map.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "300px" }}></div>;
}
