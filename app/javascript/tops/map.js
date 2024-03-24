let map;

function infoWnd(info){
  return new google.maps.InfoWindow({
    content: info.name,
    ariaLabel: info.name,
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
      resolve({ lat: 35.681236, lng: 139.767125 }); // デフォルトの位置
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
  var photoOptions = {
    maxWidth: 400,
    maxHeight: 400
  };
  if (!listElement) return; // エレメントが見つからなければ処理を終了

  // 取得した施設データでHTMLを生成
  let html = '';
  places.forEach((place, index) => {
    html += `
      <div class="card lg:card-side bg-base-100 shadow-xl my-4" id="shop-list-${index + 1}">
        <figure class="lg:w-1/3 lg:h-80 h-48"><img src="${place.photos[0].getUrl(photoOptions)}" alt="Album"/></figure>
        <div class="card-body lg:w-2/3">
          <h2 class="card-title">${place.name}</h2>
          <p>${place.vicinity}</p>
          <p>${parseFloat(place.rating)}</p>
          <p>${place.opening_hours ? 'Open' : 'Closed'}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Listen</button>
          </div>
        </div>
      </div>
    `;
  });

  // 生成したHTMLを一覧表示エリアに挿入
  listElement.innerHTML = html;
}

async function getPlaces(pos) {
  var request = {
    location: pos, // 直接 pos オブジェクトを使用
    radius: '500',
    keyword: '焼き鳥',
    rankBy: google.maps.places.RankBy.PROMINENCE
  };

  // Promiseを使って非同期処理を行い、検索結果を返す
  return new Promise((resolve, reject) => {
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject('周辺のお店の検索に失敗しました');
      }
    });
  });
}

async function initMap() {
  const pos = await getCurrentLocation();
  map = new google.maps.Map(document.getElementById("map"), {
    center: pos,
    zoom: 16,
    mapId: '<%= Rails.application.credentials.google_map[:mapId] %>',
  });
  const places = await getPlaces(pos);
  console.log(places);

  pinLocation(pos);
    
  for (let i = 0; i < places.length; i++) {
    const index = String(i + 1)
    const place = places[i]
    const placeLatLng = place.geometry.location;
    console.log(placeLatLng);
    const infowindow = infoWnd(place)
    const pinView = new google.maps.marker.PinView({
      background: "#FBBC04",
      glyph: index,
    });
    
    const marker = new google.maps.marker.AdvancedMarkerView({
      map,
      position: placeLatLng,
      content: pinView.element,
      title: place.name,
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

