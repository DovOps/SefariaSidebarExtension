
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
             var html="<li><A id='sef-feeling-lucky' style='color:red;' class='_sefaria_link' data-link=\"//sefaria.org.il/"+escape(val)+"\">"+val+"</a></li>";
           result.forEach(function(x){ 
             html+="<li><A class='_sefaria_link' data-link=\"//sefaria.org.il/"+escape(x.key)+"\">"+x.title+"</a></li>";});
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

var sefaria_current=null;

function sefariaLinkClicked(e){
  e.stopPropagation();
  var url=$(e.target).data('link');
  load_sefaria(url);
  $("#sef-sidebar-ext ol li").toggleClass('active', false);
  $(e.target).parent().toggleClass('active', true);
}
function load_sefaria(url, force){
    var same=(sefaria_current===url) ;
    if(!same || force){
      sefaria_current=url;
      if(force) url+= ((url.indexOf("?")>-1)?"&":"?")+ "r="+new Date().getTime();
      $(".loading-mask").show();
      $("#sef-sidebar-ext-iframe").hide();
      $('#sef-sidebar-ext-iframe').attr('src', url);
    }
    $('#sef-sidebar-ext-modal-viewer').toggleClass('visible', true);
}

var pages=[];

async function getLinks(txt, mode) {
  $("#sefaria-extension-output").remove();
  console.log("//www.sefaria.org.il/api/links/" + txt);

  // Check if I'm getting both sides or just one side
  if(mode && mode==DOUBLE){
    console.log("Getting both sides of the page");
      if(/.*([א-ת]+)$/.test(txt)){
        pages.push({page:txt + " א",title:"עמוד א",id:"sef-side-a"});
        pages.push({page:txt + " ב",title:"עמוד ב",id:"sef-side-b"});
      } else if (/.*([0-9]+)$/.test(txt)){
        pages.push({page:txt+"a",title:"עמוד א",id:"sef-side-a"});
        pages.push({page:txt+"b",title:"עמוד ב",id:"sef-side-b"});
      }
      console.log("INITIAL LINK TEXT: " +txt)
    } else {
      pages.push({page:txt,id:"sef-side-a"});
    }
    pages.map((frame)=>{
      frame.open=true;
      frame.page=frame.page.trim();
    });
    console.log("PAGES: "+JSON.stringify(pages));
    var categories=[];
    var categoryCounts={};
    // playing with async/await - for some reason this likes not being in a callback
    for(var i=0;i<pages.length;++i){
      pages[i].data=await getData(pages[i].page);;
      pages[i].data.forEach(d=>{if(!categoryCounts[d.category]) categoryCounts[d.category]=1; else categoryCounts[d.category]++;});
    }
    categories=Object.keys(categoryCounts).sort();

    console.log("Frames: "+pages.length);
    var html = "<span id='sefaria-extension-output'><div id='sef-sidebar-ext-btn2'></div><div id='sef-sidebar-ext' ><div class='logowrap'><div id='sef-sidebar-ext-btn'></div></div>";
    html+="<div id='sef-search'><input type='text' id='sef-search-box' style='width:95%' placeholder='Search Sefaria'/><ol id='sef-results'></ol></div>";
    html+="<div id='sef-categories'>";
    categories.forEach(cat=>{
      html+="<a class='sef-cat-hdr ' data-category='"+cat+"' id='sef-cat-"+cat+"'>"+cat+" ("+categoryCounts[cat]+")</a> ";
    });
    html+="</div>";
    $.each(pages, function(i,frame) {
      html += "<ol id='"+frame.id+"'><li style='color:red;font-weight:bold'><span class='sef-folder' id='sef-closed-"+frame.id+"'>📁</span><span  class='sef-folder'  id='sef-opened-"+frame.id+"'>📂</span><a class='_sefaria-link sef-category-main' data-link='//www.sefaria.org.il/" + escape(frame.page) + "?lang=he&with=all&lang2=he'>" + frame.page + "</a></li>";
      var data=frame.data;
    $.each(data, function (i, item) {
      console.log(item.ref);
      console.log(item.sourceHeRef);
      console.log("//www.sefaria.org.il/" + item.sourceHeRef)
      html += "<li class='sef-category-item' data-category='"+item.category+"'><a class='_sefaria-link' data-link='//www.sefaria.org.il/" + escape(item.ref) + "?lang=he&lang2=he'>" + item.sourceHeRef + "</a></li>";
    });
    html+="</ol>";
   });
    html += "</div>";
    html += "<div id='sef-sidebar-ext-modal-viewer'><div class='modalbar'><a id='modal-sidebar-new-win'>New Window</a> | <a id='modal-sidebar-reload'>Reload</a> | <a id='modal-sidebar-toggle'>Close</a></div><iframe id='sef-sidebar-ext-iframe' src='about:blank'></iframe><div class='loading-mask'>Loading Page...</div></div>";
    html += "</span>";
    $("body").append(html);
    $(document).ready(function () {
   
      $("#sef-search-box").on("input", search_topics);
      $("#sef-search-box").on("keyup", function(e){
        if (e.which == 27) clearSefariaSearch();
        if (e.which == 13) sefariaFeelingLucky();
      });

        $(".sef-cat-hdr").click(function(){
          toggleCategory($(this).data("category"));
        });
     

      // hide all but halakha
      $.each(categories,function(i,cat){
        toggleCategory(cat, false);
      });
      toggleCategory("Halakhah",true);

      $.each(pages,function(i,page){
        var id=page.id;
        // initial toggle
        togglePage(id,true);
        // subscribe to header bar
        $("#"+id+" li:nth-of-type(1)").click(function(){
          togglePage(id);
       });
      });
   
     
      $("#sef-results a").live('click', sefariaLinkClicked);
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
      $('#modal-sidebar-reload').on('click', function (e) {
        e.stopPropagation();
        load_sefaria(sefaria_current,true);
      });
      $('._sefaria-link').on('click', sefariaLinkClicked);
    });

 
}

