<?php
namespace Zqe;

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://github.com/zqelab
 * @since      1.0.0
 *
 * @package    Variable_Product_Swatches
 * @subpackage Variable_Product_Swatches/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Variable_Product_Swatches
 * @subpackage Variable_Product_Swatches/public
 * @author     ZQE <dev@zqe.io>
 */
class Variable_Product_Swatches_Public {

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
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin->name, plugin_dir_url(__FILE__) . 'css/variable-product-swatches-public' . $suffix . '.css', array(), $this->plugin->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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
		
		$dep = ['jquery'];

		if('yes' === get_option('woocommerce_enable_ajax_add_to_cart')) {
			array_push($dep, 'wc-add-to-cart');
			array_push($dep, 'wc-add-to-cart-variation');
		}

		wp_enqueue_script( 
			$this->plugin->name, 
			plugin_dir_url(__FILE__) . 'js/variable-product-swatches-public' . $suffix . '.js', 
			$dep, 
			$this->plugin->version, 
			true 
		);
		
		wp_localize_script( $this->plugin->name, '_VPS', array(
			'option' => $this->plugin->option->get(),
		) );

		$image_swatch_width     = $this->plugin->option->get( 'image_swatch_width');
		$image_swatch_height    = $this->plugin->option->get( 'image_swatch_height');
		$color_swatch_width     = $this->plugin->option->get( 'color_swatch_width');
		$color_swatch_height    = $this->plugin->option->get( 'color_swatch_height');

		ob_start();
		?>
		<style type="text/css">
			ul.swatches-items-wrapper>li.swatch-item.swatch-item-image .swatch-item-span {
		        width  : <?php echo esc_html($image_swatch_width); ?>px;
		        height : <?php echo esc_html($image_swatch_height); ?>px;
		    }
		    ul.swatches-items-wrapper>li.swatch-item.swatch-item-color .swatch-item-span {
		        width  : <?php echo esc_html($color_swatch_width); ?>px;
		        height : <?php echo esc_html($color_swatch_height); ?>px;
		    }
		</style>
		<?php
		$css = ob_get_clean();
		$css = $this->plugin->helper->clean_css( $css );
		wp_add_inline_style( $this->plugin->name, $css );

	}
    
    /**
     *
     * @since    1.0.0
     */
	public function body_class( $classes ) {

		$classes[] = 'variable-product-swatches';

		$show_selected_attribute = $this->plugin->option->get('show_selected_variation');
		if ( $show_selected_attribute ) {
			$classes[] = 'variable-product-swatches-show-selected-attribute';
		}

		$clickable_disabled_variation = $this->plugin->option->get('clickable_disabled_variation');
		if ( $clickable_disabled_variation ) {
			$classes[] = 'variable-product-swatches-clickable-disabled-attribute';
		}

		$stockcount = $this->plugin->option->get('stockcount');
		if ( $stockcount ) {
			$classes[] = 'variable-product-swatches-stockcount';
		}

		$attribute_behavior = $this->plugin->option->get('attribute_behavior');
		if ( $attribute_behavior ) {
			$classes[] = 'variable-product-swatches-' . esc_attr($attribute_behavior);
		}

		return apply_filters('variable_product_swatches_body_class', array_unique($classes));
	}

    /**
     *
     * @since    1.0.0
     */
	public function woocommerce_dropdown_variation_attribute_options_html_filter($html, $args) {
		
		if ( isset( $_POST['action'] ) && $_POST['action'] === 'woocommerce_configure_bundle_order_item' ) {
			return $html;
		}
		


		if ( apply_filters( 'variable_product_swatches_default_variation_attribute_options_html', false, $args, $html ) ) {
			return $html;
		}

		// WooCommerce Product Bundle Fixing
		if ( isset( $_POST['action'] ) && $_POST['action'] === 'woocommerce_configure_bundle_order_item' ) {
			return $html;
		}




		
		$image_default = apply_filters( 'variable_product_swatches_image_default', ! ! ( $this->plugin->option->get( 'image_default' ) ), $args );
		$button_default = apply_filters( 'variable_product_swatches_button_default', ! ! ( $this->plugin->option->get( 'button_default' ) ), $args );
		$args['attribute_type'] = 'select';
		
		if ( taxonomy_exists( $args['attribute'] ) ) {
			$args['attribute_type'] = wc_get_attribute( wc_attribute_taxonomy_id_by_name( $args['attribute'] ) )->type;
		}
		
		$args['attribute_type_default'] = false;
		
		if ( ! in_array($args['attribute_type'], array_keys( $this->plugin->helper->attributes_types() ) ) ) {
			$args['attribute_type_default'] = true;
			if ( $image_default ) {
				$default_image_attribute = apply_filters( 'variable_product_swatches_default_image_attribute', $this->plugin->option->get( 'default_image_attribute' ), $args );
				$assigned = $this->plugin->helper->assigned_image( $args, $default_image_attribute );
				if ( ! empty( $assigned ) ) {
					$args['assigned'] = $assigned;
					$args['attribute_type'] = 'image';
				}
			}
			if ( $button_default ) {
				if ( ! isset( $args['assigned'] ) ) {
					$args['attribute_type'] = 'button';
				}
			}
		}
		
		if ( apply_filters( 'variable_product_swatches_no_individual_settings', true, $args, $image_default, $button_default ) ) {
			if ( in_array( $args['attribute_type'], array_keys( $this->plugin->helper->attributes_types() ) ) ) {
				ob_start();
				$this->plugin->helper->variation_attribute_options( $args, $this->plugin);
				return ob_get_clean();
			} else {
				return $html;
			}
		}

		return apply_filters( 'variable_product_swatches_variation_attribute_options_html', $html, $args );
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function woocommerce_variation_is_active_filter($active, $variation) {
		if ( ! $variation->is_in_stock() ) {
			return false;
		}
		return $active;
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function woocommerce_ajax_variation_threshold_filter() {
		return $this->plugin->option->get('threshold') ? $this->plugin->option->get('threshold') : 30 ;
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function woocommerce_available_variation_filter($data, $obj, $variation) {
		$data['stock_quantity'] = $variation->get_stock_quantity();
		return $data;
	}
}