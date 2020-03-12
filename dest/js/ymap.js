ymaps.ready(init);

function init(){

    var myMap;

    myMap = new ymaps.Map("map", {
        center: [55.7652, 37.63836],
        zoom: 17,
        controls: []
    });

    myMap.behaviors.disable('scrollZoom');

    myMap.controls.add("zoomControl", {
        position: {top: 15, left: 15}
    });

    var html  = '<div class="popup">';
        html += '<a class="close" href="#">&times;</a>';
        html +=     '<img src="http://blog.karmanov.ws/files/APIYaMaps1/min_image.png" alt="" />';
        html +=     '<div class="popup-text">';
        html +=         '<p>The Victoria Tower Gardens</p>';
        html +=         '<p>Millbank</p>';
        html +=         '<p>City of London </p>';
        html +=         '<p>SW1P 3SF</p>';
        html +=         '<p>United Kingdom</p>';
        html +=         '<p>020 7641 5264</p>';
        html +=     '</div>';
        html += '</div>';

    var myPlacemark = new ymaps.Placemark([55.7649, 37.63836],
        {
          balloonContent: html
        },
        { iconLayout: 'default#image',
          iconImageHref: 'http://blog.karmanov.ws/files/APIYaMaps1/min_marker.png',
          iconImageSize: [40, 51],
          iconImageOffset: [-20, -47],
          balloonLayout: "default#imageWithContent",
          balloonContentSize: [289, 151],
          balloonImageHref: false,
          balloonImageOffset: [-144, -147],
          balloonImageSize: [289, 151],
          balloonShadow: false });

    myMap.geoObjects.add(myPlacemark);

}
