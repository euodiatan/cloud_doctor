import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import singaporeHigh from '../singaporeHigh.ts'; // Adjust the path accordingly

am4core.useTheme(am4themes_animated);

const markers = [
    { lat: 1.322790, lon: 103.815150, name: "Tan Li Shan", address: "Blk 732, Bukit Timah Road, Singapore 972397" },
    { lat: 1.312890, lon: 103.923950, name: "Lee Kai Xin", address: "Blk 889, East Coast Road, Singapore 557329" },
    { lat: 1.316930, lon: 103.859470, name: "Goh Yan Ting", address: "Blk 809, Serangoon Road, Singapore 848770" },
    { lat: 1.347550, lon: 103.717770, name: "Wong Jun Jie", address: "Blk 898, Jurong West St 52, Singapore 438891" },
    { lat: 1.327120, lon: 103.783800, name: "Teo Jun Jie", address: "Blk 250, Holland Road, Singapore 337199" },
    { lat: 1.3311344, lon: 103.9255844, name: "Ong Li Shan", address: "Blk 592, Bedok North St 2, Singapore 889773" },
    { lat: 1.3194175, lon: 103.8172547, name: "Chua Kai Xin", address: "Blk 320, Bukit Timah Road, Singapore 784810" },
    { lat: 1.3092795, lon: 103.7896931, name: "Koh Kai Xin", address: "Blk 416, Holland Road, Singapore 795293" },
    { lat: 1.30944, lon: 103.86444, name: "Ong Yan Ting", address: "Blk 600, Jalan Besar, Singapore 324466" },
    { lat: 1.30944, lon: 103.86444, name: "Wong Li Shan", address: "Blk 263, Jalan Besar, Singapore 785353" },



];

export default function SingaporeMap() {
  useEffect(() => {
    let map = am4core.create("chartdiv", am4maps.MapChart);
    map.geodata = singaporeHigh;
    map.projection = new am4maps.projections.Miller();

    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#8dd2f2");

    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#367B25");

    function getMarkerColor(name) {
        if (name === "Koh Kai Xin" || name === "Tan Li Shan") {
          return am4core.color("#FF0000"); // Red color for specific patients
        } else {
          return am4core.color("#4c94b5"); // Default color for other patients
        }
      }

      let imageSeries = map.series.push(new am4maps.MapImageSeries());
      let imageSeriesTemplate = imageSeries.mapImages.template;
      imageSeriesTemplate.propertyFields.latitude = "lat";
      imageSeriesTemplate.propertyFields.longitude = "lon";
      imageSeriesTemplate.propertyFields.fill = "color"; 
      imageSeriesTemplate.nonScaling = true;
      
      let markerCircle = imageSeriesTemplate.createChild(am4core.Circle);
      markerCircle.radius = 10;
      markerCircle.stroke = am4core.color("#FFFFFF"); 
      markerCircle.strokeWidth = 2;
      
     
      imageSeries.data = markers.map(marker => ({ ...marker, color: getMarkerColor(marker.name) }));

    imageSeriesTemplate.tooltipText = "{name}: {address}";

    return () => {
      map.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "400px" }}></div>;
}
