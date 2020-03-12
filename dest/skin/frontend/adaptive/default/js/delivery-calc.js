class RouteCalculator {

    constructor(callback, suggestions) {
        if (!window.ymaps) {
            throw new ReferenceError('ymaps should be loaded before this class');
        }
        this._ym = new ymaps.Map('map-delivery', {center: this._getMapCenter(), zoom: this._getMapZoom(), controls: []});
        this._ym.behaviors.disable('scrollZoom');
        this._zones = {};
        this._onReadyCallback = callback;
        // this._onErrorCallback = errorCallback;
        this._lastRouteElements = [];
        this.geoCollection = new ymaps.GeoObjectCollection({}, {
            strokeWidth: 4,
            geodesic: true
        });
        this._mapLock = false;
        this._route;
        this._initialize();
        this.routeObjects;
        this.suggestions = suggestions;
    }

    _getMapCenter() {
        const windowWidth = window.outerWidth;
        if(windowWidth < 1024) {
            return [55.76, 37.64];
        } else  {
            return [55.76, 37.14];
        }
    }

    _getMapZoom() {
        const windowWidth = window.outerWidth;
        if(windowWidth < 1024) {
            return 9;
        } else  {
            return 10;
        }
    }

    // Строит на карте маршрут и возвращает в callback зону и расстояние
    buildRoute(address) {
        if(this._mapLock || !address) {
            return;
        }
        this.geoCollection.removeAll();
        this._route && this._ym.geoObjects.remove(this._route);
        this.routeObjects && this.routeObjects.removeFromMap(this._ym);
        this._mapLock = true;
        const markSettings = {
            iconLayout: 'default#image',
            iconImageHref: '/skin/frontend/adaptive/default/images/mapicon.png',
            iconImageSize: [57, 52],
            iconImageOffset: [-20, -50]
        };

        //очищаем старые маршруты
        ymaps
            .geocode(address,{results:1})
            .then(res => {
                if(!res.geoObjects.get(0)){
                    this._mapLock = false;
                    this._onErrorCallback('address not found');
                    return;
                }

                const destination = res.geoObjects.get(0).geometry.getCoordinates();
                if(this._zones['moscow'].geometry.contains(destination)) {
                    // Осуществляет поиск объекта по полученному адресу.
                    // Полученный результат сразу отображается на карте.
                    var point = res.geoObjects.get(0),
                        coords = point.geometry.getCoordinates(),
                        myPlacemark = new ymaps.Placemark(coords, {hintContent: address}, markSettings);
                    this.geoCollection.removeAll();
                    this.geoCollection.add(myPlacemark);
                    this._ym.geoObjects.add(this.geoCollection);
                    // this._ym.panTo(coords, {flying: true});

                    // this._ym.geoObjects.add(res.geoObjects.get(0));
                    // this._lastRouteElements.push(res.geoObjects.get(0));
                    if (this._zones['1'].geometry.contains(destination)) {
                        this._onReadyCallback('zone1', 0);
                    } else {
                        this._onReadyCallback('zone2', 0);
                    }
                    this._mapLock = false;
                    return;
                }

                //СТРОИМ МАРШРУТ
                ymaps.route([[55.751749,37.61681], destination],  {mapStateAutoApply: true, 'strokeWidth': 3,}).then(route => {
                        let routeLength = route.getLength();

                        var myPlacemark = new ymaps.Placemark(destination, {hintContent: address}, markSettings);

                        if(routeLength > 216000) {
                            $('#delivery-type').addClass('hidden');
                            $('#delivery-error').removeClass('hidden');
                            this.geoCollection.add(myPlacemark);
                            this._ym.geoObjects.add(this.geoCollection);
                        } else {
                            $('#delivery-type').removeClass('hidden');
                            $('#delivery-error').addClass('hidden');
                            // Объединим в выборку все сегменты маршрута.
                            var points = route.getWayPoints();
                            points.get(points.getLength() - 1).properties.set("hintContent", address);
                            const edges = this._toEdges(ymaps.geoQuery(route.getPaths()));
                            this.routeObjects = ymaps.geoQuery(edges)
                                    .add(route.getWayPoints())
                                    .add(route.getViaPoints())
                                    .setOptions({
                                        strokeColor: '#32414a',
                                        'strokeWidth': 3,
                                        iconLayout: 'default#image',
                                        iconImageHref: '/skin/frontend/adaptive/default/images/mapicon.png',
                                        iconImageSize: [57, 52],
                                        iconImageOffset: [-20, -50]
                                    })
                                    .addToMap(this._ym);
                            // Найдем объекты и уберем, попадающие внутрь МКАД.
                            const objectsInMoscow = this.routeObjects.searchInside(this._zones['moscow']);
                            // Найдем объекты и уберем, пересекающие МКАД.
                            const boundaryObjects = this.routeObjects.searchIntersect(this._zones['moscow']);
                            // Найдем объекты и уберем, попадающие внутрь третьего транспортного.

                            objectsInMoscow.removeFromMap(this._ym);
                            boundaryObjects.removeFromMap(this._ym);

                            // Создадим новую выборку, содержащую:
                            // - отрезки, описываюшие маршрут;
                            // - начальную и конечную точки;
                            // - промежуточные точки.
                            // Объекты за пределами МКАД получим исключением полученных выборок из
                            // исходной.
                            const routeOutOfMoscow = this.routeObjects.remove(objectsInMoscow).remove(boundaryObjects);
                            routeLength = this._routeToLength(routeOutOfMoscow);
                        }

                        if (routeLength === 0) {
                            this._onErrorCallback('zero route length');
                            return;
                        }
                        // this._ym.panTo(destination, {flying: true});
                        this._onReadyCallback('zone3', routeLength);
                    },
                    e => this._onErrorCallback('calc route error is ' + e)
                ).then(() => {
                    this._mapLock = false;
                });
            },
            e => this._onErrorCallback('error is ' + e)
        );
    }

    _toEdges(pathsObjects) {
        const edges = [];
        // Переберем все сегменты и разобьем их на отрезки.
        pathsObjects.each(function (path) {
            const coordinates = path.geometry.getCoordinates();
            for (let i = 1, l = coordinates.length; i < l; i++) {
                edges.push({ type: 'LineString', coordinates: [coordinates[i], coordinates[i - 1]]});
            }
        });
        return edges;
    }

    _routeToLength(route) {
        let length = 0;
        route.each(segment => {
            const coordinate = segment.geometry.getCoordinates();
            if(coordinate){
                length += ymaps.coordSystem.geo.getDistance(coordinate[0], coordinate[1]);
            }
        });
        return length;
    }

    _initialize() {

        const cityField = $('#delivery_calc_city');
        const streetField = $('#delivery_calc_street');
        const numField = $('#delivery_calc_housenumber');
        const buildingField = $('#delivery_calc_buildingnumber');
        const self = this;

        this._ym.events.add('click', function (e) {
            var coords = e.get('coords');
            showAdress(coords);
        });
        const mkad_ya_v = [[55.882419,37.72586],[55.887605,37.715732],[55.890837,37.709166],[55.89238,37.705432],[55.893393,37.702171],[55.894189,37.69818],[55.894647,37.694789],[55.894791,37.692558],[55.895322,37.671358],[55.895467,37.66865],[55.89566,37.663758],[55.895973,37.658479],[55.899349,37.631271],[55.901199,37.62169],[55.902821,37.614684],[55.9044,37.60859],[55.907269,37.598269],[55.908619,37.593463],[55.909595,37.589944],[55.910113,37.587605],[55.910547,37.585073],[55.910872,37.582627],[55.911053,37.580352],[55.91115,37.57694],[55.911053,37.573829],[55.910752,37.570095],[55.909619,37.559731],[55.908329,37.547136],[55.907124,37.535999],[55.906618,37.532587],[55.905798,37.528811],[55.904775,37.525292],[55.90181,37.518318],[55.896348,37.505894],[55.890665,37.492987],[55.889351,37.489918],[55.888471,37.487193],[55.886011,37.477773],[55.883423,37.466898],[55.882796,37.453938],[55.882554,37.450097],[55.881963,37.44617],[55.880696,37.440895],[55.878308,37.433299],[55.876089,37.426433],[55.874882,37.422356],[55.871601,37.412314],[55.870515,37.410383],[55.868199,37.406821],[55.864193,37.401542],[55.861297,37.398967],[55.859245,37.397422],[55.85421,37.394761],[55.848874,37.391972],[55.847348,37.391524],[55.845248,37.391781],[55.843002,37.392983],[55.840588,37.394528],[55.836482,37.395687],[55.83426,37.395644],[55.832589,37.395295]];
        const mkad_v_l  = [[55.832589,37.395295],[55.82779,37.393713],[55.825302,37.393198],[55.816967,37.390752],[55.810128,37.388606],[55.808364,37.387962],[55.805971,37.386889],[55.802901,37.384958],[55.800484,37.382919],[55.793606,37.376246],[55.789377,37.372384],[55.787068,37.370839],[55.785241,37.370079],[55.781898,37.369564],[55.773212,37.36935],[55.767406,37.369199],[55.765253,37.369114],[55.761309,37.368963],[55.755138,37.368835],[55.749898,37.368727],[55.738338,37.373019],[55.734973,37.374757],[55.732273,37.376109],[55.727078,37.378727],[55.721883,37.381409],[55.719291,37.382782],[55.717717,37.383598],[55.716336,37.384327],[55.714688,37.385143],[55.71206,37.386559],[55.711006,37.387374],[55.709637,37.388597],[55.708413,37.389842],[55.705227,37.394198],[55.702028,37.398532],[55.698914,37.402824],[55.69379,37.409647],[55.690954,37.41257],[55.689463,37.413643],[55.687269,37.414694],[55.685338,37.415372],[55.684175,37.415844],[55.682962,37.416466],[55.682453,37.416831],[55.676452,37.421316],[55.674125,37.423075],[55.673142,37.423805],[55.667613,37.427882],[55.663804,37.430843],[55.662477,37.432041],[55.660961,37.433479],[55.658541,37.436086],[55.654951,37.440356],[55.649236,37.447222],[55.641178,37.45665],[55.638807,37.459398]];
        const mkad_l_k  = [[55.638807,37.459398],[55.635972,37.462766],[55.632573,37.466788],[55.628154,37.471937],[55.623492,37.477345],[55.617396,37.484426],[55.61406,37.488353],[55.611303,37.491571],[55.606105,37.497644],[55.600249,37.504467],[55.598852,37.506398],[55.59782,37.508158],[55.596107,37.511677],[55.5946,37.515818],[55.592158,37.525946],[55.590068,37.534551],[55.586361,37.549936],[55.582873,37.564603],[55.581062,37.572131],[55.580734,37.573654],[55.577817,37.585778],[55.576966,37.589404],[55.576261,37.593567],[55.575969,37.596163],[55.575689,37.600648],[55.575252,37.608201],[55.574972,37.612879],[55.574243,37.625346],[55.573513,37.637479],[55.573051,37.645612],[55.572735,37.650847],[55.572565,37.653658],[55.571981,37.663614],[55.571811,37.668743],[55.571957,37.671876],[55.572297,37.675116],[55.573252,37.68033],[55.57482,37.68548],[55.576923,37.691209],[55.57944,37.698033],[55.5817,37.703976],[55.583524,37.708912],[55.586197,37.715971],[55.588324,37.721443],[55.590208,37.726013],[55.591720,37.729490]];
        const mkad_k_ya = [[55.591720,37.729490],[55.593498,37.733771],[55.595178,37.737805],[55.597523,37.743384],[55.600198,37.749782],[55.602931,37.755597],[55.607766,37.764395],[55.612315,37.772635],[55.61637,37.779973],[55.619261,37.78523],[55.622333,37.791517],[55.625235,37.796667],[55.627456,37.799929],[55.630952,37.805293],[55.634867,37.811301],[55.638536,37.816854],[55.641789,37.821853],[55.644261,37.825694],[55.648411,37.831981],[55.650736,37.835093],[55.653636,37.837646],[55.655007,37.838504],[55.656742,37.839234],[55.658756,37.839706],[55.661541,37.839856],[55.66719,37.838209],[55.682256,37.832561],[55.684632,37.831638],[55.686572,37.830909],[55.689507,37.829922],[55.692239,37.829492],[55.695657,37.829664],[55.697899,37.8302],[55.700443,37.831188],[55.703664,37.832947],[55.706354,37.834363],[55.710025,37.836359],[55.712709,37.837775],[55.715447,37.838762],[55.718354,37.839084],[55.72298,37.839685],[55.727271,37.8402],[55.731286,37.840672],[55.733145,37.840843],[55.740034,37.841659],[55.743072,37.841938],[55.746496,37.842217],[55.751742,37.842453],[55.756315,37.842667],[55.762328,37.842978],[55.767358,37.843289],[55.771293,37.843461],[55.775058,37.843096],[55.778687,37.842688],[55.782779,37.842241],[55.7921,37.841228],[55.797356,37.840628],[55.804161,37.839865],[55.807448,37.839715],[55.812161,37.839221],[55.81376,37.839025],[55.814081,37.839101],[55.81709,37.8385],[55.819192,37.8382],[55.820779,37.837665],[55.822374,37.836892],[55.823992,37.835776],[55.82549,37.834532],[55.826941,37.832824],[55.828535,37.830549],[55.830805,37.826601],[55.838798,37.81109],[55.846863,37.795297],[55.854833,37.779891],[55.862901,37.764184],[55.870901,37.748734],[55.878967,37.732984],[55.882419,37.72586]];
        //координаты ТТК по частям (координаты по часовой стрелке собирал)
        const ttk_ya_v = [[55.791947,37.634492],[55.7921,37.630946],[55.792777,37.624079],[55.793212,37.617299],[55.793173,37.616641],[55.792883,37.607285],[55.792206,37.595784],[55.792158,37.584369],[55.791723,37.574498],[55.78026,37.558362],[55.785590,37.565679]];
        const ttk_v_l  = [[55.785590,37.565679],[55.774836,37.553331],[55.773156,37.546145],[55.770399,37.542282],[55.766334,37.537218],[55.752081, 37.531606],[55.740244,37.53533],[55.734384,37.542626],[55.731769,37.54357],[55.724173,37.550951],[55.721703,37.556444],[55.717827,37.569405],[55.709493,37.583395]];
        const ttk_l_k  = [[55.709493,37.583395],[55.706343,37.590262],[55.701037,37.609917],[55.701716,37.614039],[55.705642,37.620219],[55.705923,37.621377]];
        const ttk_k_ya = [[55.705923,37.621377],[55.705884,37.623652],[55.703218,37.656268],[55.712232,37.674206],[55.715425,37.683991],[55.723918,37.712636],[55.729947,37.70637],[55.736175,37.698989],[55.739759,37.697186],[55.7421,37.697358],[55.746227,37.699788],[55.748938,37.698758],[55.754293,37.693825],[55.755705,37.691714],[55.758318,37.685448],[55.760738,37.68459],[55.764755,37.685877],[55.767645,37.687937],[55.770247,37.688538],[55.773336,37.685706],[55.777158,37.680384],[55.779602,37.673604],[55.782988,37.666737],[55.793348,37.652318],[55.793825,37.648026],[55.792148,37.638156],[55.791947,37.634492]];
        //полностью вся Москва внутри МКАДа
        const moscowCoordinates = [mkad_ya_v.concat(mkad_v_l,mkad_l_k,mkad_k_ya)];
        // между ТТК и МКАДом
        const betweenTTKandMKAD = [mkad_ya_v.concat(mkad_v_l,mkad_l_k,mkad_k_ya),ttk_ya_v.concat(ttk_v_l,ttk_l_k,ttk_k_ya)];
        // внутри ТТК
        const insideTTK = [ttk_ya_v.concat(ttk_v_l,ttk_l_k,ttk_k_ya)];

        const blocks = [
            {hint: 'moscow', color: 'rgb(97, 189, 252)', coordinates: moscowCoordinates},
            {hint: 'от МКАД до ТТК', color: 'rgba(255, 255, 255, 0)', coordinates: betweenTTKandMKAD},
            {hint: 'внутрь ТТК и садового кольца', color: 'rgb(255, 230, 0)', coordinates: insideTTK}
        ];
        const zoneIteration = ['moscow', '1', '2'];
        blocks.forEach((b, i) => {
            const polygon = new ymaps.Polygon(
                b.coordinates,
                {hintContent: b.hint},
                {fillColor: b.color, interactivityModel: 'default#transparent', strokeWidth: 0, opacity: 0.4}
            );

            this._zones[zoneIteration[i]] = polygon;
            this._ym.geoObjects.add(polygon);
        });

        function showAdress(coords) {
            var address;
            ymaps.geocode(coords).then(function (res) {
                address =  res.geoObjects.get(0).getAddressLine();
                self.buildRoute(address);
                document.getElementById('delivery_calc_city').value = address;
                self.suggestions();
            });
        }

        var posTopZoom = 150;
        var posTopGeo = 224;
        if(window.outerWidth > 1023) {
            posTopZoom = 300;
            posTopGeo = 374;
        }

        // Создадим пользовательский макет ползунка масштаба.
        var ZoomLayout = ymaps.templateLayoutFactory.createClass("<div class='delivery-map-zoom'>" +
            "<div id='zoom-in' class='btn'><i class='isoi isoi-plus'></i></div>" +
            "<div id='zoom-out' class='btn'><i class='isoi isoi-minus'></i></div>" +
            "</div>", {

            // Переопределяем методы макета, чтобы выполнять дополнительные действия
            // при построении и очистке макета.
            build: function () {
                // Вызываем родительский метод build.
                ZoomLayout.superclass.build.call(this);

                // Привязываем функции-обработчики к контексту и сохраняем ссылки
                // на них, чтобы потом отписаться от событий.
                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                // Начинаем слушать клики на кнопках макета.
                $('#zoom-in').bind('click', this.zoomInCallback);
                $('#zoom-out').bind('click', this.zoomOutCallback);
            },

            clear: function () {
                // Снимаем обработчики кликов.
                $('#zoom-in').unbind('click', this.zoomInCallback);
                $('#zoom-out').unbind('click', this.zoomOutCallback);

                // Вызываем родительский метод clear.
                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
            },

            zoomOut: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
            }
        });
        var zoomControl = new ymaps.control.ZoomControl({
            options: {
                layout: ZoomLayout,
                position: {
                    top: posTopZoom,
                    right: 10,
                    bottom: 'auto',
                    left: 'auto'
                }
            }
        });
        this._ym.controls.add(zoomControl);

        var geoLayout = ymaps.templateLayoutFactory.createClass("<div class='delivery-map-zoom'>" +
            "<div id='geo-in' class='btn delivery-map-geo'></div>" +
            "</div>", {
                build: function () {
                    // Вызываем родительский метод build.
                    geoLayout.superclass.build.call(this);

                    // Привязываем функции-обработчики к контексту и сохраняем ссылки
                    // на них, чтобы потом отписаться от событий.
                    this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);

                    // Начинаем слушать клики на кнопках макета.
                    $('#geo-in').bind('click', this.zoomInCallback);
                },

                clear: function () {
                    // Снимаем обработчики кликов.
                    $('#geo-in').unbind('click', this.zoomInCallback);

                    // Вызываем родительский метод clear.
                    geoLayout.superclass.clear.call(this);
                },

                zoomIn: function () {
                    var map = this.getData().control.getMap();
                    ymaps.geolocation.get({
                        // Выставляем опцию для определения положения по ip    provider: 'yandex',
                        // Карта автоматически отцентрируется по положению пользователя.
                        mapStateAutoApply: true}).then(function (result) {
                        self._ym.panTo(result.geoObjects.position);
                    });
                },
            }
        );

        var geolocationControl = new ymaps.control.GeolocationControl({
            options: {
                layout: geoLayout,
                noPlacemark: true,
                position: {
                    top: posTopGeo,
                    right: 10,
                    bottom: 'auto',
                    left: 'auto'
                }
            }
        });
        this._ym.controls.add(geolocationControl);
    }

    showPolygones() {
        this._ym.geoObjects.each(function (geoObject) {
            if(geoObject.geometry.getType() == 'Polygon') {
                geoObject.options.set({opacity: '0.4'})
            }
        });
    }

    hidePolygones() {
        this._ym.geoObjects.each(function (geoObject) {
            if(geoObject.geometry.getType() == 'Polygon') {
                geoObject.options.set({opacity: '0'})
            }
        });
    }
}

