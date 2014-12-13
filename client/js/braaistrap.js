var mainTpl = document.querySelector('#main_tpl').text;
var mainView = swig.compile(mainTpl);

var minimalAjax = function(url, callback){
        
    var xmlHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MicrosoftXMLHTTP");
    xmlHTTP.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200)
            callback(this.responseText);
    }
    xmlHTTP.open("GET", url, true);
    xmlHTTP.send();
 
}
 
var data = null;

minimalAjax('/api', function(dataStr) {


data = JSON.parse(dataStr);
console.log(data);

    document.querySelector('#main_content').innerHTML = mainView(data);
});