var ref=getSefariaReference(location.href);
if(ref!=null){
  console.log("Discovered reference: "+ref.site + " on "+ref.reference);
  getLinks(ref.reference, ref.mode);
} else {
  console.log("No referenceable Sefaria Content on this page.");
}

var activeCategories=[];
function toggleCategory(cat, state){
  if(state==null){
    if(activeCategories.indexOf(cat)>-1){
      state=false;
    }
    else state=true;
  }

  var idx=activeCategories.indexOf(cat);
  if(state){
    if(idx==-1) activeCategories.push(cat);
  }  else {
    if(idx>-1) delete activeCategories[idx];
  }

  console.log("Toggle Cat" +cat+"/"+state);
  $(".sef-cat-hdr[data-category=\""+cat+"\"]").toggleClass("sef-cat-hdr-active",state);
  $(".sef-category-item[data-category=\""+cat+"\"]").toggleClass("sef-cat-hidden",!state);
}

function togglePage(id, state){
    var myPage=pages.find(x=>x.id===id);

    if(state!=null) myPage.open=state;
    else myPage.open = !myPage.open;

    $("#sef-closed-"+id).toggleClass("sef-hidden",myPage.open);
    $("#sef-opened-"+id).toggleClass("sef-hidden",!myPage.open);
    $("#"+id+" li:nth-of-type(n+2)").toggleClass("sef-hidden",!myPage.open);

}
function getData(txt){
  return new Promise((resolve,reject)=>{
  $.get("//www.sefaria.org.il/api/links/" + txt).done(function (data) {
    data.map(item => { item.section=item.anchorRef.substring(0,item.anchorRef.indexOf(":")); })
    data = data.filter(function (x) {
      return true;//x.type == "ein mishpat / ner mitsvah";
    });
    resolve(data);
  });
});
}