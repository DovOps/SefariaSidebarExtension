
function search_topics(e){
  var val=$(e.srcElement).val();
  console.log("Pre-Scrubbed:" +val);
  val=val.replace(/[^א-תa-zA-Z0-9\s\w\.\']+/g, ' ');
  console.log("Post-Scrubbed: "+val);
  if(val.length <=3 ){
          $("#sef-results").empty();
  } else  {
       
        $.get("//www.sefaria.org.il/api/name/" + val)
          .done(function (data) {
           if(data.completion_objects){
           var result=data.completion_objects.filter(function(val){ return val.type=='ref'});
             var html="<li><A id='sef-feeling-lucky' style='color:red;' class='_sefaria_link' data-link=\"//sefaria.org.il/"+val+"\">"+val+"</a></li>";
           result.forEach(function(x){ 
             html+="<li><A class='_sefaria_link' data-link=\"//sefaria.org.il/"+x.key+"\">"+x.title+"</a></li>";});
             console.log(html);
           }
          $("#sef-results").html(html);
           });
      }

}
function sefariaFeelingLucky(){
  $("#sef-feeling-lucky").click();
  setTimeout(clearSefariaSearch,1500);
}
function clearSefariaSearch(){
  $("#sef-search-box").val("");
  $("#sef-results").empty();
}

function load_sefaria(e){
    $(".loading-mask").show();
    $("#sef-sidebar-ext-iframe").hide();
    $('#sef-sidebar-ext-iframe').attr('src', $(e.target).data('link'));
    $('#sef-sidebar-ext-modal-viewer').toggleClass('visible', true);
    $("#sef-sidebar-ext ol li").toggleClass('active', false);
    $(e.target).parent().toggleClass('active', true);
}

function getLinks(txt) {
  $("#sefaria-extension-output").remove();
  console.log("//www.sefaria.org.il/api/links/" + txt);
  $.get("//www.sefaria.org.il/api/links/" + txt).done(function (data) {
    data = data.filter(function (x) {
      return x.type == "ein mishpat / ner mitsvah";
    });
    var html = "<span id='sefaria-extension-output'><div id='sef-sidebar-ext-btn2'></div><div id='sef-sidebar-ext' ><div class='logowrap'><div id='sef-sidebar-ext-btn'></div></div>";
    html+="<div id='sef-search'><input type='text' id='sef-search-box' style='width:100%' placeholder='Search Sefaria'/><ol id='sef-results'></ol></div>";
    html += "<ol><li style='color:red;font-weight:bold'><a class='_sefaria-link' data-link='//www.sefaria.org.il/" + txt + "?lang=he&with=all&lang2=he'>" + txt + "</a></li>";

    $.each(data, function (i, item) {
      console.log(item.ref);
      console.log(item.sourceHeRef);
      console.log("//www.sefaria.org.il/" + item.sourceHeRef)
      html += "<li><a class='_sefaria-link' data-link='//www.sefaria.org.il/" + item.sourceHeRef + "?lang=he&lang2=he'>" + item.sourceHeRef + "</a></li>";
    });
    html += "</ol></div>";
    html += "<div id='sef-sidebar-ext-modal-viewer'><div class='modalbar'><a id='modal-sidebar-new-win'>New Window</a> | <a id='modal-sidebar-toggle'>Close</a></div><iframe id='sef-sidebar-ext-iframe' src='about:blank'></iframe><div class='loading-mask'>Loading Page...</div></div>";
    html += "</span>";
    $("body").append(html);
    $(document).ready(function () {
   
      $("#sef-search-box").on("input", search_topics);
      $("#sef-search-box").on("keyup", function(e){
        if (e.which == 27) clearSefariaSearch();
        if (e.which == 13) sefariaFeelingLucky();
      });

   
      $("#sef-results a").live('click', load_sefaria);
      $("#sef-sidebar-ext-iframe").on("load", function () {
        $(".loading-mask").hide();
        $("#sef-sidebar-ext-iframe").show();
      });
      $('#sef-sidebar-ext-btn2').on('click', function () {
        $('#sef-sidebar-ext').toggleClass('visible', true);
      });
      $('#sef-sidebar-ext-btn').on('click', function () {
        $('#sef-sidebar-ext').toggleClass('visible', false);
        $('#sef-sidebar-ext-modal-viewer').toggleClass('visible', false);
        $(".loading-mask").hide();
      });

      $('#modal-sidebar-toggle,.modalbar').on('click', function () {
        $('#sef-sidebar-ext-modal-viewer').toggleClass('visible', false);
      });
      $('#modal-sidebar-new-win').on('click', function () {
        $('#sef-sidebar-ext-modal-viewer').toggleClass('visible', false);
        window.open($("#sef-sidebar-ext-iframe").attr("src"));
      });
      $('._sefaria-link').on('click', load_sefaria);
    });

  });
}


var ref=getSefariaReference(location.href);
if(ref!=null){
  console.log("Discovered reference: "+ref.site + " on "+ref.reference);
  getLinks(ref.reference);
} else {
  console.log("No referenceable Sefaria Content on this page.");
}