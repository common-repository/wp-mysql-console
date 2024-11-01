	function clearConsoleScreen() {
		historyBackup = console.history;
		console.value = '';
		console.write('mysql> ');
		console.setCaretPosition(8);
		console.history = historyBackup
	}
	
	function printHelp(command) {
		var helpStr = '';
		
		switch (command) {
			case 'clear':
				helpStr += "\n";
				helpStr += "There is a no any help about command: "+command;
				helpStr += "\n";
				break;
			
			case 'new':
				helpStr += "\n";
				helpStr += "There is a no any help about command: "+command;
				helpStr += "\n";
				break;
			
			case 'connect':
				helpStr += "\n";
				helpStr += "There is a no any help about command: "+command;
				helpStr += "\n";
				break;
			
			case 'exit':
				helpStr += "\n";
				helpStr += "There is a no any help about command: "+command;
				helpStr += "\n";
				break;
			
			case 'quit':
				helpStr += "\n";
				helpStr += "There is a no any help about command: "+command;
				helpStr += "\n";
				break;
			
			case 'status':
				helpStr += "\n";
				helpStr += "There is a no any help about command: "+command;
				helpStr += "\n";
				break;
			
			case 'use':
				helpStr += "\n";
				helpStr += "There is a no any help about command: "+command;
				helpStr += "\n";
				break;
			
			default:
				helpStr += "\n";
				helpStr += "\n";
				helpStr += "For information about phpMySQLConsole, visit:\n";
				helpStr += "   http://phpmysqlconsole.tankado.com/\n";
				helpStr += "\n";
				helpStr += "List of all MySQL commands:\n";
				helpStr += "clear       Clear screen.\n";
				helpStr += "new         Open new console.\n";
				helpStr += "connect	    Connect to the server.\n";
				helpStr += "exit        Exit console. Same as quit.\n";
				helpStr += "quit        Quit console.\n";
				helpStr += "status      Get status information from the server.\n";
				helpStr += "use         Use another database. Takes database name as argument.\n";
				helpStr += "\n";
				helpStr += "For detailed help, type 'help <command>'\n";
				helpStr += "\n";
				break;
		}
		console.write(helpStr);
		console.write('mysql> ');
	}
	
	function exitConsole() {
		if (!window.close())
			console.write("\nWarning: This window probably not created dynamicly. So use close button of window.\nmysql> ");
	}
	
	function newConsole() {
		newWindow(window.location + '?database=' + SRV_DATABASE);
		console.write("mysql> ");
	}