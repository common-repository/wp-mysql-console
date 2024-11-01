	
	var innerHTMLCodes = '';
	var jsCodes;
	var result = '';
	
	var statusCodes = new Array;
	statusCodes[201] = 'Object created, reason = new URI.';
	statusCodes[403] = 'Request forbidden.';
	statusCodes[404] = 'Page not found.';
	statusCodes[12031] = 'Disconnected from page.';
	statusCodes[12002] = 'Time out.';
	statusCodes[12029] = 'Couldnt connect to server side.';
	
	function getJSCodes(resp) {
		var rxObj = new RegExp('js\{(.*)\}js');
		var matched = rxObj.exec(resp);
		if (matched != null) return matched[1];	else return null;
	}
	
	function stripJSCodes(resp) {
		var rxObj = new RegExp('js\{(.*)\}js');
		var matched = rxObj.exec(resp);
		if (matched != null) return resp.replace(rxObj, ''); else return resp;
	}
	
	function CreateXMLHTTP() {
		var http;
		try {
			http = new XMLHttpRequest();  /* e.g. Firefox */
		} catch(e) {
			try {
				http = new ActiveXObject("Msxml2.XMLHTTP");  /* some versions IE */
			} catch (e) {
				try {
					http = new ActiveXObject("Microsoft.XMLHTTP");  /* some versions IE */
				} catch (e) {
					http = false;
				}
			}
		}
		return http;
	}
	
	function goAjax(URL, objectName) {
		
		// Create connection object
		var http = CreateXMLHTTP();
		
		// Extract URL and data
		var params = URL.substr(URL.indexOf("?") + 1, URL.length + 1);
		URL = URL.substr(0, URL.indexOf("?"));
		
		// For non-persistent connections
		if (SRV_DATABASE != '') params += '&database=' + SRV_DATABASE;
		
		// Open connection and set encoding
	    http.open('POST', URL, true);
	   	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
	    http.onreadystatechange = 
	    function() {
	    	
	    	var jsCodes;
	    	
	    	if (http.readyState == 4) {
		    	jsCodes = getJSCodes(http.responseText);
		    	innerHTMLCodes = stripJSCodes(http.responseText);
	    	}
	    	
			//if Null no visual reply
			switch (http.readyState) {
				
				//loading
				case 1:
					
					break;
					
				// completed
				case 4:
					if (http.status != 200)	result = statusCodes[http.status];
					else result = innerHTMLCodes;
					self.console.write(result);
					unlockConsole();
					break;
					
				// discard status
				default:
					
					break;
			}
			if (jsCodes) eval(jsCodes);
		}
		
		lockConsole();
	    http.send(params);
	}