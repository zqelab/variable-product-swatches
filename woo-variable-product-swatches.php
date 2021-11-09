<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://github.com/zqelab
 * @since             1.0.0
 * @package           Woo_Variable_Product_Swatches
 *
 * @wordpress-plugin
 * Plugin Name:       Woo Variable Product Swatches
 * Plugin URI:        https://github.com/zqelab/woo-variable-product-swatches
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            ZQE
 * Author URI:        https://github.com/zqelab
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       woo-variable-product-swatches
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during agendapress activation.
 * This action is documented in vendor/autoload.php
 */
include dirname(__FILE__) . '/vendor/autoload.php';

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'WOO_VARIABLE_PRODUCT_SWATCHES_VERSION', '1.0.0' );
define( 'WOO_VARIABLE_PRODUCT_SWATCHES_BASENAME', plugin_basename( __FILE__ ) );
define( 'WOO_VARIABLE_PRODUCT_SWATCHES_URI', plugin_dir_url( __FILE__ ) );
define( 'WOO_VARIABLE_PRODUCT_SWATCHES_PATH', plugin_dir_path( __FILE__ ) );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-woo-variable-product-swatches-activator.php
 */
function activate_woo_variable_product_swatches() {
	\Zqe\Woo_Variable_Product_Swatches_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-woo-variable-product-swatches-deactivator.php
 */
function deactivate_woo_variable_product_swatches() {
	\Zqe\Woo_Variable_Product_Swatches_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_woo_variable_product_swatches' );
register_deactivation_hook( __FILE__, 'deactivate_woo_variable_product_swatches' );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_woo_variable_product_swatches() {

	$plugin = new \Zqe\Woo_Variable_Product_Swatches();
	$plugin->run();

}
add_action( 'plugins_loaded', 'run_woo_variable_product_swatches', 25 );
