let data = [];
let map = L.map("map").setView([-6.904744, 107.63981], 12);
map.attributionControl.setPrefix("");
let layerGroup = L.layerGroup().addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let icon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style='background-color:#c30b82;' class='marker-pin'></div><i class='fa fa-broadcast-tower'></i>`,
  iconSize: [30, 33],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
});

function renderMapInternal(data_menara) {
  if (layerGroup !== null) {
    layerGroup.clearLayers();
  }
  let marker = null;
  for (let data of data_menara) {
    let pemilik_menara = data.pemilik_menara;
    let latitude = data.latitude;
    let longitude = data.longitude;
    if (latitude != null && longitude != null) {
      marker = L.marker([latitude, longitude], {
        icon: icon,
      }).addTo(layerGroup);
      marker.bindPopup(pemilik_menara);
    }
  }
}

function polystyle(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "black", //Outline color
    fillColor: "blue",
    fillOpacity: 0.2,
  };
}

function drawCountyBoundary(county, state) {
  urlMap = `https://nominatim.openstreetmap.org/search.php?county=${county}&state=${state}&polygon_geojson=1&format=jsonv2`;
  fetch(urlMap)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      geojsonFeature = json[0].geojson;
      var layer = L.geoJSON(geojsonFeature, { style: polystyle }).addTo(map);
    });
}

drawCountyBoundary("Bandung", "Id");

$("input[type=radio][name=rTahun]").change(function () {
  if (this.value == "r2016") {
    data = data_menara_telekomunikasi_2016;
  } else if (this.value == "r2017") {
    data = data_menara_telekomunikasi_2017;
  } else if (this.value == "r2018") {
    data = data_menara_telekomunikasi_2018;
  } else if (this.value == "r2019") {
    data = data_menara_telekomunikasi_2019;
  } else if (this.value == "r2020") {
    data = data_menara_telekomunikasi_2020;
  }
  console.log(data.length);
  renderMapInternal(data.slice(0, 5));
});






// for (let data of data2016.slice(0,5)) {
//     console.log(data);
// }

// for (let data of data2016.filter((obj) => {
//   return obj.Kelurahan === "-";
// })) {
//   console.log(data);
// }

// var tempResult = {}
// for(let { Kecamatan, Kelurahan } of data2016)
//   tempResult[Kelurahan] = {
//       Kelurahan,
//       Kecamatan,
//       count: tempResult[Kelurahan] ? tempResult[Kelurahan].count + 1 : 1
//   }

// let result = Object.values(tempResult)

// console.log(result.sort((a, b) => a.Kelurahan.localeCompare(b.Kelurahan)))