class DeliveryCalculator {
    /**
     * @param {object} data
     */
    constructor(data) {
        this._items = [];
        data.forEach(item => {
            this._items.push(new DeliveryItem(item));
        });
        this.zone = 'zone1';
        this.length = 0;
        this.time = 'f9t20'
        this._renderItems()._appendListenerItems();
        this._renderDeliveryTime()._appendListenerTime();
        this.active = false;
    }

    _renderItems() {
        /**
         * render items markup from json
         */
        const itemsContainer = document.getElementById('delivery-type');
        for (var i = 0; i < this._items.length; i++) {
            let prefix = 'до';
            let units = 'кг';
            let weight = this._items[i].weight;
            if(this._items[i].crane) {
                prefix = 'кран';
                units = 'т';
                weight = Math.floor(parseInt(weight)/1000);
            }
            let itemHtml =
                '<div class="delivery-type__item">'
                + '<a class="delivery-type__link collapsed" href="#" data-id="'+ i +'" data-target="#delivery-list'+ i +'">'
                + '<svg class="svg-car"><use xlink:href="#car-'+i+'"/></svg>'
                + '<div class="delivery-type__data">'
                + '<span class="delivery-type__title">' + prefix + ' ' + weight + ' '+units+'</span>'
                + '<span class="delivery-type__cost">от ' + this._items[i].prices.zone1.f9t20 + ' ₽</span>'
                + '</div>'
                + '<span class="isoi isoi-angle-down"></span>'
                + '</a>'
                + '<div class="delivery-list collapse" id="#delivery-list'+ i +'">'
                + this._items[i].renderItem();
                + '</div>'
                + '</div>';
            itemsContainer.innerHTML += itemHtml;
        }
        return this;
    }

