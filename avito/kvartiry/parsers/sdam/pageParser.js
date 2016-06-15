'use strict';

var cheerio = require('cheerio');

var pageParser = function(body){

    var parsedPage = {},
        $ = cheerio.load(body),
        location = {},
        lat;

    lat = $('.g_123 .l-content .description-expanded .b-search-map');
    location.lat = $(lat).attr('data-map-lat');
    location.lon = $(lat).attr('data-map-lon');
    parsedPage.location = location;
    return parsedPage;
};

module.exports = pageParser;