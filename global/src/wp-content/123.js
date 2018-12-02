    function getHashFromUrl(url){
        var a = document.createElement("a");
        a.href = url;
        return(a.hash.replace(/^#/, ""));
    }; 
   	$('#my-nav .nav li a').each(function(){
   	    var href = $(this).attr('href');
        var anchor = getHashFromUrl(href);	
        $(this).attr('href','#'+anchor);	
    });