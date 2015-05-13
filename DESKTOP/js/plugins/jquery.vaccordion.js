/*!
 * jquery.vaccordion.js
 * This file contains application namespace and initializing the other modules
 *
 * @project   Cartier Desktop
 * @date      2014-01-21
 * @author    SapientNitro
 * @licensor  Cartier Desktop
 * @site      Cartier Desktop
 *
 * USAGE : Example 
         $('#selector').vaccordion({
            visibleSlices: 2,
            expandedHeight: 200,
            animOpacity: 0.1,
            contentAnimSpeed: 300,
            accordionH: 240
        });
/*} }]
 })*/

/*
 * This is a plugin for calling a popup Whenever called :
 
 */
(function($) {

	// cache some values
	var cache	= {
			idx_expanded	: -1, // the index of the current expanded slice
			sliceH			: 0,  // the default slice's height	
			current			: 0,  // controls the current slider position
			totalSlices		: 0	  // total number of slices
		},
		aux		= {
			// triggered when we click a slice. If the slice is expanded,
			// we close it, otherwise we open it..
			selectSlice		: function($navNext, $navPrev, settings ) {
				
				
			},
			// triggered when clicking the navigation buttons / mouse scrolling
			navigate		: function( dir, $slices, $navNext, $navPrev, settings ) {
				// if animating return
				// otherwise we slide, and the next one will open automatically
			
				
				if( settings.idx_expanded != -1 && !settings.savePositions ) {
					$el	= $slices.eq( settings.idx_expanded );
					
					$.when( aux.selectSlice($navNext, $navPrev, settings ) ).done(function(){
						setTimeout(function() {
						aux.slide( dir, $slices, $navNext, $navPrev, settings );
						}, 10);
					});
				}
				else {
					aux.slide( dir, $slices, $navNext, $navPrev, settings );
				}	
			},
			slide			: function( dir, $slices, $navNext, $navPrev, settings ) {
				// control if we can navigate.
				// control the navigation buttons visibility.
				// the navigation will behave differently for the cases we have all the slices closed, 
				// and when one is opened. It will also depend on settings.savePositions 
				if( settings.idx_expanded === -1 || !settings.savePositions ) {
					if( dir === 1 && settings.current + settings.visibleSlices >= settings.totalSlices )
						return false;
					else if( dir === -1 && settings.current === 0 )
						return false;
				
					if( dir === -1 && settings.current === 1 )
						$navPrev.fadeOut();
					else
						$navPrev.fadeIn();
					
					if( dir === 1 && settings.current + settings.visibleSlices === settings.totalSlices - 1 )
						$navNext.fadeOut();
					else
						$navNext.fadeIn();
				}
				else {
					if( dir === 1 && settings.idx_expanded === settings.totalSlices - 1 )
						return false;
					else if( dir === -1 && settings.idx_expanded === 0 )
						return false;
						
					if( dir === -1 && settings.idx_expanded === 1 )
						$navPrev.fadeOut();
					else
						$navPrev.fadeIn();
						
					if( dir === 1 && settings.idx_expanded === settings.totalSlices - 2 )
						$navNext.fadeOut();
					else
						$navNext.fadeIn();
				}
				
				
				var $currentSlice	= $slices.eq( settings.idx_expanded ),
					$nextSlice,
					t;
				
				( dir === 1 ) ? $nextSlice = $currentSlice.next() : $nextSlice = $currentSlice.prev();
				
			
					
				// if we slide down, the top and position of each slice will decrease
				if( dir === 1 ) {
					settings.current++;
					t = '-=' + settings.sliceH;
					pos_increment	= -1;
				}
				else {
					settings.current--;
					t = '+=' + settings.sliceH;
					pos_increment	= 1;
				}
				
				$slices.each(function(i) {
					var $slice		= $(this),
						pos			= $slice.data('position');
					
					// all closed or savePositions is false
					if( !settings.savePositions || settings.idx_expanded === -1 )
						$slice.stop().animate({top : t}, settings.animSpeed, settings.animEasing);
					else {
						var itemHeight, othersHeight;
					}
				});
			},
			canSlideUp		: function( $slices, settings ) {
				var $first			= $slices.eq( settings.current );
					
				if( $first.index() !== 0 )
					return true;
			},
			canSlideDown	: function( $slices, settings ) {
				var $last			= $slices.eq( settings.current + settings.visibleSlices - 1 );
					
				if( $last.index() !== settings.totalSlices - 1 )
					return true;
			}
		},
		methods = {
			init 		: function( options ) {
				
				if( this.length ) {
					
					var settings = {
						// the accordion's width
						accordionW		: 170,
						// the accordion's height
						accordionH		: 200,
						// number of visible slices
						visibleSlices	: 5,
						// the height of a opened slice
						// should not be more than accordionH
						expandedHeight	: 150,
						// speed when opening / closing a slice
						animSpeed		: 250,
						// easing when opening / closing a slice
						animEasing		: 'jswing',
						// opacity value for the collapsed slices
						animOpacity		: 0.2,
						// time to fade in the slice's content
						contentAnimSpeed: 900,
						// if this is set to false, then before
						// sliding we collapse any opened slice
						savePositions	: true,

						idx_expanded	: -1,
						sliceH			: 0,  // the default slice's height	
						current			: 0,  // controls the current slider position						
						totalSlices     : 0
					};
					
					return this.each(function() {
						
						// if options exist, lets merge them with our default settings
						if ( options ) {
							$.extend( settings, options );
						}
						
						var $el 			= $(this),
							// the accordion's slices
								$slices			= $el.find('.sub-menu li'),
							// the navigation buttons
							$navNext		= $el.find('.js-more-arrow'),
							$navPrev		= $el.find('.js-less-arrow');
						
						var k=0;
						$(this).find('li').each(function(i,val){
							if(!($(val).css('display')==='none')){
								k++;
							}
						})	

						if(k<settings.visibleSlices && settings.accordionH==="auto" ){
							settings.accordionH = k*40+k*10;
						}
						else if(settings.accordionH==="auto"){
							settings.accordionH=250;
						}
						//console.log("k"+k);
						// each slice's height
						settings.sliceH		= Math.ceil( settings.accordionH / settings.visibleSlices );
						
						
						// total slices  $slices.length;
						settings.totalSlices	= k;
						if(settings.totalSlices<=settings.visibleSlices){
							$navNext.hide();
							$navPrev.hide();
						}

						
						// control some user config parameters
						if( settings.expandedHeight > settings.accordionH )
							settings.expandedHeight = settings.accordionH;
						else if( settings.expandedHeight <= settings.sliceH )
							settings.expandedHeight = settings.sliceH + 50; // give it a minimum
							
						// set the accordion's width & height
						$el.css({
							width	: settings.accordionW + 'px',
							height	: settings.accordionH + 'px'
						});
						
						// show / hide $navNext 
						if( settings.visibleSlices < settings.totalSlices  )
							$navNext.show();
						
						// set the top & height for each slice.
						// also save the position of each one.
						// as we navigate, the first one in the accordion
						// will have position 1 and the last settings.visibleSlices.
						// finally set line-height of the title (<h3>)
						var j=0;
						$slices.each(function(i){
							var $slice	= $(this);
							if(!($slice.css('display')==='none')){
								$slice.css({
									top		: j * settings.sliceH + 'px',
									height	: settings.sliceH + 'px'
								}).data( 'position', (j + 1) );
								j++;
							}

							
						})
			
						.css( 'line-height', settings.sliceH + 'px' );
						
						// click event
						$slices.bind('click.vaccordion', function(e) {
							// only if we have more than 1 visible slice. 
							// otherwise we will just be able to slide.
							if( settings.visibleSlices > 1 ) {
								var $el			= $(this);
								aux.selectSlice( $el, $slices, $navNext, $navPrev, settings );
							}
						});
						
						// navigation events
						$navNext.off().on('click.vaccordion', function(e){
							aux.navigate( 1, $slices, $navNext, $navPrev, settings );
						});
						
						$navPrev.off().on('click.vaccordion', function(e){
							aux.navigate( -1, $slices, $navNext, $navPrev, settings );
						});


					
					});
				}
			}
		};
	
	$.fn.vaccordion = function(method) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + '' );
		}
	};
	
})(jQuery);
				