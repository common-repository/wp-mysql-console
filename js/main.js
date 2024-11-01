	
	/* Poject identifications */
	var appName = 'phpMySQLConsole';
	var appVer = '1.0';
	var appAuthor = 'Tankado';
	var appEmail = 'tankado@tankado.com';
	var appSite = 'http://www.tankado.com/projects/phpMySQConsole/';
		
	/* Server Variables (SV) */
	var SRV_DATABASE = '';	
	
	function createProgressBar() 
	{
		document.write("<table id='progressBar' cellspacing='0' cellpadding='0'>");
		document.write("<tr><td><img id='progressImage' src='img/progress.gif'></td>");
		document.write("<td>Processing...&nbsp;&nbsp;&nbsp;</td></tr></table>");
	}
	
	function lockConsole() 
	{
		self.console.readOnly = true;
		self.console.style.cursor = 'wait';
		
		var progressBar = document.getElementById('progressBar');
  		var progW = progressBar.style.width;
  		var progH = progressBar.style.height;
  		var winW = document.getElementById('phpMySQLConsole').offsetWidth;
  		var winH = document.getElementById('phpMySQLConsole').offsetHeight;		
		progressBar.style.left = Math.round(winW/2) - Math.round(progW/2);
		progressBar.style.top = Math.round(winH/2) - Math.round(progH/2);
		progressBar.style.display = 'block';		
	}
	
	function unlockConsole() 
	{
		document.getElementById('progressBar').style.display = 'none';
		self.console.style.cursor = '';
		self.console.readOnly = false;
		self.console.focus();
	}
	
	/*
		There is a wrap bug in Firefox. No IE.
		You can get detailed info from:
		http://forums.dreamincode.net/index.php?showtopic=18796&pid=172696&st=0&#entry172696
	*/
	function setWrap(obj, val) {
		obj.setAttribute('wrap', val);
		var parNod = obj.parentNode, nxtSib = obj.nextSibling;
		parNod.removeChild(obj); 
		parNod.insertBefore(obj, nxtSib);
	}
	
	function newWindow(URL) {
		
		var w = screen.width;
		var h = screen.height;
		var win_width = w - 350;
		var win_height = h - 350;
		var left = (w - win_width)/2;
		var top = (h - win_height)/2;
		var features = '';
		features += 'width='+win_width+',height='+win_height+', menubar=yes';
		features += ',top='+top+',left='+left+',screenX='+left+',screenY='+top;
		var randName = 'phpMySQLConsole' + Math.floor(Math.random()*100);
		win = window.open(URL, randName, features);
		win.focus();
		return win;
	}