<?php
namespace Zqe;

/**
 *
 * @link       https://github.com/zqe
 * @since      1.0.0
 *
 * @package    Woo_Variable_Product_Swatches
 * @subpackage Woo_Variable_Product_Swatches/includes
 */

/**
 *
 *
 * @since      1.0.0
 * @package    Woo_Variable_Product_Swatches
 * @subpackage Woo_Variable_Product_Swatches/includes
 * @author     ZQE <author@zqe.io>
 */
class Woo_Variable_Product_Swatches_Helper {

	public static function attributes_types() {
        $types = array();
        $types['color'] = array(
            'title'   => esc_html__('Color', 'woo-variation-swatches'),
        );
        $types['image'] = array(
            'title'   => esc_html__('Image', 'woo-variation-swatches'),
        );
        $types['button'] = array(
            'title'   => esc_html__('Button', 'woo-variation-swatches'),
        );
        $types['radio'] = array(
            'title'   => esc_html__('Radio', 'woo-variation-swatches'),
        );
        return apply_filters('wvps_available_attributes_types', $types);
	}

    public function attribute_meta_fields($field_id = false) {
        $fields = array();
        $fields['color'] = array(
            array(
                'label' => esc_html__('Color', 'woo-variation-swatches-and-gallery'), 
                'desc'  => esc_html__('Choose a color', 'woo-variation-swatches-and-gallery'), 
                'id'    => 'product_attribute_color', 
                'type'  => 'color'
            )
        );
        $fields['image'] = array(
            array(
                'label' => esc_html__('Image', 'woo-variation-swatches-and-gallery'), 
                'desc'  => esc_html__('Choose an Image', 'woo-variation-swatches-and-gallery'), 
                'id'    => 'product_attribute_image', 
                'type'  => 'image'
            )
        );
        if ( $field_id ) {
            return isset( $fields[ $field_id ] ) ? $fields [$field_id ] : array();
        }
        return $fields;
    }

    public function attribute_counts( $attributes ){
        $attribute_counts = array();
        foreach ($attributes as $attr_key => $attr_values) {
            $attribute_counts[$attr_key] = count($attr_values);
        }
        return $attribute_counts;
    }

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
    public function clean_css( $inline_css ) {
        $inline_css = str_ireplace( array( '<style type="text/css">', '</style>' ), '', $inline_css );
        $inline_css = str_ireplace( array( "\r\n", "\r", "\n", "\t" ), '', $inline_css );
        $inline_css = preg_replace( "/\s+/", ' ', $inline_css );

        return trim( $inline_css );
    }
}
