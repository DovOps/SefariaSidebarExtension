
function getLinks(txt){
  console.log("//www.sefaria.org.il/api/links/"+txt);
  $.get("//www.sefaria.org.il/api/links/"+txt).done(function(data){
     data=data.filter(function(x){
         return x.type=="ein mishpat / ner mitsvah";
      });
  var html="<div id='sef-sidebar-ext-btn2'></div><div id='sef-sidebar-ext' ><div class='logowrap'><div id='sef-sidebar-ext-btn'></div></div><ul>";
  html+="<li style='color:red;font-weight:bold'><a class='_sefaria-link' data-link='//www.sefaria.org.il/"+txt+"?lang=he&with=all&lang2=he'>"+txt+"</a></li>";

$.each(data,function(i,item){
  console.log(item.ref);
  console.log(item.sourceHeRef);
  console.log("//www.sefaria.org.il/"+item.sourceHeRef)
  html+="<li><a class='_sefaria-link' data-link='//www.sefaria.org.il/"+item.sourceHeRef+"?lang=he&lang2=he'>"+item.sourceHeRef+"</a></li>";
});
html+="</ul></div>";
html+="<div id='sef-sidebar-ext-modal-viewer'><div class='modalbar'><a id='modal-sidebar-new-win'>New Window</a> | <a id='modal-sidebar-toggle'>Close</a></div><iframe id='sef-sidebar-ext-iframe' src='about:blank'></iframe><div class='loading-mask'>Loading Page...</div></div>";
$("body").append(html);
$(document).ready(function() {
  $("#sef-sidebar-ext-iframe").on("load",function(){
    $(".loading-mask").hide();
    $("#sef-sidebar-ext-iframe").show();
  });
  $('#sef-sidebar-ext-btn2').on('click', function() {
    $('#sef-sidebar-ext').toggleClass('visible',true);
  });
  $('#sef-sidebar-ext-btn').on('click', function() {
    $('#sef-sidebar-ext').toggleClass('visible', false);
    $('#sef-sidebar-ext-modal-viewer').toggleClass('visible',false);
    $(".loading-mask").hide();
  });

  $('#modal-sidebar-toggle,.modalbar').on('click', function() {
    $('#sef-sidebar-ext-modal-viewer').toggleClass('visible',false);
  });
  $('#modal-sidebar-new-win').on('click', function() {
    $('#sef-sidebar-ext-modal-viewer').toggleClass('visible',false);
    window.open($("#sef-sidebar-ext-iframe").attr("src"));
  });
  $('._sefaria-link').on('click',function(e){
    $(".loading-mask").show();
    $("#sef-sidebar-ext-iframe").hide();
    $('#sef-sidebar-ext-iframe').attr('src',$(e.target).data('link'));
    $('#sef-sidebar-ext-modal-viewer').toggleClass('visible',true);
    $("#sef-sidebar-ext ul li").toggleClass('active',false);
    $(e.target).parent().toggleClass('active',true);
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