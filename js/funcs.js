var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    
    xhr.send();
  });
};

getJSON(urlWeather).then(function(data) {
  document.write("<h1>"+data['squadName']+"</h1>");
  var heroes = data['members'];
 for(let i=0; i< heroes.length;i++)   {
    var superPowers = heroes[i].powers;
    
   
    document.write("<h2>"+heroes[i].name+"</h2>");
    document.write("<p>Identidad secreta:"+heroes[i].secretIdentity+"</p>");
    document.write("<p>Edad:"+heroes[i].age+"</p>");
    document.write("<p>Poderes:</p>");
   for (var j = 0; j < superPowers.length; j++) {
       document.write("<ul>")
       document.write("<li>"+superPowers[j]+"</li>");
       document.write("</ul>")
    }
   
   
 }
}, function(status) {
  alert('Algo fue mal.');
});

