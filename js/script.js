let data = [];
let map = L.map("map").setView([-6.904744, 107.61981], 13);
map.attributionControl.setPrefix("");
let layerGroup = L.layerGroup().addTo(map);
let sidebar = L.control.sidebar("sidebar").addTo(map);

$(function () {
  $.fn.DataTable.ext.pager.numbers_length = 5;
  $("#tableData").DataTable({
    searching: false,
    info: true,
    lengthChange: false,
    pageLength: 5,
    pagingType: "simple",
    // pagingType: "first_last_numbers",
    responsive: true,
    data: data,
    columns: [
      { data: "pemilik_menara" },
      { data: "tower_height" },
      { data: "struktur_tower" },
      { data: "kecamatan" },
      { data: "kelurahan" },
      { data: "lokasi_menara" },
      { data: "latitude" },
      { data: "longitude" },
    ],
    columnDefs: [
      {
        defaultContent: "-",
        targets: "_all",
      },
    ],
  });

  let tahun = $("#dataTahun").find(":selected").val();
  getData(tahun);
});

// Maps
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "alert alert-light alet-info-maps"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  console.log(props);
  this._div.innerHTML =
    "<h6>Menara Telekomunikasi Kota Bandung</h6>" +
    (props
      ? "Total <b>" +
        props.total +
        "</b> Data,  Tahun  <b>" +
        props.tahun +
        "</b>"
      : "select the year first");
};

info.addTo(map);

let icon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class='marker-pin'></div><i class='fa fa-broadcast-tower'></i>`,
  iconSize: [30, 33],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
});

function renderMapInternal(data_menara) {
  if (layerGroup !== null) {
    layerGroup.clearLayers();
  }
  let marker = null;
  for (let d of data_menara) {
    let latitude = d.latitude;
    let longitude = d.longitude;
    if (
      latitude != null &&
      longitude != null &&
      (latitude !== "-" || longitude !== "-")
    ) {
      marker = L.marker([latitude, longitude], {
        icon: icon,
      }).addTo(layerGroup);
      marker.bindPopup(genereteContent(d));
    }
  }
}

function genereteContent(menara) {
  let {
    pemilik_menara,
    tower_height,
    struktur_tower,
    kecamatan,
    kelurahan,
    lokasi_menara,
    latitude,
    longitude,
    id_site,
    nama_site,
    alamat_perusahaan_menara,
    id_survey,
    operator,
    building_heights,
    kategori,
    tahun_pendirian,
    kelistrikan,
    status_lahan,
    keterangan_lain_lain,
    data_imb,
  } = menara;
  var additional = "";
  if (typeof id_site !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">ID Site</div>
                ` +
      id_site +
      `
            </div>
        </li>`;
  }
  if (typeof nama_site !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Nama Site</div>
                ` +
      nama_site +
      `
            </div>
        </li>`;
  }
  if (typeof alamat_perusahaan_menara !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Alamat Perusahaan</div>
                ` +
      alamat_perusahaan_menara +
      `
            </div>
        </li>`;
  }
  if (typeof id_survey !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">ID Survey</div>
                ` +
      id_survey +
      `
            </div>
        </li>`;
  }
  if (typeof operator !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Operator</div>
                ` +
      operator +
      `
            </div>
        </li>`;
  }
  if (typeof building_heights !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Building Heights</div>
                ` +
      building_heights +
      `
            </div>
        </li>`;
  }
  if (typeof kategori !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Kategori</div>
                ` +
      kategori +
      `
            </div>
        </li>`;
  }
  if (typeof tahun_pendirian !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Tahun Pendirian</div>
                ` +
      tahun_pendirian +
      `
            </div>
        </li>`;
  }
  if (typeof status_lahan !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Status Lahan</div>
                ` +
      status_lahan +
      `
            </div>
        </li>`;
  }
  if (typeof kelistrikan !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Kelistrikan</div>
                ` +
      kelistrikan +
      `
            </div>
        </li>`;
  }
  if (typeof keterangan_lain_lain !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Keterangan Lain Lain</div>
                ` +
      keterangan_lain_lain +
      `
            </div>
        </li>`;
  }
  if (typeof data_imb !== "undefined") {
    additional +=
      `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Data IMB</div>
                ` +
      data_imb +
      `
            </div>
        </li>`;
  }

  var content =
    `
  <div class="card" style="width: 18rem; border: none;">
  <div class="card-body" style="padding:0;">
      <h5 class="card-title" style="font-size:16px; font-weight:bolder;">` +
    pemilik_menara +
    `</h5>
      <h6 class="card-subtitle mb-2 text-muted" style="font-size:12px; font-weight:bold;">` +
    lokasi_menara +
    `<br/> Kec. ` +
    kecamatan +
    `, Kel. ` +
    kelurahan +
    `</h6>
      <ol class="list-group list-group-numbered">
          <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                  <div class="fw-bold">Struktur Tower</div>
                  ` +
    struktur_tower +
    `
              </div>
          </li>
          <li
              class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                  <div class="fw-bold">Tinggi Tower</div>
                  ` +
    tower_height +
    `
              </div>
          </li>
          ` +
    additional +
    `
      </ol>
      <div class="row">
          <div class="col-6"><p class="mb-1">Latitude</p>
              <small class="text-muted">` +
    latitude +
    `</small></div>
          <div class="col-6">
              <p class="mb-1">Longitude</p>
              <small class="text-muted">` +
    longitude +
    `</small>
          </div>
      </div>
  </div>
  </div>`;
  return content;
}

