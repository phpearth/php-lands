/**
 * PHP Lands map navigation.
 */

function App (locations) {
    var self = this;
    this.locations = locations;

    this.init = function() {
        OpenSeadragon.setString("Tooltips.FullPage","Full screen");

        this.viewer = OpenSeadragon({
            id: "phplandsmap",
            prefixUrl: "/assets/img/openseadragon/",
            tileSources: document.getElementById('phplandsmap').getAttribute('data-map-src')+'/map.dzi',
            visibilityRatio: 1,
            constrainDuringPan: true,
            defaultZoomLevel: 0,
            minZoomLevel: 0,
            maxZoomLevel: 20,
            maxZoomPixelRatio: 4,
            showNavigator: true,
            navigatorPosition: "BOTTOM_LEFT",
            overlays: [{
                id: 'tooltip',
                x: 0,
                y: 0,
                checkResize: false
            },{
                id: 'coordinates',
                x: 0,
                y: 0,
                checkResize: false
            }]
        });

        this.svgOverlay = this.viewer.svgOverlay();

        this.viewer.addHandler('open', function(event) {
            // Disable Semantic UI loader
            document.getElementById('pe-loader').classList.add('disabled');
            document.getElementById('pe-dimmer').className = "ui disabled inverted dimmer";

            // Add grab cursor style
            document.getElementById('phplandsmap').classList.add('pe-grab');

            self.initPins();
        });

        this.viewer.addHandler('canvas-press', function(event) {
            document.getElementById('phplandsmap').classList.add('pe-grabbing');
        });

        this.viewer.addHandler('canvas-release', function(event) {
            document.getElementById('phplandsmap').classList.remove('pe-grabbing');
        });

        this.viewer.addHandler('full-screen', function(event) {
            if (document.getElementById('video')) {
                document.getElementById('video').play();
            }
        });

        // Toggle locations button
        let toggleOverlayButton = new OpenSeadragon.Button({
            tooltip: 'Toggle locations',
            srcRest: '/assets/img/togglePinButtonRest.png',
            srcGroup: '/assets/img/togglePinButtonGroupHover.png',
            srcHover: '/assets/img/togglePinButtonHover.png',
            srcDown: '/assets/img/togglePinButtonPressed.png',
        });

        this.viewer.buttons.buttons.push(toggleOverlayButton);
        this.viewer.buttons.element.appendChild(toggleOverlayButton.element);

        toggleOverlayButton.addHandler("click", function (data) {
            self.togglePins();
        });

        // Toggle coordinates button
        let toggleCoordinatesButton = new OpenSeadragon.Button({
            tooltip: 'Toggle coordinates',
            srcRest: '/assets/img/toggleCoordinatesButtonRest.png',
            srcGroup: '/assets/img/toggleCoordinatesButtonGroupHover.png',
            srcHover: '/assets/img/toggleCoordinatesButtonHover.png',
            srcDown: '/assets/img/toggleCoordinatesButtonPressed.png',
        });

        this.viewer.buttons.buttons.push(toggleCoordinatesButton);
        this.viewer.buttons.element.appendChild(toggleCoordinatesButton.element);

        toggleCoordinatesButton.addHandler("click", function (event) {
            self.toggleCoordinates();
        });

        var moveTracker = new OpenSeadragon.MouseTracker({
            element: this.viewer.container,
            moveHandler: function(event) {
                var viewportPoint = self.viewer.viewport.pointFromPixel(event.position);
                var imagePoint = self.viewer.viewport.viewportToImageCoordinates(viewportPoint);
                document.getElementById('coordinates').innerHTML = '<br>('+Math.round(imagePoint.x)+' , '+Math.round(imagePoint.y)+')';
                self.viewer.updateOverlay('coordinates', new OpenSeadragon.Point(Number(viewportPoint.x), Number(viewportPoint.y)));
            }
         });
    };

    this.initPins = function() {
        this.pins = [];
        var pinWidth = 0.0229;
        var pinHeight = 0.0229;

        for (var i=0; i < this.locations.length; i++) {
            var x = (Number(this.locations[i].x)/13120)-2*pinWidth/3;
            var y = (Number(this.locations[i].y)/13120)-4*pinHeight/5;

            var link = (this.locations[i].link) ? '<div><a href="'+this.locations[i].link+'" target="_blank" title="Find out more..." id="tooltiplink"><i class="icon linkify"></i></a></div>' : '';
            var content = '<div class="header"><i class="map marker alternate icon"></i> ' + this.locations[i].title + '</div><div class="content">' + this.locations[i].desc + link + '</div>';

            this.pins[i] = d3.select(this.svgOverlay.node()).append("svg:image")
                .attr("xlink:href","/assets/img/pin.png")
                .attr("width", 0.020)
                .attr("height", 0.020)
                .attr("x", x)
                .attr("y", y)
                .attr('id', 'pin_'+i)
                .attr('data-content', content)
                .on('mouseover', function(){
                    d3.select(this).transition()
                        .attr("width", 0.020)
                        .attr("height", 0.020)
                        .duration(200)
                        .attr("x", this.getAttribute('x'))
                        .attr("y", this.getAttribute('y'))
                        .attr("xlink:href","/assets/img/pin_2.png");

                    var elt = document.getElementById('tooltip');
                    elt.innerHTML = this.getAttribute('data-content');
                    elt.style.zIndex = 10000;
                    elt.style.visibility = 'visible';

                    elt.onmouseover = function(){
                        $('#tooltip').stop().fadeIn(0);
                    }
                    elt.onmouseenter = function(){
                        $('#tooltip').stop().fadeIn(0);
                    }
                    elt.onmouseleave = function(){
                        $('#tooltip').fadeOut(1200);
                    }

                    var tooltip_x = this.getAttribute('x');
                    var tooltip_y = this.getAttribute('y');
                    self.viewer.updateOverlay('tooltip', new OpenSeadragon.Point(Number(tooltip_x), Number(tooltip_y)+pinHeight));
                    $('#tooltip').stop().fadeIn(100);

                    var tracker = new OpenSeadragon.MouseTracker({
                        element: document.getElementById('tooltiplink'),
                        clickHandler: function(event) {
                            var target = event.originalEvent.target.parentNode;
                            if (target.matches('a')) {
                                if (target.getAttribute('target') === '_blank') {
                                    window.open(target.getAttribute('href'));
                                } else {
                                    location.href = target.getAttribute('href');
                                }
                            }
                        }
                     });
                })
                .on('mouseout', function(){
                    d3.select(this).transition()
                        .attr("width", 0.02)
                        .attr("height", 0.02)
                        .attr("x", this.getAttribute('x'))
                        .attr("y", this.getAttribute('y'))
                        .attr("xlink:href","/assets/img/pin.png");

                    $('#tooltip').fadeOut(1200);
                });
        }

        $(window).resize(function() {
            self.svgOverlay.resize();
        });
    };

    this.togglePins = function() {
        this.svgOverlay.node().style.display === 'none' ? this.svgOverlay.node().style.display = 'block' : this.svgOverlay.node().style.display = 'none';
    }

    this.toggleCoordinates = function() {
        var el = document.getElementById('coordinates');
        el.style.visibility != 'visible' ? el.style.visibility = 'visible' : el.style.visibility = 'hidden';
    }
}

$(document).ready(function () {
    $.getJSON("/locations.json", function(data) {
        var app = new App(data.data);
        app.init();
    });
});
