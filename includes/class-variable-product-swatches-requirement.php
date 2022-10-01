<?php
namespace Zqe;

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://github.com/zqelab
 * @since      1.0.0
 *
 * @package    Variable_Product_Swatches
 * @subpackage Variable_Product_Swatches/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Variable_Product_Swatches
 * @subpackage Variable_Product_Swatches/admin
 * @author     ZQE <dev@zqe.io>
 */
class Variable_Product_Swatches_Requirement {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      \Zqe\Variable_Product_Swatches    $plugin    The ID of this plugin.
	 */
	private $plugin;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      \Zqe\Variable_Product_Swatches    $plugin       The name of this plugin.
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
	}
    /**
     *
     * @since    1.0.0
     */
	public function php_requirement_notice() {
		
		if ( ! $this->plugin->helper->is_required_php_version() ) {
			
			$class   = 'notice notice-error';
			
			$text    = esc_html__( 'Please check PHP version requirement.', 'variable-product-swatches' );
			
			$link    = esc_url( 'https://docs.woocommerce.com/document/server-requirements/' );
			
			$message = wp_kses( 
				__( "It's required to use latest version of PHP to use <strong>Variation Swatches for WooCommerce</strong>.", 'variable-product-swatches' ), 
				array( 'strong' => array() ) 
			);

			printf( 
				'<div class="%1$s"><p>%2$s <a target="_blank" href="%3$s">%4$s</a></p></div>', 
				$class, 
				$message, 
				$link, 
				$text 
			);
		}
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function wc_requirement_notice() {

		if ( ! $this->plugin->helper->is_wc_active() ) {

			$class = 'notice notice-error';

			$text    = esc_html__( 'WooCommerce', 'variable-product-swatches' );
			
			$link    = esc_url(
				add_query_arg(
					array(
						'tab'       => 'plugin-information',
						'plugin'    => 'woocommerce',
						'TB_iframe' => 'true',
						'width'     => '640',
						'height'    => '500',
					), admin_url( 'plugin-install.php' )
				)
			);

			$message = wp_kses( 
				__( "<strong>Variation Swatches for WooCommerce</strong> is an add-on of ", 'variable-product-swatches' ), 
				array( 'strong' => array() ) 
			);

			printf( 
				'<div class="%1$s"><p>%2$s <a class="thickbox open-plugin-details-modal" href="%3$s"><strong>%4$s</strong></a></p></div>', 
				$class, 
				$message, 
				$link, 
				$text 
			);
		}
	}

    /**
     *
     * @since    1.0.0
     */
	public function wc_version_requirement_notice() {

		if ( $this->plugin->helper->is_wc_active() && ! $this->plugin->helper->is_required_wc_version() ) {

			$class   = 'notice notice-error';

			$message = sprintf( 
				esc_html__( "Currently, you are using older version of WooCommerce. It's recommended to use latest version of WooCommerce to work with %s.", 'variable-product-swatches' ), 
				esc_html__( 'Variation Swatches for WooCommerce', 'variable-product-swatches' ) 
			);

			printf( 
				'<div class="%1$s"><p><strong>%2$s</strong></p></div>', 
				$class, 
				$message 
			);
		}
	}

}
