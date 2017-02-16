"use strict";
var GMap;
(function (GMap) {
    function hideDescrBar() {
        $('#descrBar').animate({ right: -355 }).hide();
    }
    GMap.hideDescrBar = hideDescrBar;
    function gup(name, url) {
        if (!url)
            url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    }
})(GMap || (GMap = {}));
//# sourceMappingURL=gmap.js.map