    _renderDeliveryTime() {
        /**
         * render items markup from json
         */
        const itemsContainer = document.querySelector('.delivery-time .dropdown-menu');
        for (var item in DELIVERY_TIME) {
            if (DELIVERY_TIME.hasOwnProperty(item)) {
                let itemHtml =
                    '<a class="delivery-time__item" href="#" data-time="'+ item +'">'
                    + DELIVERY_TIME[item]
                    + '</a>'
                itemsContainer.innerHTML += itemHtml;
            }
        }
        return this;
    }

    _appendListenerItems() {
        const items = document.querySelectorAll('.delivery-type__link');
        const self = this;
        $('.delivery-type__link').popover({
            trigger: 'manual',
            placement: 'top',
            html: 'true',
            content: function content() {
                return $(this).next('.delivery-list').html();
            },
            template: '<div class="popover popover-delivery" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
        });

        $('.delivery-type__link').on('click', function (e) {
            e.preventDefault();
            const $this = $(this);
            $('.delivery-type__link').removeClass('active');
            if ($(window).width() < 768) {
                $('#delivery-type').find('.delivery-list.in').collapse('hide');
                $('#delivery-type').find('.delivery-type__link').not(this).addClass('collapsed');
                $this.toggleClass('collapsed');
                $this.next('.delivery-list').collapse('toggle');
            }
            $this.addClass('active');
        });

        $('.delivery-list').on('show.bs.collapse', function () {
            $('.delivery-list').not(this).collapse('hide');
        });

        $('.delivery-type__link').on('mouseenter', function (e) {
            e.preventDefault();
            const $this = $(this);
            $('.delivery-type__link').removeClass('active');
            if ($(window).width() >= 768) {
                $('.delivery-type__link').not(this).popover('hide');
                $this.popover('toggle');
            }
            $this.addClass('active');
        });
        $('.delivery-type__link').on('mouseleave', function (e) {
            e.preventDefault();
            const $this = $(this);
            if ($(window).width() >= 768) {
                $('.delivery-type__link').popover('hide');
            }
        });
    }

