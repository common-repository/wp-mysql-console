Console = {};

Console.createInteractiveConsole = function (name) {
	
	var lastCursorPosition = 9;
	var currentCommand = '';
	var console = document.createElement('textarea');
	
	console.id = name;
	console.lastCaretPosition = 0;	
	
	console.history = [];
	console.history.reset = function () {
		this.position = (this.length == 0) ? 0 : this.length;
	};
	
	console.history.up = function () {
		if (this.length == 0)
			return '';
		
		this.position = (this.position + 1 >= this.length)?this.length - 1:this.position + 1;
		return this[this.position];
	};
	
	console.history.down = function () {
		if (this.length == 0)
			return '';
		
		this.position = (this.position <= 0)?0:this.position - 1;
		return this[this.position];
	};
	
	console.history.reset();
	
	console.clear = function () {
		this.value = '';
		this.lastCaretPosition = 0;
		this.setCaretPosition(this.lastCaretPosition);
	};
	
	console.write = function (str) {
		this.value += str;
		this.lastCaretPosition = this.value.length;
		this.scrollTop = this.scrollHeight;
	};
	
	console.getCaretPosition = function () {
		if (document.selection) {
			this.focus();
			return this.value.length;
		} else if (this.selectionStart || this.selectionStart == '0') {
			return this.selectionStart;
		}
		return 0;
	};
	
	console.setCaretPosition = function (pos) {
		if(this.setSelectionRange) {
			this.focus();
			this.setSelectionRange(pos,pos);
		} else if (this.createTextRange) {
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};
	
	console.onfocus = function () {
		this.setCaretPosition(this.lastCaretPosition);
	};
	
	console.onmousedown = function (e) {
		lastCursorPosition = console.getCaretPosition();
	}
	
	console.onmouseup = function (e) {
		
		if(navigator.appName == "Netscape") {
			range = new Array( console.selectionStart, console.selectionEnd );
			selectedText = console.value.substr(range[0], range[1] - range[0]);
		} else {
			//"Microsoft Internet Explorer"
			selectedText = document.selection.createRange().text;
		}
		
		if ( trim(selectedText) != '' )
		copyToClipboard(selectedText);		
		
		this.setCaretPosition(lastCursorPosition);
	}
	
	console.pushHistory = function (command) {
		this.history.push(trim(command));
		this.history.reset();
	}
	
	console.onkeydown = function (e) {
		if (!e) e = window.event;
		
		/* Backspace and End Keys */
		if ((e.keyCode == 8 || e.keyCode == 37) && this.getCaretPosition() <= this.lastCaretPosition) {
			return false;
		
		/* Enter Key */
		} else if (!e.shiftKey && e.keyCode == 13) {
			
			this.setCaretPosition(this.value.length);
			var command = this.value.substring(this.lastCaretPosition, this.value.length);
			var endChar = this.value.substr(this.value.length-1, 1);
			
			if (!self.console.checkForConsoleCommands(command))
				if ((endChar != ';') && (trim(command) != '')) {
					currentCommand = currentCommand + ' ' + trim(command);
					self.console.write("\n    -> ");
				} else {
					command = currentCommand + ' ' + command;	
					console.execSQL(command);
					console.pushHistory(command);
					this.scrollTop = this.scrollHeight;
					currentCommand = '';
				}
			return false;
		
		/* Down Arrow */
		} else if (e.keyCode == 38) {
			this.value = this.value.substring(0, this.lastCaretPosition) + this.history.down();
			this.scrollTop = this.scrollHeight;
			return false;
		
		/* Up Arrow */
		} else if (e.keyCode == 40) {
			this.value = this.value.substring(0, this.lastCaretPosition) + this.history.up();
			this.scrollTop = this.scrollHeight;
			return false;
		
		/* Escape Key */
		} else if (e.keyCode == 27) {
			this.value = this.value.substring(0, this.lastCaretPosition);
			this.scrollTop = this.scrollHeight;
			return false;
		
		/* Home Key */
		} else if (e.keyCode == 36) {
			this.setCaretPosition(this.lastCaretPosition);
			return false;
		} 
		return true;
	};
	
	console.execSQL = function (command) {
		lockConsole();
		goAjax('ajax.php?cmd=' + command);
		return false;
	}
	
	console.checkForConsoleCommands = function (input) {
		cmd = input.toLowerCase();
		cmd = cmd.replace(';', '');
		cmd = cmd + ' ';
		args = trim(cmd.substring(cmd.indexOf(' '), cmd.length));
		cmd = cmd.substring(0, cmd.indexOf(' '));
		
		switch (cmd) {
			case 'use':
				console.pushHistory(cmd+' '+args);
				lockConsole();
				goAjax('ajax.php?cmd=use%20'+args);
				return true;
				break;
				
			case 'help':
				console.pushHistory(cmd);
				printHelp(args);
				return true;
				break;
				
			case 'clear':
				console.pushHistory(cmd);
				clearConsoleScreen();
				return true;
				break;
				
			case 'status':
				console.pushHistory(cmd);
				lockConsole();
				goAjax('ajax.php?cmd=status');
				return true;
				break;
				
			case 'new':
				console.pushHistory(cmd);
				newConsole();
				return true;
				break;
				
			case 'exit':
				console.pushHistory(cmd);
				exitConsole();
				return true;
				break;
				
			case 'quit':
				console.pushHistory(cmd);
				exitConsole();
				return true;
				break;
		}
		return false;
	}
	
	return console;
};