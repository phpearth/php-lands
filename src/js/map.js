/**
 * PHP Lands map navigation.
 */

function App (locations) {
    var self = this;
    this.locations = locations;

    this.init = function() {
        this.viewer = OpenSeadragon({
            id: "phplandsmap",
            prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/",
            tileSources: document.getElementById('phplandsmap').getAttribute('data-map-src')+'/map.dzi',
            visibilityRatio: 1,
            constrainDuringPan: true,
            minZoomLevel: 0,
            maxZoomLevel: 30,
            maxZoomPixelRatio: 4,
            showNavigator: true,
            smoothTileEdgesMinZoom: 1,
            controlsFadeDelay: 200,
            controlsFadeLength: 500,
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
                checkResize: true
            }]
        });

        this.svgOverlay = this.viewer.svgOverlay();

        this.viewer.addHandler('open', function(event) {
            // Disable Semantic UI loader.
            document.getElementById('pe-loader').classList.add('disabled');
            document.getElementById('pe-dimmer').className = "ui disabled inverted dimmer";

            // Add grab cursor style.
            document.getElementById('phplandsmap').classList.add('pe-grab');

            self.initPins();
            self.togglePins();
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

        // Toggle locations button.
        let toggleOverlayButton = new OpenSeadragon.Button({
            tooltip: 'Toggle locations',
            srcRest: '/assets/img/togglePinButtonRest.png',
            srcGroup: '/assets/img/togglePinButtonGroupHover.png',
            srcHover: '/assets/img/togglePinButtonHover.png',
            srcDown: '/assets/img/togglePinButtonPressed.png',
        });

        this.viewer.buttonGroup.buttons.push(toggleOverlayButton);
        this.viewer.buttonGroup.element.appendChild(toggleOverlayButton.element);

        toggleOverlayButton.addHandler("click", function (data) {
            self.togglePins();
        });

        // Enable the OpenSeadragon bookmark URL plugin.
        this.viewer.bookmarkUrl();

        // Enable coordinates during development.
        //self.enableCoordinates();
    };

    this.initPins = function() {
        this.pins = []
        var pinWidth = 0.0179;
        var pinHeight = 0.021;
        var imageWidth = 26240;

        for (var i=0; i < this.locations.length; i++) {
            var x = Number((Number(this.locations[i].x))/imageWidth)-2*pinWidth/3;
            var y = Number((Number(this.locations[i].y))/imageWidth)-4*pinHeight/5;

            var link = (this.locations[i].link !== '') ? '<div><a href="' + this.locations[i].link + '" target="_blank" title="Find out more..." id="tooltiplink"><i class="icon linkify"></i></a></div>' : '';
            var content = '<div class="header"><i class="map marker alternate icon"></i> ' + this.locations[i].title + '</div><div class="content">' + this.locations[i].desc + link + '</div>';

            this.pins[i] = d3.select(this.svgOverlay.node()).append("svg:image")
                .attr("xlink:href","/assets/img/pin.png")
                .attr("width", 85)
                .attr("height", 85)
                .attr('id', 'pin_'+i)
                .attr('data-content', content)
                .attr('data-x', x)
                .attr('data-y', y)
                .attr("transform", "translate(" + x + " " + y + ") scale(0.0002)")
                .on('mouseover', function(){
                    d3.select(this).transition()
                        .duration(200)
                        .style("opacity", 0.5)
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
                        $('#tooltip').fadeOut(1000, function() {
                            this.style.visibility = 'hidden';
                        });
                    }

                    var tooltip_x = Number(this.getAttribute('data-x')) + 2*pinWidth/3;
                    var tooltip_y = Number(this.getAttribute('data-y')) + 2*pinHeight/3;
                    self.viewer.updateOverlay('tooltip', new OpenSeadragon.Point(tooltip_x, tooltip_y));

                    $('#tooltip').stop().fadeIn(100);

                    // This enables links in the tooltip.
                    if (document.getElementById('tooltiplink')) {
                        var tracker = new OpenSeadragon.MouseTracker({
                            element: 'tooltiplink',
                            clickHandler: function(event) {
                                event.preventDefaultAction = true;
                                var target = event.originalEvent.target;
                                if (target.matches('a')) {
                                    if (target.getAttribute('target') === '_blank') {
                                        window.open(target.getAttribute('href'));
                                    } else {
                                        location.href = target.getAttribute('href');
                                    }
                                }
                            }
                         });
                    }
                })

                .on('mouseout', function(){
                    d3.select(this).transition()
                        .style("opacity", 1)
                        .duration(100)
                        .attr("xlink:href","/assets/img/pin.png");

                    $('#tooltip').fadeOut(1000, function() {
                        this.style.visibility = 'hidden';
                    });
                })
                ;
        }

        window.addEventListener('resize', function(event) {
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

    this.enableCoordinates = function() {
         // Toggle coordinates button.
         let toggleCoordinatesButton = new OpenSeadragon.Button({
            tooltip: 'Toggle coordinates',
            srcRest: '/assets/img/toggleCoordinatesButtonRest.png',
            srcGroup: '/assets/img/toggleCoordinatesButtonGroupHover.png',
            srcHover: '/assets/img/toggleCoordinatesButtonHover.png',
            srcDown: '/assets/img/toggleCoordinatesButtonPressed.png',
        });

        self.viewer.buttonGroup.buttons.push(toggleCoordinatesButton);
        self.viewer.buttonGroup.element.appendChild(toggleCoordinatesButton.element);

        toggleCoordinatesButton.addHandler("click", function (event) {
            self.toggleCoordinates();
        });

        var moveTracker = new OpenSeadragon.MouseTracker({
            element: self.viewer.container,
            moveHandler: function(event) {
                var viewportPoint = self.viewer.viewport.pointFromPixel(event.position);
                var imagePoint = self.viewer.viewport.viewportToImageCoordinates(viewportPoint);
                document.getElementById('coordinates').innerHTML = '<br>('+Math.round(imagePoint.x)+' , '+Math.round(imagePoint.y)+')';
                self.viewer.updateOverlay('coordinates', new OpenSeadragon.Point(Number(viewportPoint.x), Number(viewportPoint.y)));
            }
         });
    }
}

var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', '/locations.json', true);

httpRequest.onload = function() {
    if (httpRequest.status >= 200 && httpRequest.status < 400) {
        var data = JSON.parse(httpRequest.responseText);
        var app = new App(data.data);
        app.init();
    }
};

httpRequest.send();