    _appendListenerTime() {
        const items = document.querySelectorAll('.delivery-time__item');
        const self = this;
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('click', function(e) {
                e.preventDefault();
                if(this.classList.contains('disabled')) {
                    return;
                }
                for (var j = 0; j < items.length; j++) {
                    items[j].classList.remove('active', 'disabled');
                }
                this.classList.add('active');
                self.time = this.dataset.time;
                self.renderDeliveryDataTime();
                document.getElementById('delivery-time').innerHTML = this.innerHTML;
                document.getElementById('delivery-time').classList.add('active');
            });
        }
    }

    renderDeliveryDataTime(zone, length) {
        if(!!zone) {
            this.zone = zone;
            this.length = length;
        }
        let prefix = '';
        if(this.length === 0 && !this.active) {
            prefix = 'от ';
        }
        this.triggerTimeItems(this.zone);
        for (var i = 0; i < this._items.length; i++) {
            let cost = prefix + this._items[i].calculateDelivery(this.zone, this.length, this.time) + ' ₽';
            const costItem = document.querySelector('.delivery-type__link[data-id="'+i+'"] .delivery-type__cost');
            costItem.innerText = cost;
        }
    }

    renderDeliveryData(zone, length) {
        if(!!zone) {
            this.zone = zone;
            this.length = length;
        }
        this.triggerTimeItems(this.zone);
        if(!document.querySelectorAll('.delivery-time__dropdown.active').length) {
            document.querySelector('.delivery-time__dropdown').innerHTML = document.querySelectorAll('.delivery-time__item')[0].innerHTML;
            document.querySelector('.delivery-time__dropdown').classList.add('active');
        }

        for (var i = 0; i < this._items.length; i++) {
            let cost = this._items[i].calculateDelivery(this.zone, this.length, this.time) + ' ₽';
            const costItem = document.querySelector('.delivery-type__link[data-id="'+i+'"] .delivery-type__cost');
            costItem.innerText = cost;
            costItem.classList.add('active');
            this.active = true;
        }
    }

    triggerTimeItems(zone) {
        const items = document.querySelectorAll('.delivery-time__item');
        let activeTime = ['f9t20', 'f14t20', 'f9t14', 'f10t18', 'exact', 'night', 'today'];
        if(zone === 'zone3') {
            activeTime = ['f9t20', 'f10t18']
        }

        if(items.length) {
            for (var i = 0; i < items.length; i++) {
                items[i].classList.add('disabled');
            }
            for (var i = 0; i < activeTime.length; i++) {
                document.querySelector('[data-time="' + activeTime[i] + '"]').classList.remove('disabled');
            }
        }
        if(activeTime.indexOf(this.time) < 0) {
            document.getElementById('delivery-time').innerHTML = document.querySelector('[data-time="' + activeTime[0] + '"]').innerHTML;
        }
    }
}

