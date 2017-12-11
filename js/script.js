var map;
var locationList = [{
        title: "Sweet Hut Bakery",
        lat: 33.962311,
        lng: -84.135077,
    },
    {
        title: "The Juicy Crab",
        lat: 33.960371,
        lng: -84.137893,
    },
    {
        title: "IHOP",
        lat: 33.960277,
        lng: -84.134924,
    },
    {
        title: "Poke Bar",
        lat: 33.960327,
        lng: -84.136091,
    },
    {
        title: "Saigon Cafe",
        lat: 33.960043,
        lng: -84.136161,
    },	
];

/*
function getExtract(link, location) {
    var extract;
    $.ajax({
        url: link,
        //dataType: 'json',
        dataType: 'jsonp',
        success: function(data) {
            $.each(data.query.pages, function(i, item) {
                extract = item.extract.substring(0, 250);
                location.infowindow = new google.maps.InfoWindow({
                    content: extract
                });
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("jqXHR: " + jqXHR.statusText);
            console.log("status: " + textStatus);
            console.log("error: " + errorThrown);
            alert("Sorry, there was an error reaching Wikipedia.");
        }
    });
    return extract;
}
*/

var Location = function(data) {
    var self = this;
    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;
    this.visible = ko.observable(true);

    /*
    this.link = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&origin=*&exintro=&explaintext=&titles=";
    this.link = this.link + this.title.split(' ').join('_');

    this.extract = getExtract(this.link, this);
    */
    //this.extract = "test";

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map
    });

    /*
    // listener for info window
    this.marker.addListener('click', function() {
        self.infowindow.open(map, this);
    });
    */

    this.showMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

    this.marker.addListener('click', toggleBounce);

    // marker animation
    function toggleBounce() {
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 1400);
    }
};

function setMarkers(map) {
    for (var i = 0; i < locationList.length; i++) {
        new google.maps.Marker({
            position: new google.maps.LatLng(locationList[i].lat, locationList[i].lng),
            map: map
        });
    }
}


function initMap() {
    var sweetHut = {
        lat: 33.962543,
        lng: -84.135036
    };

    var styles = [{
        featureType: 'water',
        stylers: [{
            color: '#19a0d8'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
                color: '#ffffff'
            },
            {
                weight: 6
            }
        ]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -40
            }
        ]
    }, {
        featureType: 'transit.station',
        stylers: [{
                weight: 9
            },
            {
                hue: '#e85113'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
                visibility: 'on'
            },
            {
                color: '#f0e4d3'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -25
            }
        ]
    }];

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        styles: styles,
        center: sweetHut
    });
}

var ViewModel = function() {
    this.query = ko.observable("");
    this.filteredList = ko.observableArray([]);
    this.selectedOption = ko.observable();

    var locations = [];
    locationList.forEach(function(locationItem) {
        locations.push(new Location(locationItem));
    });

    for (var i = 0; i < locationList.length; i++) {
        this.filteredList.push(locationList[i].title);
    }

    this.search = function() {
        var searchString = this.query().toString();
        this.filteredList.removeAll();
        if (searchString !== "") {
            // use entered query to filter list of locations
            var filter = searchString.toLowerCase();
            for (var i = 0; i < locationList.length; i++) {
                if (locationList[i].title.toLowerCase().indexOf(filter) != -1) {
                    this.filteredList.push(locationList[i].title);
                    locations[i].visible(true);
                } else {
                    locations[i].visible(false);
                }
            }
        } else {
            for (var j = 0; j < locationList.length; j++) {
                this.filteredList.push(locationList[j].title);
                locations[j].visible(true);
            }
        }
    }.bind(this);


    this.bounce = function() {
        // get title of location clicked from list
        // find object with matching title
        if (this.bounce !== "") {
            var clickedLocation = search(this.selectedOption(), locations);
            if (clickedLocation !== null) {
                google.maps.event.trigger(clickedLocation.marker, 'click');
            }
        }
    };
};

function search(titleKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].title == titleKey) {
            return myArray[i];
        }
    }
}

function mapAppInit() {
    initMap();
    var v = new ViewModel();
    ko.applyBindings(v);
}

function googleMapsErrorHandling() {
    alert("Sorry, there was an error reaching Google Maps.");
}
