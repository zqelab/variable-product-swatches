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
class Variable_Product_Swatches_Attribute_Meta {
    
    /**
     *
     * @since    1.0.0
     */
    private $taxonomy;
    
    /**
     *
     * @since    1.0.0
     */
    private $fields = [];
    
    /**
     *
     * @since    1.0.0
     */
    public function __construct($taxonomy, $fields = []) {
        
        $this->taxonomy = $taxonomy;
        $this->fields = $fields;

        add_action( 'init', [ $this, 'register' ] );
        add_action( $this->taxonomy . '_add_form_fields', [ $this, 'add_form_fields' ] );
        add_action( $this->taxonomy . '_edit_form_fields', [ $this, 'edit_form_fields' ] );
        add_action( 'create_' . $this->taxonomy, [ $this, 'save' ] );
        add_action( 'edit_' . $this->taxonomy, [ $this, 'save' ] );
        add_action( 'delete_' . $this->taxonomy,  [ $this, 'delete_term' ], 5, 4);
        add_filter( 'manage_edit-' . $this->taxonomy . '_columns', [ $this, 'edit_term_columns' ], 100, 3 );
        add_filter( 'manage_' . $this->taxonomy . '_custom_column', [ $this, 'manage_term_custom_column' ], 100, 3 );
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function register() {
        foreach ( $this->fields as $key => $field ) {
            register_meta( 'term', $field['id'], [ $this, 'sanitize' ] );
        }
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function add_form_fields( ) { 
        $this->generate_fields();
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function edit_form_fields( $term ) { 
        $this->generate_fields($term);
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function save( $term_id ) {
        if ( ! isset( $_POST['term_meta_text_nonce'] ) || ! wp_verify_nonce( $_POST['term_meta_text_nonce'], basename( __FILE__ ) ) ){
            return;
        }
        foreach ($this->fields as $field) {
            foreach ($_POST as $key => $value) {
                if ($field['id'] == $key) {
                    $value =  $this->sanitize($field['type'], $value);
                    update_term_meta($term_id, $field['id'], $value);
                }
            }
        }
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function delete_term( $term_id, $tt_id, $taxonomy, $deleted_term ) {
        
        global $wpdb;

        $term_id = absint($term_id);

        if ( $term_id and $taxonomy == $this->taxonomy ) {
            $wpdb->delete($wpdb->termmeta, array('term_id' => $term_id), array('%d'));
        }
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function edit_term_columns( $columns ) {
        $new_columns = array();

        if ( isset( $columns['cb'] ) ) {
            $new_columns['cb'] = $columns['cb'];
        }

        $new_columns['variable-product-swatches-meta'] = '';

        if ( isset( $columns['cb'] ) ) {
            unset( $columns['cb'] );
        }

        return array_merge( $new_columns, $columns );
    }

    
    /**
     *
     * @since    1.0.0
     */
    public function manage_term_custom_column( $out, $column, $term_id ) {

        $attribute = wc_get_attribute( wc_attribute_taxonomy_id_by_name( $this->taxonomy ) );

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
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function sanitize( $type, $value ) {
        switch ( $type ) {
            case 'color':
                return sanitize_text_field($value);
                break;
            case 'image':
                return sanitize_text_field($value);
                break;
            default:
                break;
        }
        return sanitize_text_field($value);
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function generate_fields( $term = false) {

        if (empty($this->fields)) {
            return;
        }

        foreach ($this->fields as $key => $field) {

            $field['value'] = $this->get( $term, $field );

            $field['id'] = esc_html( $field['id'] );

            $field['size']        = isset( $field['size'] ) ? $field['size'] : '40';
            $field['required']    = ( isset( $field['required'] ) and $field['required'] == true ) ? ' aria-required="true"' : '';
            $field['placeholder'] = ( isset( $field['placeholder'] ) ) ? ' placeholder="' . $field['placeholder'] . '" data-placeholder="' . $field['placeholder'] . '"' : '';
            $field['desc']        = ( isset( $field['desc'] ) ) ? $field['desc'] : '';

            $field['dependency']       = ( isset( $field['dependency'] ) ) ? $field['dependency'] : array();

            $depends = empty( $field['dependency'] ) ? '' : "data-vpsdepends='" . wp_json_encode( $field['dependency'] ) . "'";

            ob_start();
            ?>
            <?php wp_nonce_field( basename( __FILE__ ), 'term_meta_text_nonce' ); ?>
            <?php 
            echo ob_get_clean();

            if ( is_object( $term) ) {
            ob_start();
            ?>
            <tr <?php echo $depends ?> class="form-field  <?php echo esc_attr($field['id']) ?> <?php echo empty($field['required']) ? '' : 'form-required' ?>">
                <th scope="row">
                    <?php if ( ! ( $field['type'] == 'checkbox' || $field['type'] == 'checkbox' ) ) { ?>
                    <label for="<?php echo esc_attr($field['id']) ?>"><?php echo esc_html($field['label']); ?></label>
                    <?php } else { ?>
                    <?php echo esc_html($field['label']); ?>
                    <?php }  ?>
                </th>
                <td>
                <?php
                
            } else {
            ?>
            <div <?php echo $depends ?> class="form-field <?php echo esc_attr($field['id']) ?><?php echo empty($field['required']) ? '' : 'form-required' ?>">
                <?php if ( ! ( $field['type'] == 'checkbox' || $field['type'] == 'checkbox' ) ) {  ?>
                    <label for="<?php echo esc_attr($field['id']) ?>"><?php echo esc_html($field['label']); ?></label>
                <?php
                } else { ?>
                    <?php echo esc_html($field['label']); ?>
                <?php
                }
            }
            echo ob_get_clean();
            switch ($field['type']) {
                case 'text':
                    ob_start();
                    ?>
                    <input name="<?php echo $field['id'] ?>" 
                            id="<?php echo $field['id'] ?>"
                            type="<?php echo $field['type'] ?>"
                            value="<?php echo $field['value'] ?>">
                    <?php
                    echo ob_get_clean();
                    break;
                case 'select':
                    $field['options'] = isset( $field['options'] ) ? $field['options'] : array();
                    $field['multiple'] = isset( $field['multiple'] ) ? ' multiple="multiple"' : '';

                    ob_start();
                    ?>
                    <select name="<?php echo $field['id'] ?>" id="<?php echo $field['id'] ?>" <?php echo $field['multiple'] ?>>
                        <?php
                        foreach ( $field['options'] as $key => $option ) {
                            echo '<option' . selected( $field['value'], $key, false ) . ' value="' . $key . '">' . $option . '</option>';
                        }
                        ?>
                    </select>
                    <?php
                    echo ob_get_clean();
                    break;

                case 'color':
                    echo sprintf( 
                        '<input type="text" class="zqe-color-picker wp-color-picker" name="%1$s" value="%2$s" />', $field['id'], $field['value']
                    );
                    break;
                case 'image':
                    ob_start();
                    ?>
                    <div class="variable-product-swatches-image-field-wrapper">
                        <input class="attachment-id" type="hidden" name="<?php echo esc_attr($field['id']) ?>" value="<?php echo esc_attr($field['value']) ?>" />
                        <div class="image-preview">
                            <img src="<?php echo esc_url( self::get_img_src( $field['value'] ) ); ?>" />
                        </div>
                        <div class="button-wrapper">
                            <button type="button" class="upload-image-button button button-primary button-small">
                                <?php esc_html_e( 'Upload', 'variable-product-swatches' ); ?>
                            </button>
                            <button style="<?php echo( empty( $field['value'] ) ? 'display:none' : '' ) ?>" type="button" class="remove-image-button button button-danger button-small">
                                <?php esc_html_e( 'Remove', 'variable-product-swatches' ); ?>
                            </button>
                        </div>
                    </div>
                    <?php
                    echo ob_get_clean();
                    break;
                default:
                    break;

            }
            if ( is_object( $term) ) {
            ob_start();
            ?>
                <p class="description"><?php echo esc_html($field['desc']); ?></p>
                </td>
            </tr>
            <?php 
            } else { 
            ?>
                <p><?php echo esc_html($field['desc']); ?></p>
            </div>
            <?php
            }
            echo ob_get_clean();
        }
    }
    
    /**
     *
     * @since    1.0.0
     */
    public function get( $term, $field ) {
        $value = isset($field['default']) ? $field['default'] : '';
        if ( is_object( $term) ) {
            $value = get_term_meta($term->term_id, $field['id'], true);
        }
        return $value;
    }
    
    /**
     *
     * @since    1.0.0
     */
    private static function get_img_src($thumbnail_id = false) {
        if (!empty($thumbnail_id)) {
            $image = wp_get_attachment_thumb_url($thumbnail_id);
        } else {
            $image = self::placeholder_img_src();
        }
        return $image;
    }
    
    /**
     *
     * @since    1.0.0
     */
    private static function placeholder_img_src() {
        return function_exists('wc_placeholder_img_src') ? wc_placeholder_img_src() : null;
    }
}