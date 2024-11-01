<?php
/**
 Plugin Name: WP MySQL Console
 Plugin URI: http://www.tankado.com/wp-mysql-console/
 Version: 0.2
 Description: WP MySQL Console is a powerful and most original way to operate your MySQL databases via a simple web interface.
 Author: Özgür Koca
 Author URI: http://www.tankado.com/
*/

/*  Copyright 2011 Ozgur Koca  (email : ozgur.koca@linux.org.tr)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

function wpmc_show_console()
{
	?>
	<div class='wrap'>
	<iframe src='/wp-content/plugins/wp-mysql-console/iframe.php' width='98%' height='1440' frameBorder='0' id='wmc_frame'>
	</div>
	<?php
}

function wpmc_menu() {
    add_options_page('WP MySQL Console', 'WP MySQL Console', 8, 'wpmysqlconsolemain', 'wpmc_show_console');
}

add_action('admin_menu', 'wpmc_menu');
?>