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
class Variable_Product_Swatches_Widget {

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
	public function dashboard_add_widgets() {
	    wp_add_dashboard_widget( 
	        'variable_product_swatches_dashboard_widget_news', 
	        __( 'Variable Product Swatches News', 'variable-product-swatches' ), 
	        array( $this, 'dashboard_widget_news_handler' ), 
	        array( $this, 'dashboard_widget_news_config_handler' ) 
	    );

		global $wp_meta_boxes;

		$dashboard = $wp_meta_boxes['dashboard']['normal']['core'];
		$variable_product_swatches_dashboard_widget_news = [ 
			'variable_product_swatches_dashboard_widget_news' => $dashboard['variable_product_swatches_dashboard_widget_news']
		];
		$wp_meta_boxes['dashboard']['normal']['core'] = array_merge( $variable_product_swatches_dashboard_widget_news, $dashboard ); 

	}
    /**
     *
     * @since    1.0.0
     */
	public function dashboard_widget_news_handler() {
	    
	    $options = wp_parse_args( get_option( 'variable_product_swatches_dashboard_widget_news' ), $this->dashboard_widget_news_config_defaults() );
	    
	    $feeds = array(
	        array(
	            'url'          => 'https://www.zqe.io/feed/',
	            'items'        => $options['items'],
	            'show_summary' => 1,
	            'show_author'  => 0,
	            'show_date'    => 1,
	        ),
	    );

	    wp_dashboard_primary_output( 'variable_product_swatches_dashboard_widget_news', $feeds );

	    echo '
	    <p class="variable-product-swatches-community-events-footer">
			<a href="https://zqe.io/blog/" target="_blank">
				Blog <span class="screen-reader-text">(opens in a new tab)</span><span aria-hidden="true" class="dashicons dashicons-external"></span>
			</a>
			|
			<a href="https://zqe.io/contact-us/" target="_blank">
				Help <span class="screen-reader-text">(opens in a new tab)</span><span aria-hidden="true" class="dashicons dashicons-external"></span>
			</a>
			|
			<a href="https://zqe.io/whats-new/" target="_blank">
				What\'s New <span class="screen-reader-text">(opens in a new tab)</span><span aria-hidden="true" class="dashicons dashicons-external"></span>
			</a>	
		</p>';
	}

    /**
     *
     * @since    1.0.0
     */
	public function dashboard_widget_news_config_defaults() {
	    return array(
	        'items' => 5,
	    );
	}

    /**
     *
     * @since    1.0.0
     */
	public function dashboard_widget_news_config_handler() {
	    $options = wp_parse_args( get_option( 'variable_product_swatches_dashboard_widget_news' ), $this->dashboard_widget_news_config_defaults() );
	    if ( isset( $_POST['submit'] ) ) {
	        if ( isset( $_POST['rss_items'] ) && intval( $_POST['rss_items'] ) > 0 ) {
	            $options['items'] = intval( $_POST['rss_items'] );
	        }
	        update_option( 'variable_product_swatches_dashboard_widget_news', $options );
	    }
	    ?>
	    <p>
	        <label><?php _e( 'Number of RSS articles:', 'variable-product-swatches' ); ?>
	            <input type="text" name="rss_items" value="<?php echo esc_attr( $options['items'] ); ?>" />
	        </label>
	    </p>
	    <?php
	}

}
