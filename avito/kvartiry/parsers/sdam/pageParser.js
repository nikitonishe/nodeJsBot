'use strict';

var cheerio = require('cheerio');

var pageParser = function(body){
    var parsedPage = {},
        $ = cheerio.load(body),
        location = {},
        photoLink,
        lat;

    lat = $('.g_123 .l-content .description-expanded .b-search-map');
    location.lat = $(lat).attr('data-map-lat');
    location.lon = $(lat).attr('data-map-lon');
    parsedPage.location = location;

    photoLink = $('.g_123 .l-content .clearfix .g_92 .b-item-photo .big-picture img');
    photoLink = $(photoLink).attr('src');

    parsedPage.photoLink = photoLink;
    return parsedPage;
};

module.exports = pageParser;