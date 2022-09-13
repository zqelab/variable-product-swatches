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
class Variable_Product_Swatches_Option {

	/**
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      \Zqe\Wp_Settings_Api    $core    Maintains and registers all hooks for the plugin.
	 */
    public $core;

	/**
	 *
	 * @since    1.0.0
	 */
    public function __construct() {
        $this->core     = new \Zqe\Wp_Settings_Api();
        //set the settings
        
        $this->core->set_name( $this->name() );
        $this->core->set_page( $this->page() );

        $this->core->set_tabs( $this->tabs() );
        $this->core->set_sections( $this->sections() );
        $this->core->set_fields( $this->fields() );
        $this->core->set_defaults( );
    }

    /**
     * Register all of the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   public
     */
    public function name() {
        return 'variable_product_swatches';
    }
    /**
     * Register all of the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   public
     */
    public function page() {
        return 'variable-product-swatches';
    }

	/**
	 *
	 * @since    1.0.0
	 */
    public function get( $key = false ) {
        
        return $this->core->get_option( $key );
    }
    /**
     * Register all of the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   public
     */
    public function tabs() {
        $tabs = array(
            array(
                'id'    => 'basic',
                'title' => __( 'Basic', 'variable-product-swatches' )
            ),
            array(
                'id'    => 'advanced',
                'title' => __( 'Advanced', 'variable-product-swatches' )
            )
        );
        return apply_filters('variable_product_swatches_option_tabs', $tabs);
    }


    /**
     * Register all of the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   public
     */
    public function sections() {
        $sections = array(
            'basic' => array(
                array(
                    'id' => 'button',
                    'title' => 'Button Swatch',
                    'desc' => 'Button visual styles',
                ), 
                array(
                    'id' => 'image',
                    'title' => 'Image Swatch',
                    'desc' => 'Image visual styles',
                ), 
                array(
                    'id' => 'color',
                    'title' => 'Color Swatch',
                    'desc' => 'Color visual styles',
                ),            
                array(
                    'id' => 'radio',
                    'title' => 'Radio Swatch',
                    'desc' => 'Radio visual styles',
                ),
            ),
            'advanced' => array(
                array(
                    'id' => 'default',
                    'title' => 'Visual Section',
                    'desc' => 'Advanced change some visual styles',
                ),
                array(
                    'id' => 'ajax',
                    'title' => 'Ajax Section',
                    'desc' => 'Advanced change some visual styles',
                ),
                array(
                    'id' => 'performance',
                    'title' => 'Performance Section',
                    'desc' => 'Change for Performance',
                ),
            ),

        );
        return apply_filters('variable_product_swatches_option_sections', $sections);

    }

