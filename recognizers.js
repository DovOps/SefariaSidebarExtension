var SINGLE='single', DOUBLE='double';

var sefariaMatchers = [
    {
        pattern: /^.*daf-yomi.com\/(DafYomi_Page\.aspx)/mgi,
        getReference: function (uri) {
            return {
                reference: $("#ContentPlaceHolderMain_hdrMassechet").text(),
                mode:SINGLE,
                site: 'Portal Daf Yomi'
            };
        }
    },

    {
        pattern: /^.*dafhachaim.org\/(daf|resources)\/?.*/mgi,
        getReference: function (uri) {
            var ref=null;
            
            return {
                reference: $(".here-i-am").text(),
                mode:DOUBLE,
                site: 'Daf HaChaim'
            };
        }
    },
    
    {
        pattern: /^.*e-daf.com\/?$|^.*e-daf.com\/index\.asp(\?.*)?$/mgi,
        getReference: function (uri) {
            return {
                reference: document.title.replace("E-DAF.com ", "").toLowerCase(),
                mode:SINGLE,
                site: 'E-DAF.com'
            };
        }
    },

    {
        pattern: /^.*alldaf.org\/p\/[0-9]+(\?.*)?$/mgi,
        getReference: function (uri) {
            return {
                reference: $('meta[name=description]').attr("content").toLowerCase(),
                mode:DOUBLE,
                site: 'AllDaf'
            };
        }
    },

    {
        pattern: /^.*realcleardaf.com\/(.*)$/mgi,
        getReference: function (uri) {
            var title=$('h1.shiur-title');
            if(!title || title.text()==null|| title.text()=="") return null;
            else title=title.text();
              
            return {
                reference: title.substring(title.indexOf("|")+1),
                mode:DOUBLE,
                site: 'RealClearDaf'
            };
        }
    },

    {
        pattern: /^.*steinsaltz-center.org\/vault\/DafYomi\/.*$/mgi,
        getReference: function (uri) {
            console.log(uri=(window.top?window.top:window).location.href);
            console.log("steinsaltz: "+uri);
            var title=(""+uri).replace(/.*\/vault\/DafYomi\/([^\.]+).*/,"$1");
            
            console.log("title: "+title);
            if(!title  || title.length==0)return null;
    
            return {
                reference:title.replace("_"," "),
                mode:DOUBLE,
                site: 'Steinsaltz PDF'
            };
        }
    },

    {
        pattern: /^.*yutorah.org\/lectures\/lecture\.cfm(.*)$/mgi,
        getReference: function (uri) {
            var title=$('h2[itemprop=name]');
            if(!title || title.text()==null|| title.text()=="") return null;
            else title=title.text();
            if( ! /(.*)( Daf )[0-9]+/.test(title)) return null;
            else title=title.replace(" Daf","");
            return {
                reference: title,
                mode:DOUBLE,
                site: 'YUTorah'
            };
        }
    },

    {
        pattern: /^.*yutorah.org\/daf\.cfm.*$/mgi,
        getReference: function (uri) {
            var title=$('.daf-title span');
            if(!title || title.length==0) return null;
            title=title.text();
            var lastChar=(title.charAt(title.length-1));
            if(lastChar == 'a' || lastChar=='b') title=title.substring(0,title.length-1);
            return {
                reference: title,
                mode:DOUBLE,
                site: 'YUTorah On the Daf'
            };
        }
    },


    {
        pattern: /^.*hadran.org.il\/daf\/(.*)$/mgi,
        getReference: function (uri) {
            var title=$('title');
            if(!title || title.text()==null || title.text().indexOf(" - ")==-1) return null;
            else title=title.text().substring(0,title.text().indexOf(" - "));
            if( ! /(.*) [0-9]+/.test(title)) return null;
            return {
                reference: title,
                mode: DOUBLE,
                site: 'Hadran'
            };
        }
    },

    {
        pattern: /^.*outorah.org\/dafImage\/([^\/]+)\/([0-9]+)\/([0-1])?$/mgi,
        getReference: function (uri, self) {
            var ref=uri.replace(self.pattern, function(str, masechta, daf, amud){
                return masechta +" "+daf+((amud=='0')?'a':'b');
            });
            return {
                reference: ref,
                site: 'OuTorah Daf Image'
            };
        }
    },

];



function getSefariaReference(uri) {
    var result = null;
    var uri = uri.toLowerCase();
    console.log("My URI " + uri);
    sefariaMatchers.forEach(function (matcher) {
        console.log(matcher.pattern);
        var matches = false;
        if (matcher.pattern instanceof RegExp) {
            matches = matcher.pattern.test(uri);
        } else {
            matches = (uri.indexOf(matcher.pattern.toLowerCase()) > -1);
        }
        console.log("Matches : " + matches);
        if(matches) {
            var ref= matcher.getReference(uri, matcher);
            console.log("Reference: "+JSON.stringify(ref));
            result = ref;
        } 
    });
    return result;
}

// Special Treatment for AllDAf which does inline DOM loading instead of normal page loads
var alldaf_current=null;
if(location.href.indexOf("alldaf.org")>-1){
    alldaf_current=$('meta[name=description]').attr("content").toLowerCase();

function mutationHandler (mutationRecords) {
    var now=$('meta[name=description]').attr("content").toLowerCase();
    if(alldaf_current !=now && /^.* [1-9]+$/.test(now)){
        console.log("[[ AllDaf Change Event ]] >> "+now);
        alldaf_current=now;
        getLinks(alldaf_current);
    }
}

new MutationObserver(mutationHandler).observe($("head").get(0),{childList:true});
}