const LABELS = {
    weight: {
        title: "Масса груза",
        prefix: "до",
        units: "кг"
    },
    volume: {
        title: "Объем груза",
        prefix: "до",
        units: "м<sup>3</sup>"
    },
    length: {
        title: "Длина груза",
        prefix: "до",
        units: "метров"
    },
    zone1: {
        title: "Зона 1",
        prefix: "",
        units: "₽"
    },
    zone2: {
        title: "Зона 2",
        prefix: "",
        units: "₽"
    },
    km: {
        title: "1 км за МКАД",
        prefix: "",
        units: "₽"
    },
    transportCostHour: {
        title: "1 час простоя",
        prefix: "",
        units: "₽"
    },
    unloading: {
        title: "Норма разгрузки",
        prefix: "",
        units: ""
    },
    awning: {
        title: "Растентовка",
        prefix: "",
        units: "₽"
    }
};

const DELIVERY_TIME = {
    f9t20: "доставка с 9:00 до 20:00",
    f14t20: "доставка с 14:00 до 20:00",
    f9t14: "доставка с 9:00 до 14:00",
    f10t18: "доставка с 10:00 до 18:00",
    exact: "точно ко времени (+/-30 минут)",
    night: "ночная доставка с 20:00 до 8:00",
    today: 'доставка "День в день"'
}

