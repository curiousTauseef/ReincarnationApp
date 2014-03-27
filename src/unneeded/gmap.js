function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getMapCenter(v)
{
        var center=[0,0]
        var n=v.length;
        for (var i=0; i<n; i++)
        {
                center[0]+=v[i]["lat"]/n;
                center[1]+=v[i]["long"]/n;
        }

        return center
}

function initializeMap(venues) {
        var center=getMapCenter(venues);
        var myLatlng = new google.maps.LatLng(center[0],center[1]);
        var mapOptions = {
                zoom: 10,
                center: myLatlng
        }
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        for (var i=0; i<venues.length; i++)
        {
		console.log(venues[i]["lat"]);
		console.log(venues[i]["long"]);
                var point = new google.maps.LatLng(venues[i]["lat"], venues[i]["long"]);
                var marker = new google.maps.Marker({
                        position: point,
                        map: map
                });
        }
}

$(document).ready(function(){
	var j=JSON.parse(getParameterByName("request"));
	initializeMap(j["venues"]);
});
