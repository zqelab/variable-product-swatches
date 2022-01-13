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

		wp_enqueue_script( $this->plugin->name, plugin_dir_url(__FILE__) . 'js/variable-product-swatches-public' . $suffix . '.js', array('jquery', 'wc-add-to-cart', 'wc-add-to-cart-variation'), $this->plugin->version, true );
		
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

		return $classes;
	}

    /**
     *
     * @since    1.0.0
     */
	public function woocommerce_dropdown_variation_attribute_options_html_filter($html, $args) {

		if ( isset( $_POST['action'] ) && $_POST['action'] === 'woocommerce_configure_bundle_order_item' ) {
			return $html;
		}

		$image_default = $this->plugin->option->get( 'image_default' );
		$button_default = $this->plugin->option->get( 'button_default' );

		if ( apply_filters( 'variable_product_swatches_no_individual_settings', true, $args, $image_default, $button_default ) ) {
			$args['attribute_type'] = 'select';
			if ( taxonomy_exists( $args['attribute'] ) ) {
				$args['attribute_type'] = wc_get_attribute( wc_attribute_taxonomy_id_by_name( $args['attribute'] ) )->type;
			}
			if ( ! in_array($args['attribute_type'], array_keys( $this->plugin->helper->attributes_types() ) ) ) {
				$args['attribute_type_default'] = true;
				if ( $image_default ) {

					$default_image_attribute =  $this->plugin->option->get( 'default_image_attribute' );

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

			if ( in_array( $args['attribute_type'], array_keys( $this->plugin->helper->attributes_types() ) ) ) {
				ob_start();
				$this->variation_attribute_options( $args );
				return ob_get_clean();
			} else {
				return $html;
			}
		}
		return $html;
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function variation_attribute_options($args) {
		
		$args = wp_parse_args(apply_filters('woocommerce_dropdown_variation_attribute_options_args', $args), array(
			'options' => false,
			'attribute' => false,
			'product' => false,
			'selected' => false,
			'name' => '',
			'id' => '',
			'class' => '',
			'show_option_none' => __('Choose an option', 'woocommerce'),
		));
		
		$type = $args['attribute_type'];
		$options = $args['options'];
		$product = $args['product'];
		$attribute = $args['attribute'];
		$name = $args['name'] ? $args['name'] : 'attribute_' . sanitize_title($attribute);
		$id = $args['id'] ? $args['id'] : sanitize_title($attribute);
		$class = $args['class'];
		$show_option_none = $args['show_option_none'] ? true : false;

		$show_option_none_text = $args['show_option_none'] ? $args['show_option_none'] : __('Choose an option', 'woocommerce'); // We'll do our best to hide the placeholder, but we'll need to show something when resetting options. 
		if (empty($options) && !empty($product) && !empty($attribute)) {
			$attributes = $product->get_variation_attributes();
			$options = $attributes[$attribute];
		}
		if ($type === 'select') {
			echo '<select id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" data-attribute_name="attribute_' . esc_attr(sanitize_title($attribute)) . '" data-show_option_none="' . ($show_option_none ? 'yes' : 'no') . '" class="' . esc_attr($class) . '">';
		} else {
			echo '<select id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" data-attribute_name="attribute_' . esc_attr(sanitize_title($attribute)) . '" data-show_option_none="' . ($show_option_none ? 'yes' : 'no') . '" class="' . esc_attr($class) . ' variable-product-swatches-raw-select variable-product-swatches-raw-type-' . esc_attr($type) . '" style="display:none;" >';
		}
		echo '<option value="">' . esc_html($show_option_none_text) . '</option>';
		if (!empty($options)) {
			if ($product && taxonomy_exists($attribute)) {
				$terms = wc_get_product_terms($product->get_id(), $attribute, array('fields' => 'all'));
				foreach ($terms as $term) {
					if (in_array($term->slug, $options)) {
						echo '<option value="' . esc_attr($term->slug) . '" ' . selected(sanitize_title($args['selected']), $term->slug, false) . '>' . esc_html(apply_filters('woocommerce_variation_option_name', $term->name, $term, $attribute, $product)) . '</option>';
					}
				}
			} else {
				foreach ($options as $option) {
					$selected = sanitize_title($args['selected']) === $args['selected'] ? selected($args['selected'], sanitize_title($option), false) : selected($args['selected'], $option, false);
					echo '<option value="' . esc_attr($option) . '" ' . $selected . '>' . esc_html(apply_filters('woocommerce_variation_option_name', $option, null, $attribute, $product)) . '</option>';
				}
			}
		}
		echo '</select>';
		echo $this->swatches_wrapper($this->swatches_items($args), $args);
	}

    /**
     *
     * @since    1.0.0
     */
	public function swatches_wrapper($contents, $args) {

		$type = $args['attribute_type'];

		$classes = array();

		$classes[] = 'swatches-items-wrapper-'.$type;

		if( $type == 'image' ) {
			$classes[] = 'swatches-items-wrapper-'.$this->plugin->option->get('image_style');
		}

		if( $type == 'color' ) {
			$classes[] = 'swatches-items-wrapper-'.$this->plugin->option->get('color_style');
		}

		if( $type == 'radio' ) {
			$classes[] = 'swatches-items-wrapper-'.$this->plugin->option->get('radio_style');
		}

		if( $type == 'button' ) {
			$classes[] = 'swatches-items-wrapper-'.$this->plugin->option->get('button_style');
		}

		$attribute = $args['attribute'];

		$options = $args['options'];

		return sprintf(
			'<ul class="swatches-items-wrapper %1$s" data-attribute_name="%2$s" data-attribute_values="%3$s">%4$s</ul>',
			trim(implode(' ', array_unique($classes))),
			esc_attr(wc_variation_attribute_name($attribute)),
			wc_esc_json(wp_json_encode(array_values($options))),
			$contents
		);
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function swatches_items( $args, $saved_attribute = array(), $html = '' ) {

		$options = $args['options'];
		$product = $args['product'];
		$attribute = $args['attribute'];

		if (!empty($options)) {
			if ($product && taxonomy_exists($attribute)) {
				$terms = wc_get_product_terms($product->get_id(), $attribute, array('fields' => 'all'));
				foreach ($terms as $term) {
					if (in_array($term->slug, $options)) {
						$option = esc_html(apply_filters('woocommerce_variation_option_name', $term->name, $term, $attribute, $product));
						$selected = selected(sanitize_title($args['selected']), $term->slug, false);
						$option_slug = $term->slug;
						$term_id = $term->term_id;
						$html .= $this->build_swatches_item($args, $option, $option_slug, $selected, $term_id);
					}
				}
			} else {
				foreach ($options as $option) {
					$option = esc_html(apply_filters('woocommerce_variation_option_name', $option, null, $attribute, $product));
					$selected = sanitize_title($args['selected']) === $args['selected'] ? selected($args['selected'], sanitize_title($option), false) : selected($args['selected'], $option, false);
					$option_slug = $option;
					$term_id = null;
					$html .= $this->build_swatches_item($args, $option, $option_slug, $selected, $term_id);
				}
			}
		}
		return $html;
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function build_swatches_item($args, $option, $option_slug, $selected, $term_id, $html = '') {


		$type = $args['attribute_type'];
		$product = $args['product'];
		$attribute = $args['attribute'];
		$assigned = isset($args['assigned']) ? $args['assigned'] : array();
		$name = $args['name'] ? $args['name'] : 'attribute_' . sanitize_title($attribute);
		
		$is_in_stock_any_variation = false;
		$is_in_stock = false;
		$variation_stock_count = 0;
		$variations    = $product->get_available_variations();
		
		$stockcount = $this->plugin->option->get('stockcount');
		$get_variations = count( $product->get_children() ) <= apply_filters( 'woocommerce_ajax_variation_threshold', 30, $product );
		$available_variations = $get_variations ? $product->get_available_variations() : array();

		foreach ($variations as $variation) {
			if ($variation['is_in_stock']) {
				$is_in_stock_any_variation = true;
			}
			if (($variation['attributes'][$name] == $option_slug && $variation['is_in_stock']) || (!$variation['attributes'][$name] && $is_in_stock_any_variation)) {
				$variationObj = wc_get_product($variation['variation_id']);
				$variation_stock_count += $variationObj->get_stock_quantity();
				$is_in_stock = true;
			}
		}

		$label = sprintf( '<span class="swatch-item-span-label">%1$s</span>', $option );

		$html .= sprintf( '<li class="swatch-item swatch-item-%1$s swatch-item-%1$s-%2$s %3$s %4$s" title="%5$s" data-title="%5$s" data-value="%2$s" >', esc_attr( $type ), esc_attr( $option_slug ), esc_attr( $selected ? 'swatch-item-selected' : '' ), esc_attr( ( ! $is_in_stock ) ? 'swatch-item-disabled' : '' ), $option );
		$html .= sprintf( '<div class="swatch-item-wrapper">');
		switch ( $type ) {
			case 'image':
				$image_swatch_show_label = $this->plugin->option->get('image_swatch_show_label');

				if (isset($args['attribute_type_default'])) {
					$attachment_id = $assigned[$option_slug]['image_id'];
				} else {
					$attachment_id = absint( get_term_meta( $term_id, 'product_attribute_image', true ) );
				}
				$image = $this->swatch_image( $attachment_id, $option );
				$html .= sprintf( '<span class="swatch-item-span swatch-item-span-%1$s">%2$s</span>%3$s', esc_attr( $type ), $image, ( $image_swatch_show_label  ? $label : '' ) );
				break;
			case 'color':
				$color_swatch_show_label = $this->plugin->option->get('color_swatch_show_label');
				$color = sanitize_hex_color(get_term_meta($term_id, 'product_attribute_color', true));
				$html .= sprintf( '<span class="swatch-item-span swatch-item-span-%1$s" style="background-color:%2$s;"></span>%3$s', esc_attr( $type ), esc_html( $color ), ( $color_swatch_show_label  ? $label : '' ) );
				break;
			case 'button':
				$html .= sprintf( '<span class="swatch-item-span swatch-item-span-%1$s">%2$s</span>', esc_attr( $type ), esc_html( $option ) );
				break;
			case 'radio':
				$html .= sprintf( '<span class="swatch-item-span swatch-item-span-%1$s"></span><span class="swatch-item-span-label">%2$s</span>', esc_attr( $type ), esc_html( $option ) );
				if( $available_variations && $stockcount) {
					$html .= sprintf( '<span class="swatch-item-stock-count">%1$s left</span>', $variation_stock_count );
				}
				break;
			default:
				break;
		}
		$html .= sprintf( '</div>');
		if( $available_variations && $stockcount && $type != 'radio') {
			$html .= sprintf( '<span class="swatch-item-stock-count">%1$s left</span>', $variation_stock_count );
		}
		$html .= sprintf( '</li>');

		return $html;
	}
    
    /**
     *
     * @since    1.0.0
     */
	public function swatch_image($attachment_id, $option) {
		$swatch_image_size = $this->plugin->option->get('image_swatch_size');
      

		$image = wp_get_attachment_image_src($attachment_id, $swatch_image_size);
		
		if( ! $image ) {
			$image = array( wc_placeholder_img_src(), '', '' );
		}

		return  sprintf('<img class="swatch-item-image" alt="%1$s" src="%2$s" width="%3$s" height="%4$s" />', esc_attr($option), esc_url($image[0]),esc_attr($image[1]),esc_attr($image[2]));
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