<?php
namespace Zqe;

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://github.com/zqelab
 * @since      1.0.0
 *
 * @package    Woo_Variable_Product_Swatches
 * @subpackage Woo_Variable_Product_Swatches/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Woo_Variable_Product_Swatches
 * @subpackage Woo_Variable_Product_Swatches/includes
 * @author     ZQE <dev@zqe.io>
 */
class Woo_Variable_Product_Swatches_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'woo-variable-product-swatches',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
