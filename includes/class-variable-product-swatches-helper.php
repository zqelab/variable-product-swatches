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
        return apply_filters('vps_available_attributes_types', $types);
	}
    
    /**
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
        
        $fields = apply_filters('variable_product_swatches_attribute_meta_fields', $fields);

        if ( $field_id ) {
            return isset( $fields[ $field_id ] ) ? $fields [$field_id ] : array();
        }
        return  $fields;
    }
    
    /**
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
     *
     * @since    1.0.0
     */
    public function assigned_image($args, $default_image_attribute) {
        $product = $args['product'];
        $attributes = $product->get_variation_attributes();
        $current_attribute_key = $args['attribute'];

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
        $current_attribute_name = wc_variation_attribute_name($current_attribute_key);
        $selected_attribute_name = wc_variation_attribute_name($selected_attribute_key);


        $variations = $product->get_available_variations();
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
    public function clean_css( $inline_css ) {
        $inline_css = str_ireplace( array( '<style type="text/css">', '</style>' ), '', $inline_css );
        $inline_css = str_ireplace( array( "\r\n", "\r", "\n", "\t" ), '', $inline_css );
        $inline_css = preg_replace( "/\s+/", ' ', $inline_css );

        return trim( $inline_css );
    }

    /**
     *
     * @since    1.0.0
     */
    public function get_img_src($thumbnail_id = false) {
        if (!empty($thumbnail_id)) {
            $image = wp_get_attachment_thumb_url($thumbnail_id);
        } else {
            $image = $this->placeholder_img_src();
        }
        return $image;
    }

    /**
     *
     * @since    1.0.0
     */
    public function placeholder_img_src() {
        return function_exists('wc_placeholder_img_src') ? wc_placeholder_img_src() : null;
    }
}
