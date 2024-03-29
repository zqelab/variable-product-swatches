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

		wp_enqueue_style( 
			$this->plugin->name, 
			plugin_dir_url( __FILE__ ) . 'css/variable-product-swatches-admin' . $suffix . '.css', 
			array(), 
			$this->plugin->version, 
			'all' 
		);
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
		
		wp_enqueue_media();

		wp_enqueue_script( 
			$this->plugin->name, 
			plugin_dir_url( __FILE__ ) . 'js/variable-product-swatches-admin' . $suffix . '.js', 
			array( 'jquery', 'wp-color-picker' ), 
			$this->plugin->version, 
			false 
		);
		
		wp_localize_script( $this->plugin->name, '_VPS', array(
			'media_title' 		=> esc_html__( 'Choose an Image', 'variable-product-swatches' ),
			'dialog_title' 		=> esc_html__( 'Add Attribute', 'variable-product-swatches' ),
			'dialog_save' 		=> esc_html__( 'Add', 'variable-product-swatches' ),
			'dialog_cancel' 	=> esc_html__( 'Cancel', 'variable-product-swatches' ),
			'button_title' 		=> esc_html__( 'Use Image', 'variable-product-swatches' ),
			'add_media' 		=> esc_html__( 'Add Media', 'variable-product-swatches' ),
			'placeholder_img' 	=> function_exists('wc_placeholder_img_src') ? wc_placeholder_img_src() : null,
			'ajaxurl' 			=> esc_url( admin_url( 'admin-ajax.php', 'relative' ) ),
			'nonce' 			=> wp_create_nonce( 'wvs_plugin_nonce' ),
		) );
	}
    

	/**
	 * Function for `product_attributes_type_selector` filter-hook.
	 * 
	 * @param  $array 
	 *
	 * @return 
	 */
	public function product_attributes_type_selector_filter( $selector ) {
		foreach ( $this->plugin->helper->attribute_types() as $key => $options ) {
			$selector[ $key ] = $options['title'];
		}
		return $selector;
	}
    
    /**
     * Add meta fields to attribute.
     * 
     * @since    1.0.0
     */
	public function add_attribute_meta() {  
		
		$fields  				= $this->plugin->get_helper()->attribute_meta_fields();
		$attribute_type_keys 	= array_keys($fields);
		$attributes 			= function_exists('wc_get_attribute_taxonomies') ? wc_get_attribute_taxonomies() : array();
		
		if ( $attributes && is_array( $attributes ) ) {
			foreach ( $attributes as $key => $attribute ) {
				if (in_array($attribute->attribute_type, $attribute_type_keys)) {
					new \Zqe\Wp_Term_Meta( wc_attribute_taxonomy_name( $attribute->attribute_name ), 'product', $fields[$attribute->attribute_type]);
				}
			}
		}
	}
    
	/**
	 * Function for `woocommerce_product_option_terms` action-hook.
	 * 
	 * @param  $attribute_taxonomy 
	 * @param  $i
	 * @param  $attribute
	 *
	 * @return void
	 */
	public function woocommerce_product_option_terms_action( $attribute_taxonomy, $i, $attribute ) {
		if ( 'select' !== $attribute_taxonomy->attribute_type && in_array( $attribute_taxonomy->attribute_type, array_keys( $this->plugin->get_helper()->attribute_types() ) ) ) {
			?>
			<select multiple="multiple" data-placeholder="<?php esc_attr_e( 'Select terms', 'woocommerce' ); ?>" class="multiselect attribute_values wc-enhanced-select" name="attribute_values[<?php echo esc_attr( $i ); ?>][]">
				<?php
				$args      = array(
					'orderby'    => ! empty( $attribute_taxonomy->attribute_orderby ) ? $attribute_taxonomy->attribute_orderby : 'name',
					'hide_empty' => 0,
				);
				$all_terms = get_terms( $attribute->get_taxonomy(), apply_filters( 'woocommerce_product_attribute_terms', $args ) );
				if ( $all_terms ) {
					foreach ( $all_terms as $term ) {
						$options = $attribute->get_options();
						$options = ! empty( $options ) ? $options : array();
						echo '<option value="' . esc_attr( $term->term_id ) . '"' . wc_selected( $term->term_id, $options ) . '>' . esc_html( apply_filters( 'woocommerce_product_attribute_term_name', $term->name, $term ) ) . '</option>';
					}
				}
				?>
			</select>
			<button class="button plus select_all_attributes"><?php esc_html_e( 'Select all', 'woocommerce' ); ?></button>
			<button class="button minus select_no_attributes"><?php esc_html_e( 'Select none', 'woocommerce' ); ?></button>
			<button class="button fr plus add_new_attribute"><?php esc_html_e( 'Add new', 'woocommerce' ); ?></button>
			<?php
		}
	}
	
	/**
	 * @since    1.0.0
	 */
	public function zqe_manage_edit_taxonomy_columns_filter( $columns ) {
		
		$new = array();
		
		if ( isset( $columns[ 'cb' ] ) ) {
			$new[ 'cb' ] = $columns[ 'cb' ];
		}
		
		$new[ 'variable-product-swatches-meta' ] = esc_html__( 'Preview', 'variation-swatches-and-gallery' );
		
		if ( isset( $columns[ 'cb' ] ) ) {
			unset( $columns[ 'cb' ] );
		}

		return array_merge( $new, $columns );
	}

	/**
	 * @since    1.0.0
	 */
	public function zqe_manage_taxonomy_custom_column_filter( $columns, $column, $term_id ) {
		
		if ( 'variable-product-swatches-meta' !== $column ) {
			return $columns;
		}

		$term = get_term( $term_id );

        $attribute = wc_get_attribute( wc_attribute_taxonomy_id_by_name( $term->taxonomy ) );

        if( $attribute->type == 'color' ){
            $value = sanitize_hex_color( get_term_meta( $term_id, 'product_attribute_color', true ) );
            printf('<div class="variable-product-swatches-meta-preview" style="background-color:%s;"></div>', 
                esc_attr( $value ) 
            );
        }
        
        if( $attribute->type =='image' ){
            $attachment_id = absint( get_term_meta( $term_id,  'product_attribute_image', true ) );
            $image         = wp_get_attachment_image_src( $attachment_id, 'thumbnail' );
            if ( is_array( $image ) ) {
                printf( 
                    '<img src="%s" alt="" width="%d" height="%d" class="variable-product-swatches-meta-preview" />', 
                    esc_url( $image[0] ), 
                    $image[1], 
                    $image[2] 
                );
            }
        }

		return $columns;
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
	public function settings_menu() {
		add_menu_page( 
			'Swatches Settings', 
			'Swatches', 
			'manage_categories', 
			'variable-product-swatches', 
			array($this, 'settings_page'), 
			'data:image/svg+xml;base64,'.base64_encode(
			'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path xmlns="http://www.w3.org/2000/svg" d="m265.710938 342-65.710938 53-43.429688 87h345.429688v-140c-22.867188 0-226.871094 0-236.289062 0zm0 0" fill="#ff5284" data-original="#ff5284"></path><path xmlns="http://www.w3.org/2000/svg" d="m328.390625 81.328125c-15.546875 15.550781-143.566406 143.570313-158.390625 158.390625l-22 138.28125 43.609375 38.101562c6.734375-6.734374 225.71875-225.71875 235.769531-235.773437zm0 0" fill="#a0e4f8" data-original="#a0e4f8" class=""></path><path xmlns="http://www.w3.org/2000/svg" d="m30 10v345.429688h140s0-337.949219 0-345.429688zm0 0" fill="#FFE35C" data-original="#FFE35C" class=""></path><path xmlns="http://www.w3.org/2000/svg" d="m190 412c0 49.710938-40.296875 90-90 90-49.710938 0-90-40.289062-90-90 0-49.570312 40.164062-90 90-90 49.757812 0 90 40.351562 90 90zm0 0" fill="#ffffff" data-original="#ffffff"></path><path xmlns="http://www.w3.org/2000/svg" d="m100 362c27.570312 0 50 22.421875 50 50s-22.429688 50-50 50-50-22.421875-50-50 22.429688-50 50-50zm0 0" fill="#425072" data-original="#425072"></path><path xmlns="http://www.w3.org/2000/svg" d="m436 412c5.519531 0 10-4.480469 10-10s-4.480469-10-10-10-10 4.480469-10 10 4.480469 10 10 10zm0 0" fill="#000000" data-original="#000000" class=""></path><path xmlns="http://www.w3.org/2000/svg" d="m100 352c-33.085938 0-60 26.914062-60 60s26.914062 60 60 60 60-26.914062 60-60-26.914062-60-60-60zm0 100c-22.054688 0-40-17.945312-40-40s17.945312-40 40-40 40 17.945312 40 40-17.945312 40-40 40zm0 0" fill="#000000" data-original="#000000" class=""></path><path xmlns="http://www.w3.org/2000/svg" d="m502 332h-212.148438l144.597657-144.597656c3.90625-3.90625 3.90625-10.238282 0-14.144532l-98.988281-99c-1.875-1.875-4.417969-2.929687-7.070313-2.929687s-5.195313 1.054687-7.070313 2.929687l-141.320312 141.320313v-205.578125c0-5.523438-4.476562-10-10-10h-140c-5.523438 0-10 4.476562-10 10v342.015625c-12.914062 17.210937-20 38.367187-20 59.984375 0 55.140625 44.859375 100 100 100 21.617188 0 42.773438-7.085938 59.984375-20h342.015625c5.523438 0 10-4.476562 10-10v-140c0-5.523438-4.476562-10-10-10zm-244.320312-165.816406 84.847656 84.855468-70.707032 70.707032-84.859374-84.847656zm-59.140626 228.84375c-2.683593-15.550782-9.035156-30.347656-18.539062-43.011719v-93.792969l77.675781 77.667969zm-158.539062-163.027344v-106h120v106zm0 20h120v79.976562c-17.125-12.875-38.042969-19.976562-60-19.976562s-42.875 7.101562-60 19.976562zm159.453125 170.398438 60.546875-60.546876v110.148438h-80.011719c10.8125-14.40625 17.601563-31.546875 19.464844-49.601562zm80.546875-70.398438h106v120h-106zm48.390625-256.527344 84.847656 84.855469-56.566406 56.570313-84.847656-84.859376zm-168.390625-75.472656v86h-120v-86zm-140 392c0-44.445312 36.019531-80 80-80 44.546875 0 80 36.167969 80 80 0 43.617188-35.253906 80-80 80-44.113281 0-80-35.886719-80-80zm472 60h-46v-30c0-5.523438-4.476562-10-10-10s-10 4.476562-10 10v30h-20v-120h86zm0 0" fill="#000000" data-original="#000000" class=""></path></g></svg>')
		);
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
			echo sprintf( 
				'<a href="admin.php?page=variable-product-swatches&tab=%1$s" class="nav-tab %3$s" id="%1$s-tab">%2$s</a>', 
				$page['id'], 
				$page['title'], 
				( (isset($_GET['tab']) ? $_GET['tab'] : current($this->plugin->option->get_pages())['id']) === $page['id']) ? ' nav-tab-active': ''
			);
		}
		echo '</h2>';
	}
    
    /**
     * Add plugin documentation and support link to plugin row_meta.
     * 
     * @since    1.0.0
     */
	public function plugin_row_meta( $links, $file ) {
		if ( $file == $this->plugin->get_basename() ) {
			$report_url = esc_url( 'https://zqe.io/tickets/' );
			$documentation_url = esc_url( 'https://zqe.io/docs/variable-product-swatches-documentation/' );
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
     * Add plugin pro addon link to plugin action_links.
     * 
     * @since    1.0.0
     * 
     * @param $links
     * @return $links
     */
	public function plugin_action_links( $links ) {
		$new_links = array();
		$pro_link = esc_url( 'https://zqe.io/variable-product-swatches/' );
		if ( ! $this->plugin->helper->is_pro_active() ) {
			$new_links['go-pro'] = sprintf( 
				'<a target="_blank" style="color: #45b450; font-weight: bold;" href="%1$s" title="%2$s">%2$s</a>', 
				esc_url( $pro_link ), 
				esc_attr__( 'Go Pro', 'variable-product-swatches' ) 
			);
		}
		return array_merge( $links, $new_links );
	}
}
