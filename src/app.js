(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=792244744137176";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function getUserData(){
        FB.api('/me', function(response) {
                console.log(response);

                $.get("http://127.0.0.1:5000/reincarnation", data={"mydate":response["birthday"]}, function(j){
                        var myjson=JSON.parse(j);
                        var chain=myjson['chain'];
                        var p="<ul>";
			var geoArray=[];
                        for (var c=0; c<chain.length; c++){
                                p+="<li><b>" + chain[c]["name"] + "</b> (<b>" + chain[c]["date"] + "</b> to <b>" + chain[c]["ddate"] + "</b>), born in <b>" + chain[c]["bplace"] + "</b> is <b>" + chain[c]["description"] + "</b>. Lived mostly in <b>" + chain[c]["century"] + "</b> century. Died at the age of <b>" + chain[c]["age"] + "</b>. For more info click <a href=" + chain[c]["wiki"] + ">here</a>.</li>";
				geoArray.push('{"lat":' + chain[c]["lat"] + ',"long":' + chain[c]["long"] + '}');
			}
			retJson='{"venues":[' + geoArray + ']}';
                        elem=document.getElementById("pes");
                        elem.innerHTML=p + "</ul>";
		        document.getElementById('visual').style.visibility = 'visible';
		        document.getElementById('maplink').style.visibility = 'visible';

			$("#visual").click(function(){
				self.location='barchart.html';
			});
			$("#maplink").click(function(){
				self.location='map.html?request=' + retJson;
			});

                });
        });
}
