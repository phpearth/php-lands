<p class="pe-center">{{ site.description }}</p>

<div class="ui inverted segment pe-map-segment">
  <div id="pe-dimmer" class="ui enabled inverted dimmer">
    <div id="pe-loader" class="ui text loader">Loading</div>
  </div>

  <div class="pe-container">
    <div id="phplandsmap" data-map-src="{% if jekyll.environment != 'development' %}{{ site.app.map_url }}{% endif %}"><div id="tooltip"></div><div id="coordinates"></div></div>
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
    <i class="github icon"></i>
    <div class="content">
      <div class="header">Blueprints</div>
      <div class="description"><a href="https://github.com/phpearth/php-lands">GitHub</a></div>
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
  <a class="ui compact mini basic inverted button" href="https://github.com/phpearth/php-lands" target="_blank" data-tooltip="Star on GitHub" data-inverted="1">
    <i class="github large icon"></i>
    Star
  </a>

  <a class="ui compact mini basic inverted button" href="https://github.com/phpearth/php-lands/issues/new" target="_blank" data-tooltip="Discovered a new location for the map?" data-inverted="">
    <i class="anchor large icon"></i>
    New location
  </a>
</div>