class DeliveryItem {
    /**
     * @param {object} data
     *  object with information about delivery
     */
    constructor(data) {
        this.weight = data.weight;
        this.volume = data.volume;
        this.length = data.length;
        this.prices = data.prices;
        this.zone1 = data.prices.zone1.f9t20;
        this.zone2 = data.prices.zone2.f9t20;
        this.km = data.km;
        this.transportCostHour = data.transportCostHour;
        this.unloading = data.unloading;
        this.awning = data.awning;
        this.crane = data.crane;
    };

    calculateDelivery(zone, length, time) {
        const prices = this.prices[zone];
        if(!prices[time] || prices[time] === undefined) {
            time = 'f9t20';
        }
        let minCost = 0;
        if(prices) {
            minCost = prices[time];
        }
        return minCost + Math.ceil(length / 1000) * this.km;
    }

    renderItem() {
        let itemHtml = '';
        let i = 0;
        for (var label in LABELS) {
            if (LABELS.hasOwnProperty(label) && this[label]) {
                if(i === 0) {
                    itemHtml += '<div class="col">';
                }
                itemHtml += '<div class="delivery-list__item">'
                + '<span class="delivery-list__item-title '+label+'">'
                + LABELS[label].title
                + '</span>'
                + '<span class="delivery-list__item-val">'
                + LABELS[label].prefix + ' ' + this[label] + ' ' + LABELS[label].units
                + '</span></div>';
                if(i === 4) {
                    itemHtml += '</div>';
                    i = 0;
                } else {
                    i++;
                }
            }
        }
        if(i < 4) {
            itemHtml += '</div>';
        }
        return itemHtml;
    }
}

