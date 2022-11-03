<?php
namespace Zqe;

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://github.com/zqelab
 * @since      1.0.0
 *
 * @package    Variable_Product_Swatches
 * @subpackage Variable_Product_Swatches/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Variable_Product_Swatches
 * @subpackage Variable_Product_Swatches/includes
 * @author     ZQE <dev@zqe.io>
 */
class Variable_Product_Swatches {
	
	/**
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      \Zqe\Variable_Product_Swatches_Option    $option    Maintains and registers all hooks for the plugin.
	 */
	public $option;
	
	/**
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      \Zqe\Variable_Product_Swatches_Helper    $helper    Maintains and registers all hooks for the plugin.
	 */
	public $helper;


	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      \Zqe\Variable_Product_Swatches_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      string    $name    The string used to uniquely identify this plugin.
	 */
	public $name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      string    $version    The current version of the plugin.
	 */
	public $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'VARIABLE_PRODUCT_SWATCHES_VERSION' ) ) {
			$this->version = VARIABLE_PRODUCT_SWATCHES_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->name = 'variable-product-swatches';

		$this->load_dependencies();
		$this->set_locale();

		$this->define_requirement_hooks();
		$this->define_widget_hooks();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Variable_Product_Swatches_Option. Option of the plugin.
	 * - Variable_Product_Swatches_Helper. Helper of the plugin.
	 * - Variable_Product_Swatches_Loader. Orchestrates the hooks of the plugin.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {
		$this->option = new \Zqe\Variable_Product_Swatches_Option();
		$this->helper = new \Zqe\Variable_Product_Swatches_Helper();
		$this->loader = new \Zqe\Variable_Product_Swatches_Loader();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Variable_Product_Swatches_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {
		$plugin_i18n = new \Zqe\Variable_Product_Swatches_i18n();
		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_requirement_hooks() {
		$plugin_requirement = new \Zqe\Variable_Product_Swatches_Requirement( $this );
		$this->loader->add_action( 'admin_notices', $plugin_requirement, 'php_requirement_notice' );
		$this->loader->add_action( 'admin_notices', $plugin_requirement, 'wc_requirement_notice' );
		$this->loader->add_action( 'admin_notices', $plugin_requirement, 'wc_version_requirement_notice' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_widget_hooks() {
		$plugin_widget = new \Zqe\Variable_Product_Swatches_Widget( $this );
		$this->loader->add_action( 'wp_dashboard_setup', $plugin_widget, 'dashboard_add_widgets' );
	}
	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {
		$plugin_admin = new \Zqe\Variable_Product_Swatches_Admin( $this );
		
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		$this->loader->add_filter( 'product_attributes_type_selector', $plugin_admin, 'product_attributes_type_selector_filter' );
        $this->loader->add_action( 'admin_init', $plugin_admin, 'add_attribute_meta' );
		$this->loader->add_action( 'woocommerce_product_option_terms', $plugin_admin, 'woocommerce_product_option_terms_action', 20, 3 );

		$this->loader->add_action( 'zqe_manage_edit_taxonomy_columns', $plugin_admin, 'zqe_manage_edit_taxonomy_columns_filter', 10, 1 );
		$this->loader->add_action( 'zqe_manage_taxonomy_custom_column', $plugin_admin, 'zqe_manage_taxonomy_custom_column_filter', 10, 3 );



        $this->loader->add_action( 'admin_menu', $plugin_admin, 'settings_menu' );
        $this->loader->add_action( 'admin_init', $plugin_admin, 'settings_init' );
		$this->loader->add_filter( 'plugin_row_meta', $plugin_admin, 'plugin_row_meta', 10, 2 );
		$this->loader->add_filter( 'plugin_action_links_' . $this->get_basename(), $plugin_admin, 'plugin_action_links' );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new \Zqe\Variable_Product_Swatches_Public( $this );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		$this->loader->add_filter( 'body_class',  $plugin_public, 'body_class' );
		
		$this->loader->add_filter( 'woocommerce_variation_is_active', $plugin_public, 'woocommerce_variation_is_active_filter', 10, 2 );
		$this->loader->add_filter( 'woocommerce_available_variation', $plugin_public, 'woocommerce_available_variation_filter', 10, 3 );
		$this->loader->add_filter( 'woocommerce_ajax_variation_threshold', $plugin_public, 'woocommerce_ajax_variation_threshold_filter' );
		$this->loader->add_filter( 'woocommerce_dropdown_variation_attribute_options_html', $plugin_public, 'woocommerce_dropdown_variation_attribute_options_html_filter', 200, 2 );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Variable_Product_Swatches_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Variable_Product_Swatches_Helper    Orchestrates the hooks of the plugin.
	 */
	public function get_helper() {
		return $this->helper;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Variable_Product_Swatches_Option   Orchestrates the hooks of the plugin.
	 */
	public function get_option() {
		return $this->option;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Retrieve the basename number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The basename number of the plugin.
	 */
	public function get_basename() {
		return VARIABLE_PRODUCT_SWATCHES_BASENAME;
	}
}