    /**
     * Register all of the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   public
     */
    public function fields() {
        $fields = array(
            'basic' => array(
                'button' => array(
                    array(
                        'name'                => 'button_default',
                        'label'             => __( 'Button as Default', 'variable-product-swatches' ),
                        'desc'              => __( 'Convert default dropdowns to button', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => true,
                    ),
                    array(
                        'name'                => 'button_style',
                        'label'             => __( 'Button Shape', 'variable-product-swatches' ),
                        'desc'              => __( 'Attribute shape for button.', 'variable-product-swatches' ),
                        'type'              => 'radio',
                        'default'           => 'rounded',
                        'options'           => array(
                            'rounded'           => 'Rounded Shape',
                            'squared'           => 'Squared Shape'
                        )
                    ),
                ),
                'image' => array(
                    array(
                        'name'                => 'image_default',
                        'label'             => __( 'Image as Default ', 'variable-product-swatches' ),
                        'desc'              => __( 'Convert default dropdowns to image if variation has an image.', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => false,
                    ),

                    array(
                        'name'                => 'image_default_attribute',
                        'label'             => __( 'Default Image Attribute', 'variable-product-swatches' ),
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
                        'name'                => 'image_swatch_size',
                        'label'             => __( 'Image Swatch Size ', 'variable-product-swatches' ),
                        'type'              => 'select',
                        'default'           => 'thumbnail',
                        'options'           => $this->get_all_image_sizes()
                    ),

                    array(
                        'name'                => 'image_swatch_width',
                        'label'             => __( 'Swatch Width', 'variable-product-swatches' ),
                        'desc'              => __( 'Swatch width', 'variable-product-swatches' ),
                        'type'              => 'number',
                        'size'              => 'small',
                        'default'           => '50',
                        'suffix'            => 'px'
                    ),
                    array(
                        'name'                => 'image_swatch_height',
                        'label'             => __( 'Swatch Height', 'variable-product-swatches' ),
                        'desc'              => __( 'Swatch height', 'variable-product-swatches' ),
                        'type'              => 'number',
                        'size'              => 'small',
                        'default'           => '50',
                        'suffix'            => 'px'
                    ),
                    array(
                        'name'                => 'image_style',
                        'label'             => __( 'Color Shape', 'variable-product-swatches' ),
                        'desc'              => __( 'Attribute shape.', 'variable-product-swatches' ),
                        'type'              => 'radio',
                        'default'           => 'rounded',
                        'options'           => array(
                            'rounded'           => 'Rounded Shape',
                            'squared'           => 'Squared Shape'
                        )
                    ),
                    array(
                        'name'                => 'image_swatch_show_label',
                        'label'             => __( 'Show Label', 'variable-product-swatches' ),
                        'desc'              => __( 'Show swatch label.', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => false,
                    )
                ),
                'color' => array(
                    array(
                        'name'                => 'color_swatch_width',
                        'label'             => __( 'Swatch Width', 'variable-product-swatches' ),
                        'desc'              => __( 'Swatch width', 'variable-product-swatches' ),
                        'type'              => 'number',
                        'size'              => 'small',
                        'default'           => '30',
                        'suffix'            => 'px',
                    ),
                    array(
                        'name'                => 'color_swatch_height',
                        'label'             => __( 'Swatch Height', 'variable-product-swatches' ),
                        'desc'              => __( 'Swatch height.', 'variable-product-swatches' ),
                        'type'              => 'number',
                        'size'              => 'small',
                        'default'           => '30',
                        'suffix'            => 'px'
                    ),
                    array(
                        'name'                => 'color_style',
                        'label'             => __( 'Swatch Shape', 'variable-product-swatches' ),
                        'desc'              => __( 'Attribute shape.', 'variable-product-swatches' ),
                        'type'              => 'radio',
                        'default'           => 'rounded',
                        'options' => array(
                            'rounded'  => 'Rounded Shape',
                            'squared'  => 'Squared Shape'
                        )
                    ),
                    array(
                        'name'                => 'color_swatch_show_label',
                        'label'             => __( 'Show Label', 'variable-product-swatches' ),
                        'desc'              => __( 'Show swatch label.', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => false,
                    )
                ),
                'radio' => array(
                    array(
                        'name'                => 'radio_style',
                        'label'             => __( 'Swatch Shape', 'variable-product-swatches' ),
                        'desc'              => __( 'Attribute shape.', 'variable-product-swatches' ),
                        'type'              => 'radio',
                        'default'           => 'rounded',
                        'options'           => array(
                            'rounded'           => 'Rounded Shape',
                            'squared'           => 'Squared Shape'
                        )
                    )
                ),
            ),
            'advanced' => array(
                'default' => array(
                    array(
                        'name'                => 'clickable_disabled_variation',
                        'label'             => __( 'Clickable Disabled Variation', 'variable-product-swatches' ),
                        'desc'              => __( 'Enable click disable variation label beside the attribute label.', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => false,
                    ),
                    array(
                        'name'                => 'show_selected_variation',
                        'label'             => __( 'Show Selected Variation', 'variable-product-swatches' ),
                        'desc'              => __( 'Show selected variation label beside the attribute label.', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => false,
                    ),
                    array(
                        'name'                => 'label_separator',
                        'label'             => __( 'Label Separator', 'variable-product-swatches' ),
                        'desc'              => __( 'Attribute and variation label separator', 'variable-product-swatches' ),
                        'type'              => 'text',
                        'default'           => ':',
                    ),
                    array(
                        'name'                => 'clear_on_reselect',
                        'label'             => __( 'Clear Selected Variation', 'variable-product-swatches' ),
                        'desc'              => __( 'Clear selected variation on click.', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => false,
                    ),


                    array(
                        'name'                => 'tooltip',
                        'label'             => __( 'Enable Tooltip', 'variable-product-swatches' ),
                        'desc'              => __( 'Enable tooltip on each product attribute.', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => true,
                    ),
                    array(
                        'name'                => 'tooltip_placement',
                        'label'             => __( 'Tooltip Placement', 'variable-product-swatches' ),
                        'desc'              => __( 'Tooltip placement position. Applicable for image and color', 'variable-product-swatches' ),
                        'type'              => 'radio',
                        'default'           => 'top',
                        'options'           => array(
                            'top'               => 'Top',
                            'bottom'            => 'Bottom'
                        )
                    )
                ),
                'ajax' => array(
                    array(
                        'name'                => 'threshold',
                        'label'             => __( 'Ajax Variation Threshold', 'variable-product-swatches' ),
                        'desc'              => __( 'Control the number of enable ajax variation threshold', 'variable-product-swatches' ),
                        'type'              => 'number',
                        'default'           => '30',
                    ),
                    array(
                        'name'                => 'attribute_behavior',
                        'label'             => __( 'Swatch Behavior', '' ),
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
                        'name'                => 'stockcount',
                        'label'             => __( 'Show Variation Stock', 'variable-product-swatches' ),
                        'desc'              => __( 'Show each variation stock and update according selected combination', 'variable-product-swatches' ),
                        'type'              => 'checkbox',
                        'default'           => false,
                    ),

                ),
                'performance' => array(
                    array(
                        'name'      => 'defer_load_js',
                        'type'    => 'checkbox',
                        'label'   => esc_html__( 'Defer Load JS', 'variable-product-swatches' ),
                        'desc'    => esc_html__( 'Defer Load JS for PageSpeed Score. If you use any caching plugin or your server have HTTP2 support you do not have to use it', 'variable-product-swatches' ),
                        'default' => false
                    ),
                ),
            ),
/*
            ,*/
        );
        return apply_filters('variable_product_swatches_option_fields', $fields);
    }


    /**
     *
     * @since    1.0.0
     */
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
