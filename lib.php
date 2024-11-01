<?
	function prepareQueryOutput($recordsArr, $titlesArr) {
		
		$maxLenArr = Array();
		
		//Calculating longest field from fields of record
		foreach ($recordsArr as $recordIndex => $recordArr)
			foreach ($recordArr as $index => $value)
				if (strlen($value) > $maxLenArr[$index])
					$maxLenArr[$index] = strlen($value);
		
		//Calculating longest field from fields of header
		foreach ($titlesArr as $index => $value)
			if (strlen($value) > $maxLenArr[$index])
				$maxLenArr[$index] = strlen($value);
		
		//Creating header output
		$line = '+';
		$title = '|';
		foreach($titlesArr as $index => $fieldName) {
			$line .= str_repeat('-', $maxLenArr[$index]+1).'-+';
			$title .= ' '.$fieldName.str_repeat(' ', $maxLenArr[$index] - strlen($fieldName)).' |';
		}
		
		//Creating records output
		foreach($recordsArr as $rowIndex => $rowArr) {
			$row = '|';
			foreach($rowArr as $fieldIndex => $value)
				$row .= ' '.$value.str_repeat(' ', $maxLenArr[$fieldIndex] - strlen($value)).' |';
			$rows .= $row."\n";
		}
		
		return $line."\n".$title."\n".$line."\n".$rows.$line."\n";
	}
		
	function getDatabaseConfig() 
	{	
		$dbConfig = Array();
		
		
		if (!isset($_SESSION['DB_DATABASE_NAME']))
		{	
			$_SESSION['DB_TYPE'] = 'mysql';
			$_SESSION['DB_USERNAME'] = $_POST['u'];
			$_SESSION['DB_PASSWORD'] = $_POST['p'];
			$_SESSION['DB_HOST'] = $_POST['h'];
			$_SESSION['DB_DATABASE_NAME'] = $_POST['d'];		
		} 
		else 
		{		
			$dbConfig['DB_TYPE'] = $_SESSION['DB_TYPE'];
			$dbConfig['DB_USERNAME'] = $_SESSION['DB_USERNAME'];
			$dbConfig['DB_PASSWORD'] = $_SESSION['DB_PASSWORD'];
			$dbConfig['DB_HOST'] = $_SESSION['DB_HOST'];
			$dbConfig['DB_DATABASE_NAME'] = $_SESSION['DB_DATABASE_NAME'];		
		}
		
		if(empty($_POST['database']))
		{
			if (!empty($dbConfig['DB_DATABASE_NAME']))
				echo "js{ SRV_DATABASE = '{$dbConfig['DB_DATABASE_NAME']}'; }js";
			else if (!empty($_POST['d']))
				echo "js{ SRV_DATABASE = '{$_POST['d']}'; }js";				
		}
		return $dbConfig;
	}
	
	function execQuery($conn, $query) {
		
		if (!$conn) return;
		$start = microtime(true);
		$result = @mysql_query($query, $conn);
		if (!$result) $output = "Error ".mysql_errno().": ".mysql_error();
		$second = number_format(microtime(true) - $start, 2, '.', '');
		
		if ($result)
		if (@mysql_num_rows($result) > 0) {
			$recordsArr = Array();
			while (($row = mysql_fetch_assoc($result))) {
				$titlesArr = array_keys($row);
				$recordArr = array_values($row);
				array_push($recordsArr, $recordArr);
			}
			$output .= prepareQueryOutput($recordsArr, $titlesArr);
			$output .= mysql_num_rows($result).' rows in set ('.$second.' sec)';
			$output .= "\n";
        } else
      		$output .= 'Affected rows number : '.mysql_affected_rows($conn);
      	
		@mysql_free_result($result);
		return $output."\n";
	}
	
	function changeDatabase($conn, $cmd) {
		if (!$conn) return;
		$curDB = $_POST['database'];
		$newDB = trim(substr($cmd, strpos($cmd,' '), strlen($cmd) - strpos($cmd, ' ')));
		if ($curDB != $newDB) {
			if (!mysql_select_db($newDB, $conn))
			$output = "Error ".mysql_errno().": ".mysql_error()."\n";
			else {
				$output = "Database changed\n";
				echo "js{ SRV_DATABASE = '$newDB'; }js";
			}
		} else 
		$output = "Current database is $curDB\n";
		return $output;
	}
	
	function getDatabaseConnection($dbConfig, $showMess = true) {
		
		if (get_cfg_var('mysql.allow_persistent'))
			$conn = @mysql_pconnect($dbConfig['DB_HOST'], $dbConfig['DB_USERNAME'], $dbConfig['DB_PASSWORD']);
		else
			$conn = @mysql_connect($dbConfig['DB_HOST'], $dbConfig['DB_USERNAME'], $dbConfig['DB_PASSWORD']);
		
		if (isset($_POST['database']))
			if (!mysql_select_db($_POST['database'], $conn))
				$output = "Error ".mysql_errno().": ".mysql_error()."\n";		
		
		if ((!$conn) and ($showMess)) 
			echo "\nError ".mysql_errno().": ".mysql_error();
		return $conn;
	}
	
	function initialize() {
		
		/* Checking Mysql Persistent Connection Support */
		if (!get_cfg_var('mysql.allow_persistent')) {
			$output .= "WARNING: There is a no support for mysql persistent connections! (Check readme.txt)\n\n";
		}
		
		/*Checking for database configuration settings for config.php */
		$dbConfig = getDatabaseConfig();
		$dbConn = getDatabaseConnection($dbConfig, false);
		$output .= "Welcome to the WP MySQL Console.\n";
		if (!$dbConn) 
		$output .= "\nError: Couldn't connect to mysql server ! Please type <help connect> for help.\n\n";
		else $output .= "Connected to server version ".mysql_get_server_info().". Commands end with ;\n\n";
		$output .= "Type 'help;' for help.\n\n";
		
		return $output;
	}
	
	function getStatusInformationFromServer() {
		
		$dbConfig = getDatabaseConfig();
		mysql_connect($dbConfig['DB_HOST'], $dbConfig['DB_USERNAME'], $dbConfig['DB_PASSWORD']);
		
		$output .= "\n";
		$output .= "Connection id       :\n";
		$output .= "Current user        : {$dbConfig['DB_USERNAME']}\n";
		$output .= "Current database    : {$_POST['database']}\n";
		$output .= "Server version      : ".mysql_get_server_info()."\n";
		$output .= "Protocol            : ".mysql_get_proto_info()."\n";
		$output .= "Connection          : ".mysql_get_host_info()."\n";
		$output .= "Server characterset :\n";
		$output .= "Db characterset     :\n";
		$output .= "Client characterset : ".mysql_client_encoding()."\n";
		$output .= "Conn. characterset  :\n";
		$output .= "TCP port            :\n";
		
		$mysqlStat = explode("  ", mysql_stat());
		for ($i = 0; $i < count($mysqlStat); $i++) {
			$keyAndValue = explode(": ", $mysqlStat[$i]);
			$key = $keyAndValue[0];
			$val = $keyAndValue[1];
			$val = ($key == 'Uptime') ? date('G', $val).' hours '.date('i', $val).' minutes '.date('s', $val).' seconds ' : $val;
			$output .= $key.str_repeat(' ', 23 - strlen($key)).": ".$val."\n";
		}
		$output .= "\n";
		
		return $output;
	}
?>