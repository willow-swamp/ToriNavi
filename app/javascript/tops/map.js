let map;

function infoWnd(info){
  return new google.maps.InfoWindow({
    content: info.attributes.name,
    ariaLabel: info.attributes.name,
  })
}


function getCurrentLocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(pos);
        },
        () => {
          // ユーザーが位置情報の取得を拒否した場合、または取得に失敗した場合
          alert("位置情報の取得に失敗しました。デフォルトの位置を使用します。");
          resolve({ lat: 35.681236, lng: 139.767125 }); // デフォルトの位置
        }
      );
    } else {
      // ブラウザがGeolocationをサポートしていない場合
      alert("このブラウザは位置情報をサポートしていません。デフォルトの位置を使用します。");
      resolve({ lat: 36.64311, lng: 138.18873 }); // デフォルトの位置
    }
  });
}

function pinLocation(pos) {
  new google.maps.Marker({
    position: pos,
    map,
  })
}

function postLocation(pos) {
  const csrfToken = document.getElementsByName('csrf-token')[0].content
  const options = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    }
  }

  const query_params = new URLSearchParams(pos)

  return fetch("/tops/search" + "?" + query_params, options)
    .then(response => response.json())
    .then(data => {
      return data;
    });
}

async function updatePlaceList(places) {
  // 一覧表示エリアの選択（ここでは仮に 'place-list' という ID を持つ tbody 要素とします）
  const listElement = document.querySelector('#place-list');
  if (!listElement) return; // エレメントが見つからなければ処理を終了

  // 取得した施設データでHTMLを生成
  let html = '';
  places.forEach((place, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${place.attributes.name}</td>
        <td>${parseFloat(place.attributes.rating)}</td>
        <td>${place.attributes.vicinity}</td>
        <td>${place.attributes.opening_hours ? 'Open' : 'Closed'}</td>
      </tr>
    `;
  });

  // 生成したHTMLを一覧表示エリアに挿入
  listElement.innerHTML = html;
}

async function initMap() {
  const pos = await getCurrentLocation();
  const places = await postLocation(pos);
  map = new google.maps.Map(document.getElementById("map"), {
    center: pos,
    zoom: 16,
    mapId: '<%= Rails.application.credentials.google_map[:mapId] %>',
  });

  pinLocation(pos);
    
  for (let i = 0; i < places.length; i++) {
    const index = String(i + 1)
    const place = places[i]
    const placeLatLng = { lat: place.attributes.latitude, lng: place.attributes.longitude }
    const infowindow = infoWnd(place)
    const pinView = new google.maps.marker.PinView({
      background: "#FBBC04",
      glyph: index,
    });
    
    const marker = new google.maps.marker.AdvancedMarkerView({
      map,
      position: placeLatLng,
      content: pinView.element,
      title: place.attributes.name,
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      })
    });
  }
  
  updatePlaceList(places);
}

window.initMap = initMap;

