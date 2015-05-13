/*
 * cartier.location.googlemap.js
 * This file contains functionalities handling the Storelocator and Boutique Pages
 *
 * @project   Cartier Desktop
 * @date      2014-01-03
 * @author    Sapient 
 * @licensor  cartier Desktop
 * @site      cartier Desktop
   @dependency cartier.core.js, cartier.location.js
 * @ NOTE:
    This file has the following sequence of the actions
    1) Declare all the private variables
    2) caching jquery wrapper objects and messages
    $last) call to init() method
 */
;

(function(win, $, ns, undefined) {
	//this will cause the browser to check for errors more aggressively
	'use strict';
	//check if Jquery is defined, else return
	if (typeof $ === 'undefined') {
		//console.log('jQuery not found');
		return false;
	}
	cartier.location.googlemap = function(element, options, ns, win, $, dataStore, undefined) {
		'use strict';
		var _timeout = false,
			_markerClusterer,
			_processedData = [],
			_xhrData,
			$_elem,
			_order,
			_bounds,
			_element = element,
			_map,
			_canvas,
			_ctx,
			_isCanvasReady = false,
			_markerImgInstance,
			_options,
			_isAjaxReady = true,
			defaults = {
				zoomControl: true,
				scrollwheel: false,
				zoomControlOptions: {
					'style': 1
				},
				mapMinZoom: 2,
				mapMaxZoom: 16,
				mcOptions: {
					gridSize: 50,
					maxZoom: 15
				},
				cluster: true,
				beforeRefreshCb: function() {},
				refreshCb: function() {},
				afterRefreshCb: function() {},
				markers: [],
				markerClusterer: null,
				zoom: 10,
				size: 10,
				center: {
					lat: 40.970177,
					lng: -73.966925
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				imageUrl: ''
			},

			//--------------------------------------------------------------------------------------------------------
			//          EVENT Bindings
			//--------------------------------------------------------------------------------------------------------
			/*
          @private method : bind events
          @param : none
        */
			_bindEvents = function() {

				ns.subscribe('visibilityChanged', function(data) {
					_refreshViewForfilters(data.data);
				});

				ns.subscribe('dataChanged', function(data) {

					_refreshView(data.data);
				});
				ns.subscribe('orderChanged', function(data) {
					//_order = data.order;
					_reorder(data.order);
				});
				ns.subscribe('mapNewCenter', function(data) {
					_map.setCenter(data.center);
					if (data.zoomLevel !== undefined) {
						_map.setZoom(data.zoomLevel);
					} else {
						_map.setZoom(_options.zoom);
					}
				});
				setTimeout(function(){
					google.maps.event.addListener(_map, 'center_changed', function() {
						var min = _options.mapMinZoom;
						var max = _options.mapMaxZoom;
						var zoom = _map.getZoom();

						if (zoom < max && _isAjaxReady) {
							setTimeout(function(){
								_handleMapChange();
							}, 100);

						}

						$(_map).trigger('bounds_changed');
					});
					google.maps.event.addListener(_map, 'bounds_changed', function() {
						var min = _options.mapMinZoom;
						var max = _options.mapMaxZoom;
						var zoom = _map.getZoom();
						if (zoom < max && _isAjaxReady) {
							setTimeout(function(){
								_handleMapChange();
							}, 100);
						}
					});
					google.maps.event.addListener(_map, 'zoom_changed', function() {
						var min = _options.mapMinZoom;
						var max = _options.mapMaxZoom;
						var zoom = _map.getZoom();
						if (zoom < min) {
							_map.setZoom(min);
						}
						if (zoom > max) {
							_map.setZoom(max);
						}

						if (zoom < max && _isAjaxReady) {
							setTimeout(function(){
								_handleMapChange();
							}, 100);
						}
					});
				}, 1000);
				google.maps.event.addListenerOnce(_map, 'bounds_changed', function() {
					_handleMapChange(true);
				});

			},
			/*
          @private method : handle Bound Changes
          @param : none   
        */
			_handleBounds = function() {
				_bounds = _map.getBounds();
				if (typeof _bounds !== 'undefined' && _bounds !== null) {

					var newBounds = _map.getBounds();

					if (newBounds.intersects(_bounds)) {
						$_elem.data('plugin_storelocator')._geocodeMe(null, newBounds,
							function() {
								_refreshVisibleList("2");
								dataStore.update($_elem.data('plugin_storelocator')._geocodeSender());
							},
							function(city) {
								$('.js-GeoCity').html(city);
								$('.js-storeTitle').css('visibility', 'visible');
							}
						);

					}
				}
			},

			/*
          @private method : handle Map Change
          @param : none   
        */
			_handleMapChange = function(highPriority) {

				if(highPriority)
					_timeout = false;
				//refreshes the map with a slight delay because the events are fired very rapid
				if (_timeout === false) {
					_timeout = true;
					$('.js-storeTitle').css('visibility', 'hidden');
					_refreshVisibleList("3");
					_handleBounds();

					win.setTimeout(function() {
						_timeout = false;
					}, 1000);
				}
			},
			/*
          @private method : Add Marker in Marker Clusters
          @param : marker Object   
        */
			_addMarker = function(marker) {
				if ($.isArray(marker)) {
					_markerClusterer.addMarkers(marker);
				} else {
					_markerClusterer.addMarker(marker);
				}
			},

			/*
          @private method : Function To refresh Visible Store List
          @param : none   
        */
			_refreshVisibleList = function(arg) {
				var visibles = [];
				var hidden = [];
				var fallBackBound;

				var i = _processedData.length;
				if (!_map.getBounds()) {
					return;
				}
				while (i--) {
					fallBackBound = _processedData[0].getPosition();

					if (_map.getBounds().contains(_processedData[i].getPosition())) {
						visibles.push(_processedData[i].sid);
					} else {
						hidden.push(_processedData[i].sid);
					}
				}


				if (visibles.length || hidden.length) {
					ns.publish('filterDataSet', {
						'type': 'map',
						'visibles': visibles,
						'hidden': hidden
					});
				}
				if (_order) {
					$.each(_order, function(i, sid) {
						if ($.inArray(sid, visibles) !== -1) {

						}
					});
				}


				if (visibles.length === 0 && typeof fallBackBound !== "undefined")
					_mapZoomManup(arg, fallBackBound);
			},


			_mapZoomManup = function(arg, fallBackBound) {

				if (arg === "1") {
					$('.hideonload').addClass('display-none');
					$('.loadingindicator').show();
					setTimeout(function() {
						var visibles = [];
						var hidden = [];
						var i = _processedData.length;
						if (!_map.getBounds()) {
							return;
						}
						while (i--) {
							if (_map.getBounds().contains(_processedData[i].getPosition())) {
								visibles.push(_processedData[i].sid);
							} else {
								hidden.push(_processedData[i].sid);
							}
						}

						if (visibles.length === 0) {
							_map.setZoom(8);
							_map.setCenter(fallBackBound);
							_refreshVisibleList("2");
						}

						$('.hideonload').removeClass('display-none');
						$('.loadingindicator').hide()

					}, 1000);
				}
			},

			/*
          @private method : Refresh View After Filtering
          @param : none   
        */
			_refreshViewForfilters = function(data, fitBounds) {
				if (_isCanvasReady === false) {
					win.setTimeout(function() {

						_refreshView(data, fitBounds);
					}, 100);
					return;
				}
				_bounds = new google.maps.LatLngBounds();
				_xhrData = data;
				_markerClusterer.clearMarkers();
				_processedData = [];
				$.each(_xhrData, function(i, store) {
					/* “ DATE 13-10-2014 |  DEFECT- CIR 3845| BRANCH 2.0.0/"  
                    START if condition added 
        
                 */

					if (_xhrData[i].visible) {
						_xhrData[i].position = new google.maps.LatLng(store.latitude, store.longitude);
						_bounds.extend(_xhrData[i].position);
						var marker = new google.maps.Marker(_xhrData[i]);
						_processedData.push(marker);
						_setMarkerBallons(_processedData, marker);
					}
					/*END*/

				});
				if (fitBounds) {
					_map.fitBounds(_bounds);
				}
				_addMarker(_processedData);



			},
			/*
          @private method : Function to Refresh View / Store List
          @param : none   
        */
			_refreshView = function(data, fitBounds) {
				if (_isCanvasReady === false) {
					win.setTimeout(function() {
						_refreshView(data, fitBounds);
					}, 100);
					return;
				}
				_bounds = new google.maps.LatLngBounds();
				_xhrData = data;
				_markerClusterer.clearMarkers();
				_processedData = [];
				$.each(_xhrData, function(i, store) {

					_xhrData[i].position = new google.maps.LatLng(store.latitude, store.longitude);
					_bounds.extend(_xhrData[i].position);
					var marker = new google.maps.Marker(_xhrData[i]);
					_processedData.push(marker);
					_setMarkerBallons(_processedData, marker);


				});
				if (fitBounds) {
					_map.fitBounds(_bounds);
				}
				_addMarker(_processedData);

				_refreshVisibleList("1");
			},

			/*
          @private method : Function to Set Ballons on Map Marker with Store info
          @param : Store data, marker Object   
        */
			_setMarkerBallons = function(data, marker) {



				var infowindow = new win.google.maps.InfoWindow();

				// Define what to put in the popup when clicking on a marker.
				win.google.maps.event.addListener(marker, 'click', function() {
					var popup = '';
					_isAjaxReady = false;

					window.setTimeout(function() {
						_isAjaxReady = true;
					}, 500);

					google.maps.event.trigger(_map, 'click');

					$.each(data, function(index, val) {
						if (marker.sid === data[index].sid) {
							if (data[index].typeofstore == 'Boutique') {
								popup = '<div class="location vcard"><h4><a href="' + data[index].url + '" class="getlocations_infolink" target="_parent">' + data[index].name + '</a></h4><div class="adr"><div class="boutique-map-image"><img src="' + data[index].imgsrc + '" alt="">        </div><div class="address"><div class="mystore-sub">' + data[index].street + '<br>' + data[index].city + data[index].zipcode + data[index].state + ' </div></div><div class="phone-number">' + data[index].phone + '</div><div class="phone-number">' + data[index].fax + '</div></div><div class="view-more"><a href="' + data[index].url + '" class="getlocations_infolink" target="_parent">Find out more</a></div></div>';
							} else {
								popup = '<div class="location vcard"><h4>' + data[index].name + '</h4><div class="adr"><div class="boutique-map-image"></div><div class="address"><div class="mystore-sub">' + data[index].street + '<br>' + data[index].city + data[index].zipcode + data[index].state + ' </div></div><div class="phone-number">' + data[index].phone + '</div><div class="phone-number">' + data[index].fax + '</div></div><div class="view-more"></div></div>';
							}
						}
					});


					infowindow.setContent(popup);
					infowindow.open(_map, marker);
				});
				// Close the info window when user clicks on the map.
				win.google.maps.event.addListener(_map, 'click', function() {
					if (infowindow) {
						infowindow.close();
					}
				});

			},

			/*
          @private method : Function to Set Image
          @param : marker Object   
        */
			_setMarkerImage = function(marker, i) {


				if (marker.typeofstore === "Boutique") {
					marker.setIcon(_getRedMarker(i));
				} else {
					marker.setIcon(_getGreyMarker(i));
				}
			},

			/*
          @private method : Function to Reorder Store Orderlist
          @param : list Order Object 
        */
			_reorder = function(listOrder) {
				var count = 1;
				$.each(_processedData, function(i, marker) {
					if ($.inArray(marker.sid, listOrder) !== -1) {
						_setMarkerImage(marker, count++);
					}
				});
			},

			/*
          @private method : Add Marker to Coordinates
          @param : lat, lng Coordinates and Store Id
        */
			_addMarkerlatLng = function(lat, lng, sid) {
				_addMarker(_createMapsMarker(lat, lng, sid));
			},

			/*
          @private method : Function to Create a marker on the Map with Sid
          @param : lat, lng Coordinates and Store Id
        */
			_createMapsMarker = function(lat, lng, sid) {
				return new google.maps.Marker({
					'position': new google.maps.LatLng(lat, lng),
					'sid': sid
				});
			},
			/*
          @private method : to initialize _cacheObjects
          @param : none
        */
			_cacheObjects = function() {},

			/*
          @private method : Draw Text on Map/Canvas
          @param : none
        */
			_drawText = function(txt) {
				var middle = 0;
				_ctx.fillStyle = '#000';
				_ctx.font = 'bold 14px georgia';
				/* if mesureText is not supportet use static values*/
				if (typeof(_ctx.measureText) === 'undefined') { // ie IE
					middle = 10;
					if (txt.length > 2) {
						middle = 5;
					}
				} else {
					middle = _canvas.width / 2 - _ctx.measureText(txt).width / 2;
				}
				_ctx.fillText(txt, middle, 17);


			},
			/*
          @private method : To Get Red Marker
          @param : none
        */
			_getRedMarker = function(txt) {
				if ($('.no-canvas').length > 0) // IE8 fallback
				{
					return "/etc/designs/richemont-car/clientlibs/publish/Clientlibs_desktop/images/icons/markers/cartier/red/marker-cartier-" + txt + ".png"
				} else {
					_ctx.drawImage(_markerImgInstance, 0, 0);
					_drawText(txt);
					return _canvas.toDataURL(0, 0, _canvas.height, _canvas.width);
				}
			},
			/*
          @private method : To Get Grey Marker
          @param : none
        */
			_getGreyMarker = function(txt) {
				if ($('.no-canvas').length > 0) // IE8 fallback
				{
					return "/etc/designs/richemont-car/clientlibs/publish/Clientlibs_desktop/images/icons/markers/cartier/dark/marker-cartier-" + txt + ".png"
				} else {
					_ctx.drawImage(_markerImgInstance, 0, -36);
					_drawText(txt);
					return _canvas.toDataURL(0, 0, _canvas.height, _canvas.width);
				}
			},

			/*
          @private method : To enable isCanvasReady variable true 
          @param : none
        */
			_canvasReady = function() {
				_isCanvasReady = true;
			},

			/*
          @private method : To Create map Canvas
          @param : none
        */
			_createCanvas = function() {
				_canvas = document.createElement('canvas');
				_canvas.height = '36';
				_canvas.width = '26';
				_canvas.style.cssText = 'position:absolute; left: -10000px;';
				// just for testing
				document.body.appendChild(_canvas);
				if (typeof(G_vmlCanvasManager) != 'undefined') { // ie IE
					G_vmlCanvasManager.initElement(_canvas);
				}
				if (_canvas.getContext) {
					_ctx = _canvas.getContext('2d');
				}
				_markerImgInstance = new Image();
				_markerImgInstance.onload = _canvasReady;
				_markerImgInstance.src = _options.imageUrl;
			},

			/*
            @public Method : initialize the module
        */

			initialize = function() {
				$_elem = $(_element),
				defaults.imageUrl = $_elem.data('markerImage');
				_options = $.extend({}, defaults, options);
				_cacheObjects();

				// init map on first found container
				_map = new google.maps.Map(element, {
					zoom: _options.zoom,
					scrollwheel: false,
					zoomControl: _options.zoomControl,
					zoomControlOptions: {
						style: _options.zoomControlOptions.style
					},
					mapTypeId: _options.mapTypeId
				});

				ns.mapObj = _map;
				ns.defaultOption = defaults;
				/* “ DATE 13-10-2014 |  DEFECT- CIR 3845| BRANCH 2.0.0/"  
                    START  _options.mcOptions name changed
        
            */
				_markerClusterer = new MarkerClusterer(_map, [], _options.mcOptions);
				/*END*/
				$_elem.storelocator();
				_createCanvas();
				_bindEvents();

			};
		/*
            @public Method : To Bind A Click Event for the List Marker Icon to Focus on Map for that Store 
        */
		cartier.location._bindClickEventToListMarker = function() {

			$('.js-shop-on-map').on('click', function(event) {
				event.preventDefault();

				var LatLng = {
					lat: $(this).data('latcoords'),
					lng: $(this).data('lngcoords')
				};

				ns.mapObj.setZoom(16);
				ns.mapObj.setCenter(LatLng);

				var maxMarkers = _processedData.length;
				var myMarker;

				for (var i = 0; i < maxMarkers; i++) {

					if (_processedData[i].latitude === LatLng.lat && _processedData[i].longitude === LatLng.lng) {
						myMarker = _processedData[i];
						break;
					}

				}
				setTimeout(function() {
					google.maps.event.trigger(myMarker, 'click');
				}, 500);

			});
		};

		initialize();
	};

}(window, jQuery, cartier.location));