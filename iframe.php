<?php
	include_once('lib.php');
		
	define('WP_USE_THEMES', false);
	require_once( dirname(__FILE__).'/../../../wp-config.php' );	
		
	function wmc_is_wp_admin()
	{
		$ret = false;
		
		global $user_ID; 
		if($user_ID) 
		if (current_user_can('level_10'))
			$ret = True;
			
		return $ret;	
	}	
	
	if (!wmc_is_wp_admin())
		die('Permission denied!');
?>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
	<link type="text/css" rel="stylesheet" href="img/style.css">
	<script src="js/lib.js" type="text/javascript"/></script>
	<script src="js/main.js" type="text/javascript"/></script>
	<script src="js/ajax.js" type="text/javascript"/></script>
	<script src="js/console.js" type="text/javascript"/></script>
	<script src="js/localcmds.js" type="text/javascript"/></script>
	<title>WP MySQL Console Plugin</title>
	<script language='jscript'>
		function set_color(color)
		{
			myObj = document.getElementById("phpMySQLConsole");			
			myObj.style.color = color;
			return false;
		}
		function bold(color)
		{
			myObj = document.getElementById("phpMySQLConsole");			
			myObj.style.cssText = myObj.style.cssText + "font-weight: bold";
			return false;
		}		
	</script>
</head>
<body>
	<table cellpadding='0' cellspacing='0' width='100%'>
	<tr>
		<td>
			<div style='text-align:left;float:left;' class='top_menu_container'>
				[
				+ <a class='top_menu' onclick="javascript:newConsole()" title='Open new console'>New Console</a>
				+ <a class='top_menu' title='Go to Plugin homepage' target='_blank' href='http://www.tankado.com/wp-mysql-console/'>Homepage</a>
				+ <a class='top_menu' title='Go to facebook.com/zerostoheroes' target='_blank' href='https://www.facebook.com/zerostoheroes'>Developer</a>
				]
			</div>
		</td>
		<td align='right' style='text-align:right;'>			
			<div class='top_menu_container'>
				[
				<span class='top_menu' onclick="javascript:set_color('#C0C0C0')">Gray</span>
				<span class='top_menu' onclick="javascript:set_color('#FFFFFF')">White</span>
				<span class='top_menu' onclick="javascript:set_color('#00FF00')">Green</span>
				<span class='top_menu' onclick="javascript:set_color('#FF4500')">Red</span>
				<span class='top_menu' onclick="javascript:bold()"><b>Bold</b></span>		
				]
			</div>		
		</td>
	</tr>
	<tr>
		<td colspan='2'>
			<div style='float:left'>
			<script> 
				createProgressBar();
				var console = new Console.createInteractiveConsole('phpMySQLConsole');
				document.body.appendChild(console);
				setWrap(console, 'off');
				
				/* Initializing console:
					- Checks MySQL persistent connection support.
					- Loads settings and config.php.
				 */
				<?php
					echo sprintf("goAjax('ajax.php?cmd=initialize&h=%s&d=%s&u=%s&p=%s');",
						DB_HOST,
						DB_NAME,
						DB_USER,
						DB_PASSWORD);
					
				?>
			</script>
			</div>
		</td>
	</tr>
	</table>	
</body>
</html>