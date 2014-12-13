var minimalAjax = function(url, callback){
        
    var xmlHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MicrosoftXMLHTTP");
    xmlHTTP.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200)
            callback(this.responseText);
    }
    xmlHTTP.open("GET", url, true);
    xmlHTTP.send();
}
 
minimalAjax('/api', function(dataStr) {
    var data = JSON.parse(dataStr);
    var content = swig.run(mainTemplate, data);

    document.querySelector('#main_content').innerHTML = content;
});
