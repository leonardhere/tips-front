var data = {
"Points":[{
    "MapPoinName": "Город 1",
    "MapPointPopulation": 125000,
    "MapPointCoordinates": "58.211748, 59.979321"
}, {
    "MapPoinName": "Город 2",
    "MapPointPopulation": 105000,
    "MapPointCoordinates": "51.221748, 53.929321"
}]};

ymaps.ready(init);

function init() {
  var map = new ymaps.Map("map", {
    center: [55.76, 37.57],
    zoom: 5,
    controls: ['zoomControl', 'searchControl']
  });
  $.getJSON('data.json', function(data) {
    // Создадим объект точек из data.Points
    var myGeoObjects = data.Points.map(item => {
      return new ymaps.GeoObject({
        geometry: {
          type: "Point",
          // Переведем строку с координатами в массив
          coordinates: item.MapPointCoordinates.split(', ')
        },
        properties: {
          clusterCaption: 'Описание в кластере',
          balloonContentBody: [
            '<address style="font-style: normal">',
            '<h3>Данные</h3>',
            '<b>Данные: </b>МО "Название МО"<br>',
            '<b>Данные: </b>ФИО Главы МО<br>',
            '</address>'
          ].join('')
        }
      }, {
        preset: "islands#darkGreenDotIcon",
      });
    })
    // Создадим кластеризатор после получения и добавления точек
    var clusterer = new ymaps.Clusterer({
      preset: 'islands#invertedDarkGreenClusterIcons',
      clusterDisableClickZoom: true,
      clusterBalloonContentLayoutWidth: 800,
      clusterBalloonLeftColumnWidth: 160
    });
    clusterer.add(myGeoObjects);
    map.geoObjects.add(clusterer);
    map.setBounds(clusterer.getBounds(), {
      checkZoomRange: true
    });
});
