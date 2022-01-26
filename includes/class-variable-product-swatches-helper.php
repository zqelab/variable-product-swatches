<?php
namespace Zqe;

/**
 *
 * @link       https://github.com/zqe
 * @since      1.0.0
 *
 * @package    Variable_Product_Swatches
 * @subpackage Variable_Product_Swatches/includes
 */

/**
 *
 *
 * @since      1.0.0
 * @package    Variable_Product_Swatches
 * @subpackage Variable_Product_Swatches/includes
 * @author     ZQE <author@zqe.io>
 */
class Variable_Product_Swatches_Helper {

    /**
     * Attributes Types
     * 
     * @since    1.0.0
     */
	public static function attributes_types() {
        $types = array();
        $types['color'] = array(
            'title'   => esc_html__('Color', 'variable-product-swatches'),
        );
        $types['image'] = array(
            'title'   => esc_html__('Image', 'variable-product-swatches'),
        );
        $types['button'] = array(
            'title'   => esc_html__('Button', 'variable-product-swatches'),
        );
        $types['radio'] = array(
            'title'   => esc_html__('Radio', 'variable-product-swatches'),
        );
        return apply_filters('variable_product_swatches_available_attributes_types', $types);
	}
    
    /**
     * Attribute Term Meta Fields
     * 
     * @since    1.0.0
     */
    public function attribute_meta_fields($field_id = false) {
        $fields = array();
        $fields['color'] = array(
            array(
                'label' => esc_html__('Color', 'variable-product-swatches'), 
                'desc'  => esc_html__('Choose a color', 'variable-product-swatches'), 
                'id'    => 'product_attribute_color', 
                'type'  => 'color'
            )
        );
        $fields['image'] = array(
            array(
                'label' => esc_html__('Image', 'variable-product-swatches'), 
                'desc'  => esc_html__('Choose an Image', 'variable-product-swatches'), 
                'id'    => 'product_attribute_image', 
                'type'  => 'image'
            )
        );

        $fields = apply_filters( 'variable_product_swatches_attribute_meta_fields', $fields );

        if ( $field_id ) {
            return isset( $fields[ $field_id ] ) ? $fields [$field_id ] : array();
        }
        return $fields;
    }
    
    /**
     * Count Attribute
     * 
     * @since    1.0.0
     */
    public function attribute_counts( $attributes ){
        $attribute_counts = array();
        foreach ($attributes as $attr_key => $attr_values) {
            $attribute_counts[$attr_key] = count($attr_values);
        }
        return $attribute_counts;
    }
    
    /**
     * Assigned Image If Default Image
     * 
     * @since    1.0.0
     */
    public function assigned_image($args, $default_image_attribute){
        $product = $args['product'];
        $attributes = $product->get_variation_attributes();
        $variations = $product->get_available_variations();
        $selected_attribute_key = array_key_first($attributes);
        if ($default_image_attribute === '__last') {
            $selected_attribute_key = array_key_last($attributes);
        } 
        if ($default_image_attribute === '__max') {
            $selected_attribute_key = array_search(max($this->attribute_counts($attributes)), $attribute_counts);
        } 
        if ($default_image_attribute === '__min') {
            $selected_attribute_key = array_search(min($this->attribute_counts($attributes)), $attribute_counts);
        }
        $selected_attribute_name = wc_variation_attribute_name($selected_attribute_key);
        $current_attribute_key = $args['attribute'];
        $current_attribute_name = wc_variation_attribute_name($current_attribute_key);
        $assigned = array();
        foreach ($variations as $variation_key => $variation) {
            if (taxonomy_exists($args['attribute'])) {
                $attribute_value = esc_html($variation['attributes'][$selected_attribute_name]);
            } else {
                $attribute_value = isset($args['options'][$variation_key]) ? $args['options'][$variation_key] : '';
            }
            $assigned[$selected_attribute_name][$attribute_value] = array(
                'image_id'     => $variation['image_id'],
                'variation_id' => $variation['variation_id'],
            );
        }
        return (isset($assigned[$current_attribute_name]) ? $assigned[$current_attribute_name] : array());
    }
    


    /**
     *
     * @since    1.0.0
     */
    public function variation_attribute_options($args, $plugin) {
        
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


        echo $this->swatches_wrapper( $this->swatches_items($args, $plugin), $args, $plugin);
    }

