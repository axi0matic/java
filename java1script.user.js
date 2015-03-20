// ==UserScript==
// @name		1click Researching 
// @description		Change status of TT to Researching and add a 'Researching' correspondence 
// @include		http*://tt*/*
// $Revision: #2 $
// ==/UserScript==

(function () {
	var OneclickResearching = document.getElementById('button_bar')

	if (OneclickResearching) {

		var ss = document.createElement('script');
		ss.type = 'text/javascript';
		var ResearchingScr = " function changeStatusToResearching() {var status = document.getElementById('status'); if(status.value !='Researching') { status.value='Researching'; var corr = document.getElementById('correspondence'); corr.value = 'Taking a look'; document.forms.form_ticket.submit(); } } ";
		var tt = document.createTextNode(ResearchingScr);
		ss.appendChild(tt);
		var hh = document.getElementsByTagName('body')[0];
		hh.appendChild(ss);

		var ResearchingButton = document.createElement("a");
		ResearchingButton.href = '#';
		ResearchingButton.innerHTML = '<span>1ClickResearching</span>';
		ResearchingButton.setAttribute("onClick", "changeStatusToResearching()");
		ResearchingButton.setAttribute("type", "button");
		ResearchingButton.setAttribute("class", "tt_button orange_button");

		OneclickResearching.appendChild(ResearchingButton);
	}

})();



















































// Create functions which are known to be 
// missing from Chrome's Greasemonkey API
if (typeof GM_getValue == 'undefined') {
    GM_getValue = function(name, defaultValue) {
        var value = localStorage.getItem(name);
        if (!value)
            return defaultValue;
        var type = value[0];
        value = value.substring(1);
        switch (type) {
            case 'b':
                return value == 'true';
            case 'n':
                return Number(value);
            default:
                return value;
        }
    }
}

if (typeof GM_setValue == 'undefined') {
    GM_setValue = function(name, value) {
        value = (typeof value)[0] + value;
        localStorage.setItem(name, value);
    }
}

if (typeof GM_log == 'undefined') {
    GM_log = function(message) {
        console.log(message);
    }
}

var NinjaAutoUpdate = new Object();
NinjaAutoUpdate.version = 0;
NinjaAutoUpdate.delta = 60 * 60 * 24 * 3; //3 days (?)

NinjaAutoUpdate.getEpoch = function() {
    return Math.round((new Date()).getTime()/1000);
};

NinjaAutoUpdate.init = function() {
    // check new version
    // compute current time
    var now = NinjaAutoUpdate.getEpoch();
    var updateAt = GM_getValue("NinjaAutoUpdate_LAST_CHECK", 0) + NinjaAutoUpdate.delta;

    if (updateAt > now) return; // dont do anything 
  
    // do a check
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://improvement-ninjas.amazon.com/gmget.cgi?check=OneClickResearching.user.js',
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        onload: NinjaAutoUpdate.callback
        });
    // record time of last check
    GM_setValue("NinjaAutoUpdate_LAST_CHECK", NinjaAutoUpdate.getEpoch());
};

NinjaAutoUpdate.callback = function(response) {
    if (! Number(response.responseText)) {
        // ERROR!? What can be done now? Not a lot i reckon...
        return;
    }
    if (NinjaAutoUpdate.version != Number(response.responseText)) {
        NinjaAutoUpdate.createAlert();
    }
};

NinjaAutoUpdate.ignore = function(event) {
    GM_setValue("NinjaAutoUpdate_LAST_CHECK", NinjaAutoUpdate.getEpoch());
    NinjaAutoUpdate.cancelAlert();
    if (typeof event === "object" && typeof event.stopPropagation === "function") {
      event.stopPropagation();
    }
};

NinjaAutoUpdate.install = function() {
    window.open('https://improvement-ninjas.amazon.com/gmget.cgi?get=OneClickResearching.user.js');
    NinjaAutoUpdate.cancelAlert();
    GM_setValue("NinjaAutoUpdate_LAST_CHECK", NinjaAutoUpdate.getEpoch());
    if (typeof event === "object" && typeof event.stopPropagation === "function") {
      event.stopPropagation();
    }
};

NinjaAutoUpdate.createAlert = function() {
    NinjaAutoUpdate.alert = document.createElement('div');
    NinjaAutoUpdate.alert.setAttribute('class', 'NinjaAutoUpdateOverlay');
    NinjaAutoUpdate.alert.innerHTML = "<style>.NinjaAutoUpdateOverlay {  font-size: 11px;  position: relative;  margin: 0 0 0 0;  padding: 4px 10px;  text-align: left;  z-index: 1000;  cursor: pointer;  background-color: #FFFFD5;  border-bottom:1px solid #E47911;  color: #990000;}.NinjaAutoUpdateOverlay a {  padding: 0px 4px;}.NinjaAutoUpdateOverlay .nau-right {  float: right;}</style><div>    <span style='font-size:larger'>    A new version of <strong>'OneClickResearching.user.js'</strong> is available!    </span>  <a href='#' id='NinjaAutoUpdateInstall-OneClickResearching.user.js'>    Get the new one!  </a>  <a href='#' id='NinjaAutoUpdateIgnore-OneClickResearching.user.js' class='nau-right'>    Ignore for a few days  </a></div>";
    var first = document.body.firstChild;
    document.body.insertBefore(NinjaAutoUpdate.alert, first);
    NinjaAutoUpdate.alert.addEventListener("click", NinjaAutoUpdate.install, false);
    document.getElementById("NinjaAutoUpdateInstall-OneClickResearching.user.js").addEventListener("click", NinjaAutoUpdate.install, false);
    document.getElementById("NinjaAutoUpdateIgnore-OneClickResearching.user.js").addEventListener("click", NinjaAutoUpdate.ignore, false);
};

NinjaAutoUpdate.cancelAlert = function() {
  if (typeof NinjaAutoUpdate.alert === "object") {
    NinjaAutoUpdate.alert.parentNode.removeChild(NinjaAutoUpdate.alert);
    NinjaAutoUpdate.alert = undefined;
  }
};

// Init without waiting for load event, this code
// doesnt depend on any loaded DOM elements
NinjaAutoUpdate.init();
