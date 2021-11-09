<?php
namespace Zqe;

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://github.com/zqelab
 * @since      1.0.0
 *
 * @package    Woo_Variable_Product_Swatches
 * @subpackage Woo_Variable_Product_Swatches/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Woo_Variable_Product_Swatches
 * @subpackage Woo_Variable_Product_Swatches/admin
 * @author     ZQE <dev@zqe.io>
 */
class Woo_Variable_Product_Swatches_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      \Zqe\Woo_Variable_Product_Swatches    $plugin    The ID of this plugin.
	 */
	private $plugin;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      \Zqe\Woo_Variable_Product_Swatches    $plugin       The name of this plugin.
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
		 * defined in Woo_Variable_Product_Swatches_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Woo_Variable_Product_Swatches_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin->name, plugin_dir_url( __FILE__ ) . 'css/woo-variable-product-swatches-admin.css', array(), $this->plugin->version, 'all' );

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
		 * defined in Woo_Variable_Product_Swatches_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Woo_Variable_Product_Swatches_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin->name, plugin_dir_url( __FILE__ ) . 'js/woo-variable-product-swatches-admin.js', array( 'jquery' ), $this->plugin->version, false );
		wp_localize_script( $this->plugin->name, '_WVPS', array(
			'media_title' => esc_html__( 'Choose an Image', 'woo-variation-swatches' ),
			'dialog_title' => esc_html__( 'Add Attribute', 'woo-variation-swatches' ),
			'dialog_save' => esc_html__( 'Add', 'woo-variation-swatches' ),
			'dialog_cancel' => esc_html__( 'Cancel', 'woo-variation-swatches' ),
			'button_title' => esc_html__( 'Use Image', 'woo-variation-swatches' ),
			'add_media' => esc_html__( 'Add Media', 'woo-variation-swatches' ),
			'placeholder_img' => wc_placeholder_img_src(),
			'ajaxurl' => esc_url( admin_url( 'admin-ajax.php', 'relative' ) ),
			'nonce' => wp_create_nonce( 'wvs_plugin_nonce' ),
		) );

	}
	public function product_attributes_type_selector_filter( $selector ) {

		foreach ( $this->plugin->helper->attributes_types() as $key => $options ) {
			$selector[ $key ] = $options['title'];
		}
		return $selector;
	}

	public function add_attribute_meta() {  
		
		$fields  = $this->plugin->helper->attribute_meta_fields();
		$attribute_type_keys = array_keys($fields);
		$attributes = wc_get_attribute_taxonomies();
		
		if ( $attributes && is_array( $attributes ) ) {
			foreach ( $attributes as $key => $attribute ) {
				if (in_array($attribute->attribute_type, $attribute_type_keys)) {
					new \Zqe\Woo_Variable_Product_Swatches_Attribute_Meta( wc_attribute_taxonomy_name( $attribute->attribute_name ),  $fields[$attribute->attribute_type]);
				}
			}
		}
	}

	public function woocommerce_product_option_terms_action( $attribute_taxonomy, $i, $attribute ) {
		if ( in_array( $attribute_taxonomy->attribute_type, array_keys( $this->plugin->helper->attributes_types() ) ) ) {
			?>
			<select multiple="multiple" data-placeholder="<?php esc_attr_e( 'Select terms', 'woo-variation-swatches' ); ?>" class="multiselect attribute_values wc-enhanced-select" name="attribute_values[<?php echo esc_attr( $i ); ?>][]">
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
				<?php esc_html_e( 'Select all', 'woo-variation-swatches' ); ?>
			</button>
			<button class="button minus select_no_attributes">
				<?php esc_html_e( 'Select none', 'woo-variation-swatches' ); ?>
			</button>
			<?php
			$fields = $this->plugin->helper->attribute_meta_fields( $attribute_taxonomy->attribute_type );

			if ( ! empty( $fields ) ) { ?>
				<button disabled="disabled" class="button fr plus wvs_add_new_attribute" data-dialog_title="<?php printf( esc_html__( 'Add new %s', 'woo-variation-swatches' ), esc_attr( $attribute_taxonomy->attribute_label ) ) ?>">
					<?php esc_html_e( 'Add new', 'woo-variation-swatches' ); ?>
				</button>
			<?php } else { ?>
				<button class="button fr plus add_new_attribute">
					<?php esc_html_e( 'Add new', 'woo-variation-swatches' ); ?>
				</button>
			<?php } ?>
			<?php
		}
	}

	public function settings_menu() {
		add_menu_page( 'Swatches Settings', 'Swatches', 'manage_categories', 'woo-variable-product-swatches', array($this, 'settings_page') );
	}

	public function settings_init() {
		$this->plugin->option->core->admin_init();
	}

	public function settings_page() {
		echo '<div class="wrap">';
			echo '<h1>' . get_admin_page_title() . '</h1>';
			$this->show_navigation();
			$this->plugin->option->core->show_forms();
			echo '<a onclick="return confirm(\'Are you sure to reset current settings?\')" href="admin.php?page=woo-variable-product-swatches&action=reset">';
				echo esc_html( 'Reset all', 'woo-variation-swatches' );
			echo '</a>';
		echo '</div>';
	}

	public function show_navigation() {

		if ( count( $this->plugin->option->get_pages() ) === 1 ) {
			return;
		}

		echo '<h2 class="nav-tab-wrapper">';
		foreach ( $this->plugin->option->get_pages() as $page ) {
			echo sprintf( '<a href="admin.php?page=woo-variable-product-swatches&tab=%1$s" class="nav-tab %3$s" id="%1$s-tab">%2$s</a>', $page['id'], $page['title'], ( (isset($_GET['tab']) ? $_GET['tab'] : current($this->plugin->option->get_pages())['id']) === $page['id']) ? ' nav-tab-active': '');
		}
		echo '</h2>';
	}
}
