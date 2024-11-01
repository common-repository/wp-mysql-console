<?
	header('Content-Type: text/xml');
	include('lib.php');
	
	session_start();
	echo "\n";
	
	$commands = isset($_POST['cmd']) ? str_replace('\\', '', trim($_POST['cmd'])) : '';
	$cmdArr = explode(';', $commands);
	foreach($cmdArr as $key => $cmd)
	if (!empty($cmd)) {
		$_cmd = strtolower($cmd);
		switch ($_cmd) {
			case "initialize":
				$output = initialize();
				break;
				
			case substr($_cmd, 0, 4) == 'use ':
				$dbConfig = getDatabaseConfig();
				$conn = getDatabaseConnection($dbConfig);
				$output = changeDatabase($conn, $cmd);
				break;
				
			case "status":
				$output = getStatusInformationFromServer();
				break;
				
			default:
				$dbConfig = getDatabaseConfig();
				$conn = getDatabaseConnection($dbConfig);
				$output = execQuery($conn, $cmd);
				break;
		}
		echo $output;
	}
	echo "mysql>";
?>