function renderDatatable(data_menara) {
  $("#tableData").dataTable().fnClearTable();
  $("#tableData").dataTable().fnAddData(data_menara);
}
function polystyle(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "blue", //Outline color
    fillColor: "#74b9ff",
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
  if (tahun == "") {
    $("#selectTowerOwner").prop("disabled", "disabled");
    $("#towerStructure").prop("disabled", "disabled");
    $("#towerHeight").prop("disabled", "disabled");
    $("#selectKecamatan").prop("disabled", "disabled");
    $("#selectKelurahan").prop("disabled", "disabled");
    $("#towerAddress").prop("disabled", true);
  } else {
    $("#selectTowerOwner").prop("disabled", false);
    $("#towerStructure").prop("disabled", false);
    $("#towerHeight").prop("disabled", false);
    $("#selectKecamatan").prop("disabled", false);
    $("#towerAddress").prop("disabled", false);
  }

  if (tahun == "2016") {
    d = data_menara_telekomunikasi_2016;
  } else if (tahun == "2017") {
    d = data_menara_telekomunikasi_2017;
  } else if (tahun == "2018") {
    d = data_menara_telekomunikasi_2018;
  } else if (tahun == "2019") {
    d = data_menara_telekomunikasi_2019;
  } else if (tahun == "2020") {
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
  th.sort(function (a, b) {
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
  if (kec != "") {
    $("#selectKelurahan").prop("disabled", false);
  }
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
  "select[id=selectTowerOwner], select[id=selectKecamatan], select[id=selectKelurahan], select[id=towerHeight], select[id=towerStructure], textarea[id=towerAddress]"
).on("keyup change", function (e) {
  let towerOwner = $("#selectTowerOwner").find(":selected").val();
  let kec = $("#selectKecamatan").find(":selected").val();
  let kel = $("#selectKelurahan").find(":selected").val();
  let th = $("#towerHeight").find(":selected").val().toString();
  let ts = $("#towerStructure").find(":selected").val();
  let address = $("#towerAddress").val();
  let d = data.filter(
    (obj) =>
      (kec != "" ? obj.kecamatan == kec : true) &&
      (kel != "" ? obj.kelurahan == kel : true) &&
      (towerOwner != "" ? obj.pemilik_menara == towerOwner : true) &&
      (th != "" ? obj.tower_height.toString() == th : true) &&
      (ts != "" ? obj.struktur_tower == ts : true) &&
      obj.lokasi_menara.toLowerCase().includes(address.toLowerCase())
  );
  renderMapInternal(d);
  renderDatatable(d);
});

$("select[id=dataTahun]").change(function () {
  data = getData(this.value);
  info.update({ tahun: this.value, total: data.length });
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
  renderDatatable(data);
});

jQuery.fn.extend({
  slideRightShow: function () {
    return this.each(function () {
      $(this).show(
        "slide",
        {
          direction: "right",
        },
        1000
      );
    });
  },
  slideLeftHide: function () {
    return this.each(function () {
      $(this).hide(
        "slide",
        {
          direction: "left",
        },
        1000
      );
    });
  },
  slideRightHide: function () {
    return this.each(function () {
      $(this).hide(
        "slide",
        {
          direction: "right",
        },
        1000
      );
    });
  },
  slideLeftShow: function () {
    return this.each(function () {
      $(this).show(
        "slide",
        {
          direction: "left",
        },
        1000
      );
    });
  },
});

$("#slide_two_show").click(function () {
  // $("#slide_one_div").slideLeftHide();
  // $("#slide_two_div").slideRightShow();

  $("#slide_one_div").fadeOut(500, function () {
    $(this).css({ display: "block", visibility: "hidden" });
  });
  setTimeout(function () {
    $("#slide_two_div").fadeIn(1000, function () {
      $(this).css({ display: "block", visibility: "visible" });
    });
  }, 500);
});

$("#slide_one_show").click(function () {
  // $("#slide_one_div").slideLeftShow();
  // $("#slide_two_div").slideRightHide();

  $("#slide_two_div").fadeOut(500, function () {
    $(this).css({ display: "block", visibility: "hidden" });
  });

  setTimeout(function () {
    $("#slide_one_div").fadeIn(1000, function () {
      $(this).css({ display: "block", visibility: "visible" });
    });
  }, 500);
});
