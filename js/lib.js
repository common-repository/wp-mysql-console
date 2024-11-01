	function _copyToClipboard(copyText) {
	 	 
		if (window.clipboardData) {
			window.clipboardData.setData("Text", copyText);
		}else if (window.netscape){
			netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
			var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
			if (!clip) return;
			var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if (!trans) return;
			trans.addDataFlavor('text/unicode');
			var str = new Object();
			var len = new Object();
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			var copytext=copyText;
			str.data=copytext;
			trans.setTransferData("text/unicode",str,copytext.length*2);
			var clipid=Components.interfaces.nsIClipboard;
			if (!clip) return false;
			clip.setData(trans,null,clipid.kGlobalClipboard);
		}
	}
	
	function trim(str) {
		str = this != window? this : str;
		return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
	}
	
/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Created by: Mark O'Sullivan :: http://lussumo.com/
 Jeff Larson :: http://www.jeffothy.com/
 Mark Percival :: http://webchicanery.com/
 */
function copyToClipboard(text2copy) {
  if (window.clipboardData) {
    window.clipboardData.setData("Text",text2copy);
  } else {
    var flashcopier = 'flashcopier';
    if(!document.getElementById(flashcopier)) {
      var divholder = document.createElement('div');
      divholder.id = flashcopier;
      document.body.appendChild(divholder);
    }
    document.getElementById(flashcopier).innerHTML = '';
    var divinfo = '<embed src="/wp-content/plugins/wp-mysql-console/js/_clipboard.swf" FlashVars="clipboard='+escape(text2copy)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
    document.getElementById(flashcopier).innerHTML = divinfo;
  }
}
