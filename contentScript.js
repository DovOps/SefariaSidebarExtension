
function getLinks(txt){
  console.log("https://www.sefaria.org.il/api/links/"+txt);

    $.get("https://www.sefaria.org.il/api/links/"+txt).done(function(data){
       data=data.filter(function(x){
           return x.type=="ein mishpat / ner mitsvah";
        });
  
    var html="<div id='sef-sidebar-ext-btn2'></div><div id='sef-sidebar-ext' ><div class='logowrap'><div id='sef-sidebar-ext-btn'></div></div><ul>";
    html+="<li style='color:red;font-weight:bold'><a target='_sefaria' href='http://www.sefaria.org.il/"+txt+"?lang=he&with=all&lang2=he'>"+txt+"</a></li>";

  $.each(data,function(i,item){
    console.log(item.ref);
    console.log(item.sourceHeRef);
    console.log("http://www.sefaria.org.il/"+item.sourceHeRef)
    html+="<li><a target='_sefaria' href='http://www.sefaria.org.il/"+item.sourceHeRef+"?lang=he&with=all&lang2=he'>"+item.sourceHeRef+"</a></li>";
  });
  html+="</ul></div>";
  $("body").append(html);
  $(document).ready(function() {
    $('#sef-sidebar-ext-btn,#sef-sidebar-ext-btn2').on('click', function() {
      $('#sef-sidebar-ext').toggleClass('visible');
    });
  });

});
}


// If we are opening up a Daf- we maximize and scroll it by default
if(location.href.indexOf("daf-yomi.com/DafYomi_Page.aspx")>-1){
    console.log("Portal Daf Yomi");
    var daf=$("#ContentPlaceHolderMain_hdrMassechet").text();
    getLinks(daf);
}

// If we are opening up a Dafhachaim we add links 
if(location.href.indexOf("dafhachaim.org/daf")>-1){
  console.log("DafHachaim");
   var daf=$(".theMasechta").text() + " "+$(".theDaf").text().split(" ")[1];
   console.log("Daf Hachaim "+daf);
   getLinks(daf);
}

if(location.href.indexOf("dafhachaim.org/resources")>-1){
  console.log("DafHachaim");
 var txt= $(".here-i-am").text();
 console.log("Daf Hachaim "+txt);
 
   getLinks(txt);
  
}

// If we are on the homepage, we inject a button to launch the 4 amudim
if(location.href.indexOf("dafYomi.aspx")>-1){
    var link=$('#oPageLinksBox > a').last() ;
    var url=$(link).href;
    $(link).append("<br><button class='clsButton' href='#'  id='OpenDapim' >עמוד+4</button> ");
 } 