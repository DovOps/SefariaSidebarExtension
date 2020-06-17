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
        pattern: /^.*e-daf.com\/?$|^.*e-daf.com\/index\.asp$/mgi,
        getReference: function (uri) {
            return {
                reference: document.title.replace("E-DAF.com ", "").toLowerCase(),
                site: 'E-DAF.com'
            };
        }
    }
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
            var ref= matcher.getReference(uri);
            console.log("Reference: "+JSON.stringify(ref));
            result = ref;
        } 
    });
    return result;
}
