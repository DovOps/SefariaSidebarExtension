var sefariaMatchers = [
    {
        pattern: /^.*daf-yomi.com\/(DafYomi_Page\.aspx)/mgi,
        getReference: function (uri) {
            return {
                reference: $("#ContentPlaceHolderMain_hdrMassechet").text(),
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
                site: 'Daf HaChaim'
            };
        }
    },
    
    {
        pattern: /^.*e-daf.com\/?$|^.*e-daf.com\/index\.asp(\?.*)?$/mgi,
        getReference: function (uri) {
            return {
                reference: document.title.replace("E-DAF.com ", "").toLowerCase(),
                site: 'E-DAF.com'
            };
        }
    },

    {
        pattern: /^.*alldaf.org\/p\/[0-9]+(\?.*)?$/mgi,
        getReference: function (uri) {
            return {
                reference: $('meta[name=description]').attr("content").toLowerCase(),
                site: 'AllDaf'
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