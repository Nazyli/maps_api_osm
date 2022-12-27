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
    if (
      latitude != null &&
      longitude != null &&
      (latitude !== "-" || longitude !== "-")
    ) {
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

function getData(tahun) {
  let d = [];
  if (tahun == "r2016") {
    d = data_menara_telekomunikasi_2016;
  } else if (tahun == "r2017") {
    d = data_menara_telekomunikasi_2017;
  } else if (tahun == "r2018") {
    d = data_menara_telekomunikasi_2018;
  } else if (tahun == "r2019") {
    d = data_menara_telekomunikasi_2019;
  } else if (tahun == "r2020") {
    d = data_menara_telekomunikasi_2020;
  }
  return d;
}
function renderOptionTowerOwner(data) {
  const pemilik_menara = [
    ...new Set(data.map((item) => item.pemilik_menara)),
  ].sort();
  $("#selectTowerOwner")
    .find("option")
    .remove()
    .end()
    .append('<option value=""></option>')
    .val("");

  $.each(pemilik_menara, function (i, item) {
    var option = new Option(item, item);
    $("#selectTowerOwner").append($(option));
  });
}
function renderKecamatan(data) {
  const kec = [...new Set(data.map((item) => item.kecamatan))].sort();
  $("#selectKecamatan")
    .find("option")
    .remove()
    .end()
    .append('<option value=""></option>')
    .val("");

  $.each(kec, function (i, item) {
    var option = new Option(item, item);
    $("#selectKecamatan").append($(option));
  });
}

function towerHeight(data) {
  const th = [...new Set(data.map((item) => item.tower_height))];
  th.sort(function(a, b) {
    return a - b;
  });
  $("#towerHeight")
    .find("option")
    .remove()
    .end()
    .append('<option value=""></option>')
    .val("");

  $.each(th, function (i, item) {
    var option = new Option(item, item);
    $("#towerHeight").append($(option));
  });
}
function towerStructure(data) {
  const ts = [...new Set(data.map((item) => item.struktur_tower))].sort();
  $("#towerStructure")
    .find("option")
    .remove()
    .end()
    .append('<option value=""></option>')
    .val("");

  $.each(ts, function (i, item) {
    var option = new Option(item, item);
    $("#towerStructure").append($(option));
  });
}

$("#selectKecamatan").on("change", function () {
  let kec = $(this).find(":selected").val();
  let da = data.filter((obj) => obj.kecamatan == kec);
  const kel = [...new Set(da.map((item) => item.kelurahan))].sort();
  $("#selectKelurahan")
    .find("option")
    .remove()
    .end()
    .append('<option value=""></option>')
    .val("");

  $.each(kel, function (i, item) {
    var option = new Option(item, item);
    $("#selectKelurahan").append($(option));
  });
});


// $("#towerAddress").keyup(function(event) {
//   text = $(this).val();
//   console.log(text);
// });

$(
  "select[id=selectTowerOwner], select[id=selectKecamatan], select[id=selectKelurahan], select[id=towerHeight], select[id=towerStructure], input[id=towerAddress]"
).on('keyup change', function(e) {
  let towerOwner = $("#selectTowerOwner").find(":selected").val();
  let kec = $("#selectKecamatan").find(":selected").val();
  let kel = $("#selectKelurahan").find(":selected").val();
  let th = $("#towerHeight").find(":selected").val().toString();
  let ts = $("#towerStructure").find(":selected").val();
  let address = $("#towerAddress").val();
  let d = data.filter(
    (obj) =>
      obj.kecamatan.includes(kec) &&
      obj.kelurahan.includes(kel) &&
      obj.pemilik_menara.includes(towerOwner) &&
      obj.tower_height.toString().includes(th) &&
      (ts != "" ? obj.struktur_tower == ts : true) && 
      obj.lokasi_menara.toLowerCase().includes(address.toLowerCase())
  );
  renderMapInternal(d);
});

$("input[type=radio][name=radioTahun]").change(function () {
  data = getData(this.value);
  renderOptionTowerOwner(data);
  renderKecamatan(data);
  $("#selectKelurahan")
    .find("option")
    .remove()
    .end()
    .append('<option value=""></option>')
    .val("");
  towerHeight(data);
  towerStructure(data);
  renderMapInternal(data);
});
