// OpenSeadragon Bookmark URL plugin 0.0.4

(function() {

    var $ = window.OpenSeadragon;

    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }

    // ----------
    $.Viewer.prototype.bookmarkUrl = function(options) {
        options = options || {};
        var trackPage = options.trackPage || false;

        var self = this;

        var updateTimeout;

        var parseHash = function() {
            var params = {};
            var hash = window.location.hash.replace(/^#/, '');
            if (hash) {
                var parts = hash.split('&');
                parts.forEach(function(part) {
                    var subparts = part.split('=');
                    var key = subparts[0];
                    var value = parseFloat(subparts[1]);
                    if (!key || isNaN(value)) {
                        console.error('bad hash param', part);
                    } else {
                        params[key] = value;
                    }
                });
            }

            return params;
        };

        var updateUrl = function() {
            // We only update once it's settled, so we're not constantly flashing the URL.
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function() {
                var zoom = self.viewport.getZoom();
                var pan = self.viewport.getCenter();
                var page = self.currentPage();
                var oldUrl = location.pathname + location.hash;
                var url = location.pathname + '#zoom=' + zoom + '&x=' + pan.x + '&y=' + pan.y;
                if (trackPage) {
                    url = url + '&page=' + page;
                }
                history.replaceState({}, '', url);

                if (url !== oldUrl) {
                    self.raiseEvent('bookmark-url-change', { url: location.href });
                }
            }, 100);
        };

        var useParams = function(params) {
            var zoom = self.viewport.getZoom();
            var pan = self.viewport.getCenter();
            var page = self.currentPage();

            if (trackPage && params.page !== undefined && params.page !== page) {
                self.goToPage(params.page);
                self.addOnceHandler('open', function() {
                    if (params.zoom !== undefined) {
                        self.viewport.zoomTo(params.zoom, null, true);
                    }
                    if (params.x !== undefined && params.y !== undefined && (params.x !== pan.x || params.y !== pan.y)) {
                        self.viewport.panTo(new $.Point(params.x, params.y), true);
                    }
                });
            } else {
                if (params.zoom !== undefined && params.zoom !== zoom) {
                    self.viewport.zoomTo(params.zoom, null, true);
                }
                if (params.x !== undefined && params.y !== undefined && (params.x !== pan.x || params.y !== pan.y)) {
                    self.viewport.panTo(new $.Point(params.x, params.y), true);
                }
            }
        };

        var params = parseHash();

        if (this.world.getItemCount() === 0) {
            this.addOnceHandler('open', function() {
                useParams(params);
            });
        } else {
            useParams(params);
        }

        this.addHandler('zoom', updateUrl);
        this.addHandler('pan', updateUrl);
        if (trackPage) {
            this.addHandler('page', updateUrl);
        }

        // Note that out own replaceState calls don't trigger hashchange events, so this is only if
        // the user has modified the URL (by pasting one in, for instance).
        window.addEventListener('hashchange', function() {
            useParams(parseHash());
        }, false);
    };

})();
