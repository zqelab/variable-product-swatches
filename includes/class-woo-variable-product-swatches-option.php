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
class Woo_Variable_Product_Swatches_Option {

    public $core;


    public function __construct() {
        $this->core     = new \Zqe\Wp_Settings_Api();
        $this->core->set_name( 'testx' );
        $this->core->set_pages( $this->get_pages() );
        $this->core->set_defaults();
    }



    public function get($key) {
        return $this->core->get_option($key);
    }

    public function get_pages() {

        return array(
            array(
                'group' => 'basic_group',
                'id' => 'basic',
                'title' => 'Basic',
                'sections' => array(
                    array(
                        'id' => 'button',
                        'title' => 'Button Swatch',
                        'desc' => 'Button visual styles',
                        'fields' => array(
                            array(
                                'id'                => 'button_default',
                                'title'             => __( 'Button as Default', 'wedevs' ),
                                'desc'              => __( 'Convert default dropdowns to button', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => 'on',
                            ),
                            array(
                                'id'                => 'button_style',
                                'title'             => __( 'Button Shape', 'wedevs' ),
                                'desc'              => __( 'Attribute shape for button.', 'wedevs' ),
                                'type'              => 'radio',
                                'default'           => 'rounded',
                                'options'           => array(
                                    'rounded'           => 'Rounded Shape',
                                    'squared'           => 'Squared Shape'
                                )
                            ),

                        )
                    ),
                    array(
                        'id' => 'image',
                        'title' => 'Image Swatch',
                        'desc' => 'Image visual styles',
                        'fields' => array(
                            array(
                                'id'                => 'image_default',
                                'title'             => __( 'Image as Default ', 'wedevs' ),
                                'desc'              => __( 'Convert default dropdowns to image if variation has an image.', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => '',
                            ),

                            array(
                                'id'                => 'image_default_attribute',
                                'title'             => __( 'Default Image Attribute', 'wedevs' ),
                                'type'              => 'select',
                                'default'           => '__first',
                                'options'           => array(
                                    '__first'           => 'First attribute',
                                    '__max'             => 'Maximum attribute',
                                    '__min'             => 'Minimum attribute',
                                    '__last'            => 'Last attribute',
                                )
                            ),
                            array(
                                'id'                => 'image_swatch_size',
                                'title'             => __( 'Image Swatch Size ', 'wedevs' ),
                                'type'              => 'select',
                                'default'           => 'thumbnail',
                                'options'           => $this->get_all_image_sizes()
                            ),

                            array(
                                'id'                => 'image_swatch_width',
                                'title'             => __( 'Swatch Width', 'wedevs' ),
                                'desc'              => __( 'Swatch width', 'wedevs' ),
                                'type'              => 'number',
                                'size'              => 'small',
                                'default'           => '50',
                                'suffix'            => 'px'
                            ),
                            array(
                                'id'                => 'image_swatch_height',
                                'title'             => __( 'Swatch Height', 'wedevs' ),
                                'desc'              => __( 'Swatch height', 'wedevs' ),
                                'type'              => 'number',
                                'size'              => 'small',
                                'default'           => '50',
                                'suffix'            => 'px'
                            ),
                            array(
                                'id'                => 'image_style',
                                'title'             => __( 'Color Shape', 'wedevs' ),
                                'desc'              => __( 'Attribute shape.', 'wedevs' ),
                                'type'              => 'radio',
                                'default'           => 'rounded',
                                'options'           => array(
                                    'rounded'           => 'Rounded Shape',
                                    'squared'           => 'Squared Shape'
                                )
                            ),
                            array(
                                'id'                => 'image_swatch_show_label',
                                'title'             => __( 'Show Label', 'wedevs' ),
                                'desc'              => __( 'Show label color and image type swatch.', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => '',
                            )
                        )
                    ),
                    array(
                        'id' => 'color',
                        'title' => 'Color Swatch',
                        'desc' => 'Color visual styles',
                        'fields' => array(
                            array(
                                'id'                => 'color_swatch_width',
                                'title'             => __( 'Swatch Width', 'wedevs' ),
                                'desc'              => __( 'Swatch width', 'wedevs' ),
                                'type'              => 'number',
                                'size'              => 'small',
                                'default'           => '30',
                                'suffix'            => 'px',
                            ),
                            array(
                                'id'                => 'color_swatch_height',
                                'title'             => __( 'Swatch Height', 'wedevs' ),
                                'desc'              => __( 'Swatch height.', 'wedevs' ),
                                'type'              => 'number',
                                'size'              => 'small',
                                'default'           => '30',
                                'suffix'            => 'px'
                            ),
                            array(
                                'id'                => 'color_style',
                                'title'             => __( 'Swatch Shape', 'wedevs' ),
                                'desc'              => __( 'Attribute shape.', 'wedevs' ),
                                'type'              => 'radio',
                                'default'           => 'rounded',
                                'options' => array(
                                    'rounded'  => 'Rounded Shape',
                                    'squared'  => 'Squared Shape'
                                )
                            ),
                            array(
                                'id'                => 'color_swatch_show_label',
                                'title'             => __( 'Show Label', 'wedevs' ),
                                'desc'              => __( 'Show label color and image type swatch.', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => '',
                            )
                        )
                    ),

                    array(
                        'id' => 'radio',
                        'title' => 'Radio Swatch',
                        'desc' => 'Radio visual styles',
                        'fields' => array(
                            array(
                                'id'                => 'radio_style',
                                'title'             => __( 'Swatch Shape', 'wedevs' ),
                                'desc'              => __( 'Attribute shape.', 'wedevs' ),
                                'type'              => 'radio',
                                'default'           => 'rounded',
                                'options'           => array(
                                    'rounded'           => 'Rounded Shape',
                                    'squared'           => 'Squared Shape'
                                )
                            )
                        )
                    )
                )
            ),
            array(
                'id' => 'advanced',
                'title' => 'Advanced',
                'group' => 'advanced_group',
                'sections' => array(
                    array(
                        'id' => 'default',
                        'title' => 'Visual Section',
                        'desc' => 'Advanced change some visual styles',
                        'fields' => array(
                            array(
                                'id'                => 'threshold',
                                'title'             => __( 'Ajax Variation Threshold', 'wedevs' ),
                                'desc'              => __( 'Control the number of enable ajax variation threshold', 'wedevs' ),
                                'type'              => 'number',
                                'default'           => '30',
                            ),
                            array(
                                'id'                => 'attribute_behavior',
                                'title'             => __( 'Swatch Behavior', '' ),
                                'desc'              => __( 'Disabled attribute will be hide / blur.', '' ),
                                'type'              => 'radio',
                                'default'           => 'blur-cross',
                                'options'           => array(
                                    'blur-cross'        => 'Blur with cross',
                                    'blur-no-cross'     => 'Blur without cross',
                                    'hide'              => 'Hide'
                                )
                            ),
                            array(
                                'id'                => 'stockcount',
                                'title'             => __( 'Show Variation Stock', 'wedevs' ),
                                'desc'              => __( 'Show each variation stock and update according selected combination', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => '',
                            ),
                            array(
                                'id'                => 'clickable_disabled_variation',
                                'title'             => __( 'Clickable Disabled Variation', 'wedevs' ),
                                'desc'              => __( 'Enable click disable variation label beside the attribute label.', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => '',
                            ),
                            array(
                                'id'                => 'show_selected_variation',
                                'title'             => __( 'Show Selected Variation', 'wedevs' ),
                                'desc'              => __( 'Show selected variation label beside the attribute label.', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => '',
                            ),
                            array(
                                'id'                => 'clear_on_reselect',
                                'title'             => __( 'Clear Selected Variation', 'wedevs' ),
                                'desc'              => __( 'Clear selected variation on click.', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => '',
                            ),


                            array(
                                'id'                => 'label_separator',
                                'title'             => __( 'Label Separator', 'wedevs' ),
                                'desc'              => __( 'Attribute and variation label separator', 'wedevs' ),
                                'type'              => 'text',
                                'default'           => ':',
                            ),
                            array(
                                'id'                => 'tooltip',
                                'title'             => __( 'Enable Tooltip', 'wedevs' ),
                                'desc'              => __( 'Enable tooltip on each product attribute.', 'wedevs' ),
                                'type'              => 'checkbox',
                                'default'           => '',
                            ),
                            array(
                                'id'                => 'tooltip_placement',
                                'title'             => __( 'Tooltip Placement', 'wedevs' ),
                                'desc'              => __( 'Tooltip placement position. Applicable for image and color', 'wedevs' ),
                                'type'              => 'radio',
                                'default'           => 'top',
                                'options'           => array(
                                    'top'               => 'Top',
                                    'bottom'            => 'Bottom'
                                )
                            )
                        )
                    )
                )
            )
        );
    }

    public function get_all_image_sizes() {
        $image_subsizes = wp_get_registered_image_subsizes();
        return array_reduce( array_keys( $image_subsizes ), function ( $carry, $item ) use ( $image_subsizes ) {
            $title  = ucwords( str_ireplace( array( '-', '_' ), ' ', $item ) );
            $width  = $image_subsizes[ $item ]['width'];
            $height = $image_subsizes[ $item ]['height'];
            $carry[ $item ] = sprintf( '%s (%d &times; %d)', $title, $width, $height );
            return $carry;
        }, array() );
    }

}