    /**
     *
     * @since    1.0.0
     */
    public function swatches_items( $args, $plugin, $saved_attribute = array(), $html = '' ) {

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
                        $html .= $this->build_swatches_item($args, $option, $option_slug, $selected, $term_id, $plugin);
                    }
                }
            } else {
                foreach ($options as $option) {
                    $option = esc_html(apply_filters('woocommerce_variation_option_name', $option, null, $attribute, $product));
                    $selected = sanitize_title($args['selected']) === $args['selected'] ? selected($args['selected'], sanitize_title($option), false) : selected($args['selected'], $option, false);
                    $option_slug = $option;
                    $term_id = null;
                    $html .= $this->build_swatches_item($args, $option, $option_slug, $selected, $term_id, $plugin);
                }
            }
        }
        return $html;
    }

    /**
     *
     * @since    1.0.0
     */
    public function swatches_wrapper($contents, $args, $plugin) {

        $type = $args['attribute_type'];

        $classes = array();

        $image_default = $plugin->option->get( 'image_default' );
        $button_default = $plugin->option->get( 'button_default' );

        if ( apply_filters( 'variable_product_swatches_no_individual_settings', true, $args, $image_default, $button_default ) ) {

            $type = $args['attribute_type'];

            $classes[] = 'swatches-items-wrapper-'.$type;

            if( $type == 'image' ) {
                $style = $plugin->option->get('image_style');
            }
            if( $type == 'color' ) {
                $style = $plugin->option->get('color_style');
            }
            if( $type == 'radio' ) {
                $style = $plugin->option->get('radio_style');
            }
            if( $type == 'button' ) {
                $style = $plugin->option->get('button_style');
            }
            $classes[] = 'swatches-items-wrapper-'.$style;
        }


        $classes = apply_filters( 'variable_product_swatches_swatches_wrapper_class', $classes, $args);


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
    public function build_swatches_item($args, $option, $option_slug, $selected, $term_id, $plugin, $html = '') {

        $type = $args['attribute_type'];

        $product = $args['product'];
        $attribute = $args['attribute'];
        $assigned = isset($args['assigned']) ? $args['assigned'] : array();
        $name = $args['name'] ? $args['name'] : 'attribute_' . sanitize_title($attribute);

        $is_in_stock_any_variation = false;
        $is_in_stock = false;
        $variation_stock_count = 0;
        $variations    = $product->get_available_variations();
        
        $stockcount = $plugin->option->get('stockcount');

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
                $image_swatch_show_label = $plugin->option->get('image_swatch_show_label');

                if (isset($args['attribute_type_default']) && $args['attribute_type_default']) {
                    $attachment_id = $assigned[$option_slug]['image_id'];
                } else {
                    $attachment_id = absint( get_term_meta( $term_id, 'product_attribute_image', true ) );
                }
                $image = $this->swatch_image( $attachment_id, $option , $plugin);
                $html .= sprintf( '<span class="swatch-item-span swatch-item-span-%1$s">%2$s</span>%3$s', esc_attr( $type ), $image, ( $image_swatch_show_label  ? $label : '' ) );
                break;
            case 'color':
                $color_swatch_show_label = $plugin->option->get('color_swatch_show_label');
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


        return apply_filters('variable_product_swatches_build_swatches_item_html', $html, $args, $option, $option_slug, $selected, $term_id, $plugin);

    }

    /**
     *
     * @since    1.0.0
     */
    public function swatch_image($attachment_id, $option, $plugin) {

        $swatch_image_size = $plugin->option->get('image_swatch_size');
      
        $image = wp_get_attachment_image_src($attachment_id, $swatch_image_size);
        
        if( ! $image ) {
            $image = array( wc_placeholder_img_src(), '150', '150' );
        }

        return  sprintf('<img class="swatch-item-image" alt="%1$s" src="%2$s" width="%3$s" height="%4$s" />', esc_attr($option), esc_url($image[0]),esc_attr($image[1]),esc_attr($image[2]));
    }



    /**
     * 
     *
     * @since    1.0.0
     */
    public function  get_img_src( $thumbnail_id = false ) {
        if ( ! empty( $thumbnail_id ) ) {
            $image = wp_get_attachment_thumb_url( $thumbnail_id );
        } else {
            $image = function_exists('wc_placeholder_img_src') ? wc_placeholder_img_src() : null;
        }
        return $image;
    }


    /**
     *
     * @since    1.0.0
     */
    public function is_required_php_version() {
        return version_compare( PHP_VERSION, '5.6.0', '>=' );
    }

    /**
     *
     * @since    1.0.0
     */
    public function is_wc_active() {
        return class_exists( 'WooCommerce' );
    }

    /**
     *
     * @since    1.0.0
     */
    public function is_required_wc_version() {
        return version_compare( WC_VERSION, '3.2', '>' );
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function is_pro_active() {
        return class_exists( 'Variable_Product_Swatches_Pro' );
    }

    /**
     *
     * @since    1.0.0
     */
    public function clean_css( $inline_css ) {
        $inline_css = str_ireplace( array( '<style type="text/css">', '</style>' ), '', $inline_css );
        $inline_css = str_ireplace( array( "\r\n", "\r", "\n", "\t" ), '', $inline_css );
        $inline_css = preg_replace( "/\s+/", ' ', $inline_css );

        return trim( $inline_css );
    }




}