$(document).ready(function() {
    const btnCalc = $('#sendOrderButtonShipping');
    const btnAddToOrder = $('#btn_add_to_order,#btn_add_to_order_mobile');
    const btnRemoveFromOrder = $('#btn_remove_from_order,#btn_remove_from_order_mobile');

    function showLoader() {
        btnCalc.addClass('iso-bar disabled');
    }
    function setVidgetPostion() {
        const currentWidth = $(window).width();
        if(currentWidth > 1023) {
            var position = (currentWidth - document.querySelector('.delivery-head').offsetWidth)/2;
            if(currentWidth < 1270) {
                position += 30;
            }
            document.querySelector('.delivery-calc').style.left = Math.ceil(position) + 'px';
        } else {
            document.querySelector('.delivery-calc').style.left = '';
        }
    }
    ymaps.ready(() => {
        const calc = new DeliveryCalculator(zonePrices);
        const builder = new RouteCalculator(
            (zone, length) => calc.renderDeliveryData(zone, length), closeSuggest
        );
        const suggestions = new ymaps.SuggestView('delivery_calc_city', {
            offset: [-1,2],
            zIndex: 1000
        });

        suggestions.events.add('select', function(event) {
            builder.buildRoute(event.get('item').value);
        });

        function closeSuggest() {
            suggestions.state.set({
                open: false
            });
            $('#delivery-form > .form-group > ymaps').hide();
        }

        $('.btn-delivery-form').on('click', function() {
            builder.buildRoute($('#delivery_calc_city').val());
        });

        $('#trigger-polygons .custom-control__input').on('change', function () {
            $(this).is(':checked') ? builder.showPolygones() : builder.hidePolygones();
        });
    });

    $('#delivery-form').on('submit', function(e) {
        e.preventDefault();
    });

    const zonePrices = [
    {
        "weight": 50,
        "volume": 0.5,
        "length": 3,
        "prices": {
            "zone1": {
                "f9t20": 500,
                "f14t20": 700,
                "f9t14": 900,
                "f10t18": 900,
                "exact": 1300,
                "night": 1300,
                "today": 1300
            },
            "zone2": {
                "f9t20": 500,
                "f14t20": 700,
                "f9t14": 900,
                "f10t18": 900,
                "exact": 1300,
                "night": 1300,
                "today": 1300
            },
            "zone3": {
                "f9t20": 500,
                "f10t18": 900
            }
        },
        "km": 30,
        "transportCostHour": 300,
        "unloading": "20 мин",
        "crane": false
    },
    {
        "weight": 300,
        "volume": 2,
        "length": 3,
        "prices": {
            "zone1": {
                "f9t20": 700,
                "f14t20": 800,
                "f9t14": 900,
                "f10t18": 900,
                "exact": 1300,
                "night": 1300,
                "today": 1300
            },
            "zone2": {
                "f9t20": 1000,
                "f14t20": 1100,
                "f9t14": 1200,
                "f10t18": 1200,
                "exact": 1300,
                "night": 1600,
                "today": 1600
            },
            "zone3": {
                "f9t20": 700,
                "f10t18": 900
            }
        },
        "km": 30,
        "transportCostHour": 300,
        "unloading": "20 мин",
        "crane": false
    },
    {
        "weight": 1500,
        "volume": 8,
        "length": 4,
        "prices": {
            "zone1": {
                "f9t20": 1600,
                "f14t20": 1700,
                "f9t14": 1900,
                "f10t18": 1900,
                "exact": 2200,
                "night": 2200,
                "today": 2100
            },
            "zone2": {
                "f9t20": 1900,
                "f14t20": 2000,
                "f9t14": 2200,
                "f10t18": 2200,
                "exact": 2500,
                "night": 2500,
                "today": 2400
            },
            "zone3": {
                "f9t20": 1500,
                "f10t18": 1900
            }
        },
        "km": 30,
        "transportCostHour": 350,
        "unloading": "40 мин",
        "crane": false
    },
    {
        "weight": 3500,
        "volume": 15,
        "length": 4.2,
        "prices": {
            "zone1": {
                "f9t20": 2700,
                "f14t20": 2800,
                "f9t14": 3000,
                "f10t18": 3000,
                "exact": 3900,
                "night": 3900,
                "today": ""
            },
            "zone2": {
                "f9t20": 3200,
                "f14t20": 3300,
                "f9t14": 3500,
                "f10t18": 3500,
                "exact": 4400,
                "night": 4400,
                "today": ""
            },
            "zone3": {
                "f9t20": 2700,
                "f10t18": 3000
            }
        },
        "km": 40,
        "transportCostHour": 300,
        "unloading": "1 час",
        "crane": false
    },
    {
        "weight": 5000,
        "volume": 27,
        "length": 6.2,
        "prices": {
            "zone1": {
                "f9t20": 3600,
                "f14t20": 3800,
                "f9t14": 4000,
                "f10t18": 4000,
                "exact": 6000,
                "night": 6000,
                "today": ""
            },
            "zone2": {
                "f9t20": 4200,
                "f14t20": 4100,
                "f9t14": 4500,
                "f10t18": 4500,
                "exact": 6600,
                "night": 6600,
                "today": ""
            },
            "zone3": {
                "f9t20": 3600,
                "f10t18": 4000
            }
        },
        "km": 40,
        "transportCostHour": 300,
        "unloading": "1.5 часа",
        "crane": false,
        "awning": 700
    },
    {
        "weight": 10000,
        "volume": 32,
        "length": 6.2,
        "prices": {
            "zone1": {
                "f9t20": 5000,
                "f14t20": 6500,
                "f9t14": 6700,
                "f10t18": 6700,
                "exact": 8000,
                "night": 8000,
                "today": ""
            },
            "zone2": {
                "f9t20": 6000,
                "f14t20": 7300,
                "f9t14": 7500,
                "f10t18": 7500,
                "exact": 8800,
                "night": 8800,
                "today": ""
            },
            "zone3": {
                "f9t20": 5000,
                "f10t18": 6700
            }
        },
        "km": 45,
        "transportCostHour": 550,
        "unloading": "2 часа",
        "crane": false,
        "awning": 1000
    },
    {
        "weight": 15000,
        "volume": 42,
        "length": 7.3,
        "prices": {
            "zone1": {
                "f9t20": 7200,
                "f14t20": 9500,
                "f9t14": 10000,
                "f10t18": 10000,
                "exact": 12000,
                "night": 12000,
                "today": ""
            },
            "zone2": {
                "f9t20": 8000,
                "f14t20": 10000,
                "f9t14": 11000,
                "f10t18": 11000,
                "exact": 12800,
                "night": 12800,
                "today": ""
            },
            "zone3": {
                "f9t20": 7200,
                "f10t18": 10000
            }
        },
        "km": 56,
        "transportCostHour": 770,
        "unloading": "2.5 часа",
        "crane": false,
        "awning": 1000
    },
    {
        "weight": 10000,
        "volume": 10,
        "length": 6.2,
        "prices": {
            "zone1": {
                "f9t20": 11500,
                "f14t20": 12500,
                "f9t14": 13000,
                "f10t18": 13000,
                "exact": 14500,
                "night": 14500,
                "today": ""
            },
            "zone2": {
                "f9t20": 12500,
                "f14t20": 13500,
                "f9t14": 14000,
                "f10t18": 14000,
                "exact": 15500,
                "night": 15500,
                "today": ""
            },
            "zone3": {
                "f9t20": 11500,
                "f10t18": 13000
            }
        },
        "km": 56,
        "transportCostHour": 770,
        "unloading": "2.5 часа",
        "crane": true,
        "awning": ''
    },
    {
        "weight": 20000,
        "volume": 80,
        "length": 12,
        "prices": {
            "zone1": {
                "f9t20": 10000,
                "f14t20": 11000,
                "f9t14": 12000,
                "f10t18": 12000,
                "exact": 15000,
                "night": 15000,
                "today": ""
            },
            "zone2": {
                "f9t20": 12000,
                "f14t20": 12000,
                "f9t14": 13000,
                "f10t18": 13000,
                "exact": 16000,
                "night": 16000,
                "today": ""
            },
            "zone3": {
                "f9t20": 11000,
                "f10t18": 12000
            }
        },
        "km": 70,
        "transportCostHour": 1200,
        "unloading": "4 часа",
        "crane": false,
        "awning": 0
    }];

    setVidgetPostion();
    $(window).on('resize', function() {
        setVidgetPostion();
    });
});
