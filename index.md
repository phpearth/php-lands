<h1 id="h1">{{ site.title }}</h1>

<p class="pe-center">{{ site.description }} <a class="ui tag red label" href="https://github.com/php-earth/php-lands">{% if site.github.latest_release %}{{ site.github.latest_release }}{% else %}Pre-release{% endif %}</a></p>

<div class="ui inverted segment pe-map-segment">
  <div id="pe-dimmer" class="ui enabled inverted dimmer">
    <div id="pe-loader" class="ui text loader">Loading</div>
  </div>

  <div class="pe-container">
    <div id="phplandsmap" data-map-src="{% if jekyll.environment != 'development' %}{{ site.app.map_url }}{% endif %}"><div id="tooltip"></div><div id="coordinates"></div></div>
  </div>
</div>

<p>The exploration of the PHP lands has just started. There are still many unknown
lands and places to discover. Captains, cartographers, and explorers can help
make it more accurate.</p>

<div class="ui black icon message">
  <i class="file image outline icon"></i>
  <div class="content">
    <div class="header">Download map</div>
    <div class="content">
      Map is available for download in the following formats:<br><br>
      <a class="ui primary compact button" href="https://github.com/php-earth/php-lands/releases"><i class="download icon"></i>PNG</a>
    </div>
  </div>
</div>

<div class="ui inverted large list">
  <div class="item">
    <i class="compass icon"></i>
    <div class="content">
      <div class="header">Cartographers</div>
      <div class="description">PHP.earth</div>
    </div>
  </div>
  <div class="item">
    <i class="binoculars icon"></i>
    <div class="content">
      <div class="header">Explorers</div>
      <div class="description">
        {% for user in site.github.contributors %}
          <a href="{{ user.html_url }}">{{ user.login }}</a>
        {% endfor %}
      </div>
    </div>
  </div>
  <div class="item">
    <i class="map marker alternate icon"></i>
    <div class="content">
      <div class="header">Starring</div>
      <div class="description">PHP community</div>
    </div>
  </div>
  <div class="item">
    <i class="tag icon"></i>
    <div class="content">
      <div class="header">Map edition</div>
      <div class="description">{% if site.github.latest_release %}{{ site.github.latest_release }}{% else %}Pre-release{% endif %}</div>
    </div>
  </div>
  <div class="item">
    <i class="github icon"></i>
    <div class="content">
      <div class="header">Blueprints</div>
      <div class="description"><a href="https://github.com/php-earth/php-lands">GitHub</a></div>
    </div>
  </div>
  <div class="item">
    <i class="lightbulb outline icon"></i>
    <div class="content">
      <div class="header">Inspiration</div>
      <div class="description"><a href="http://fearlesscoder.blogspot.si/2017/02/the-c17-lands.html" target="_blank">The C++17 Lands</a></div>
    </div>
  </div>
  <div class="item">
    <i class="creative commons icon"></i>
    <div class="content">
      <div class="header">License</div>
      <div class="description">Creative Commons Attribution Share Alike 4.0</div>
    </div>
  </div>
</div>

<div class="ui horizontal inverted divider header"><i class="share square outline icon"></i></div>

<div class="pe-sidebar-buttons">
  <a class="ui compact mini basic inverted button" href="https://github.com/php-earth/php-lands" target="_blank" data-tooltip="Star on GitHub" data-inverted="1">
    <i class="github large icon"></i>
    Star
  </a>

  <a class="ui compact mini basic inverted button" target="_blank" href="https://lands.php.earth/" id="fbShareBtn" data-tooltip="Share the map on Facebook" data-inverted="">
    <i class="facebook large icon"></i>
    Share
  </a>

  <a class="ui compact mini basic inverted button" target="_blank" href="https://twitter.com/intent/tweet?text=The+PHP+Lands+Map&url=https%3A%2F%2Flands.php.earth&hashtags=PHP" data-tooltip="Tweet the map" data-inverted="">
    <i class="twitter large icon"></i>
    Tweet
  </a>

  <a class="ui compact mini basic inverted button" href="https://github.com/php-earth/php-lands/issues/new" target="_blank" data-tooltip="Discovered a new location for the map?" data-inverted="">
    <i class="anchor large icon"></i>
    New location
  </a>
</div>

<p>No developers were harmed during the making of this map.</p>

<p>Arr!</p>
