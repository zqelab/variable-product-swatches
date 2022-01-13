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
class Variable_Product_Swatches_Admin {

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
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Variable_Product_Swatches_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Variable_Product_Swatches_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_enqueue_style( $this->plugin->name, plugin_dir_url( __FILE__ ) . 'css/variable-product-swatches-admin' . $suffix . '.css', array(), $this->plugin->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Variable_Product_Swatches_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Variable_Product_Swatches_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_enqueue_script( $this->plugin->name, plugin_dir_url( __FILE__ ) . 'js/variable-product-swatches-admin' . $suffix . '.js', array( 'jquery' ), $this->plugin->version, false );
		
		wp_localize_script( $this->plugin->name, '_VPS', array(
			'media_title' => esc_html__( 'Choose an Image', 'variable-product-swatches' ),
			'dialog_title' => esc_html__( 'Add Attribute', 'variable-product-swatches' ),
			'dialog_save' => esc_html__( 'Add', 'variable-product-swatches' ),
			'dialog_cancel' => esc_html__( 'Cancel', 'variable-product-swatches' ),
			'button_title' => esc_html__( 'Use Image', 'variable-product-swatches' ),
			'add_media' => esc_html__( 'Add Media', 'variable-product-swatches' ),
			'placeholder_img' => function_exists('wc_placeholder_img_src') ? wc_placeholder_img_src() : null,
			'ajaxurl' => esc_url( admin_url( 'admin-ajax.php', 'relative' ) ),
			'nonce' => wp_create_nonce( 'wvs_plugin_nonce' ),
		) );
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function product_attributes_type_selector_filter( $selector ) {

		foreach ( $this->plugin->helper->attributes_types() as $key => $options ) {
			$selector[ $key ] = $options['title'];
		}
		
		return $selector;
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function add_attribute_meta() {  
		
		$fields  = $this->plugin->helper->attribute_meta_fields();
		$attribute_type_keys = array_keys($fields);
		$attributes = function_exists('wc_get_attribute_taxonomies') ? wc_get_attribute_taxonomies() : array();
		
		if ( $attributes && is_array( $attributes ) ) {
			foreach ( $attributes as $key => $attribute ) {
				if (in_array($attribute->attribute_type, $attribute_type_keys)) {
					new \Zqe\Variable_Product_Swatches_Attribute_Meta( wc_attribute_taxonomy_name( $attribute->attribute_name ),  $fields[$attribute->attribute_type]);
				}
			}
		}
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function woocommerce_product_option_terms_action( $attribute_taxonomy, $i, $attribute ) {
		if ( in_array( $attribute_taxonomy->attribute_type, array_keys( $this->plugin->helper->attributes_types() ) ) ) {
			?>
			<select multiple="multiple" data-placeholder="<?php esc_attr_e( 'Select terms', 'variable-product-swatches' ); ?>" class="multiselect attribute_values wc-enhanced-select" name="attribute_values[<?php echo esc_attr( $i ); ?>][]">
				<?php
				$args = array(
					'orderby'  => 'name',
					'hide_empty' => 0,
				);
				$all_terms = get_terms( $attribute->get_taxonomy(), apply_filters( 'woocommerce_product_attribute_terms', $args ) );
				if ( $all_terms ) {
					foreach ( $all_terms as $term ) {
						$options = $attribute->get_options();
						$options = ! empty( $options ) ? $options : array();
						echo '<option value="' . esc_attr( $term->term_id ) . '"' . wc_selected( $term->term_id, $options ) . '>';
						echo esc_attr( apply_filters( 'woocommerce_product_attribute_term_name', $term->name, $term ) );
						echo '</option>';
					}
				}
				?>
			</select>
			<button class="button plus select_all_attributes">
				<?php esc_html_e( 'Select all', 'variable-product-swatches' ); ?>
			</button>
			<button class="button minus select_no_attributes">
				<?php esc_html_e( 'Select none', 'variable-product-swatches' ); ?>
			</button>
			<?php
			$fields = $this->plugin->helper->attribute_meta_fields( $attribute_taxonomy->attribute_type );

			if ( ! empty( $fields ) ) { ?>
				<button disabled="disabled" class="button fr plus wvs_add_new_attribute" data-dialog_title="<?php printf( esc_html__( 'Add new %s', 'variable-product-swatches' ), esc_attr( $attribute_taxonomy->attribute_label ) ) ?>">
					<?php esc_html_e( 'Add new', 'variable-product-swatches' ); ?>
				</button>
			<?php } else { ?>
				<button class="button fr plus add_new_attribute">
					<?php esc_html_e( 'Add new', 'variable-product-swatches' ); ?>
				</button>
			<?php } ?>
			<?php
		}
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function settings_menu() {
		add_menu_page( 'Swatches Settings', 'Swatches', 'manage_categories', 'variable-product-swatches', array($this, 'settings_page') );
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function settings_init() {
		$this->plugin->option->core->admin_init();
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function settings_page() {
		echo '<div class="wrap">';
			echo '<h1>' . get_admin_page_title() . '</h1>';
			$this->show_navigation();
			$this->plugin->option->core->show_forms();
			echo '<a onclick="return confirm(\'Are you sure to reset current settings?\')" href="admin.php?page=variable-product-swatches&action=reset">';
				echo esc_html( 'Reset all', 'variable-product-swatches' );
			echo '</a>';
		echo '</div>';
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function show_navigation() {

		if ( count( $this->plugin->option->get_pages() ) === 1 ) {
			return;
		}

		echo '<h2 class="nav-tab-wrapper">';
		foreach ( $this->plugin->option->get_pages() as $page ) {
			echo sprintf( '<a href="admin.php?page=variable-product-swatches&tab=%1$s" class="nav-tab %3$s" id="%1$s-tab">%2$s</a>', $page['id'], $page['title'], ( (isset($_GET['tab']) ? $_GET['tab'] : current($this->plugin->option->get_pages())['id']) === $page['id']) ? ' nav-tab-active': '');
		}
		echo '</h2>';
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function plugin_row_meta( $links, $file ) {
		
		if ( $file == $this->plugin->get_basename() ) {

			$report_url = esc_url( 'https://zqe.io/tickets/' );
			$documentation_url = esc_url( 'https://zqe.io/docs/woocommerce-variation-swatches/' );

			$row_meta['documentation'] = sprintf( 
				'<a target="_blank" href="%1$s" title="%2$s">%2$s</a>', 
				esc_url( $documentation_url ), 
				esc_html__( 'Read Documentation', 'variable-product-swatches' ), 
			);

			$row_meta['issues'] = sprintf( 
				'%2$s <a target="_blank" href="%1$s">%3$s</a>', 
				esc_url( $report_url ), 
				esc_html__( 'Facing issue?', 'variable-product-swatches' ), 
				'<span style="color: red">' . esc_html__( 'Open a ticket.', 'variable-product-swatches' ) . '</span>' 
			);

			return array_merge( $links, $row_meta );
		}

		return (array) $links;
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function plugin_action_links( $links ) {

		$new_links = array();

		$pro_link = esc_url( 'https://zqe.io/variable-product-swatches-pro/' );

		if ( ! $this->plugin->helper->is_pro_active() ) {

			$new_links['go-pro'] = sprintf( 
				'<a target="_blank" style="color: #45b450; font-weight: bold;" href="%1$s" title="%2$s">%2$s</a>', 
				esc_url( $pro_link ), 
				esc_attr__( 'Go Pro', 'variable-product-swatches' ) 
			);
		}

		return array_merge( $links, $new_links );
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
