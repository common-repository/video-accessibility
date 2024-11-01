<?php

/**
 * Get the version of the plugin from comment for usage in php
 *
 * @return string version number defined on the comment block or modified time of particular file
 *
 * @uses get_file_data to parse the version number from the file comment
 */
function video_accessibility_version() : string {
	static $version;

	if ( ! isset( $version ) ) {
		$file_data = get_file_data( VIDEO_ACCESSIBILITY_FILE, [ 'Version' => 'Version' ] );

		$version = $file_data['Version'] ?? filemtime( VIDEO_ACCESSIBILITY_FILE );
	}

	return $version;
}

/**
 * Add links to plugin page.
 *
 * @return string link href and text for extra plugin links
 */

function filter_plugin_action_links ( $actions ) {
	$mylinks = array(
		'<a href="' . admin_url( 'options-general.php?page=video-accessibility' ) . '">' . esc_html__( 'Settings', 'video-accessibility' ) . '</a>',
	);

	$actions = array_merge( $actions, $mylinks );

	return $actions;
}

/**
 * Register the block type and it's assets
 *
 * @return void
 */
function video_accessibility_init() : void {
	video_accessibility_settings();

	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/aside/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/aside-content/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/block/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/control/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/controls/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/media/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/panel/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/panels/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/primary/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/secondary/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/statement/block.json' );
	register_block_type_from_metadata( VIDEO_ACCESSIBILITY_DIR . '/build/blocks/transcript/block.json' );
}

/**
 * Register the block type and it's assets
 *
 * @return void
 */
function video_accessibility_rest_api_init() : void {
	register_rest_route(
		'video-accessibility/v1',
		'settings',
		[
			'callback'            => 'video_accessibility_rest_api_settings_callback',
			'permission_callback' => 'is_user_logged_in',
		]
	);

	register_rest_route(
		'video-accessibility/v1',
		'schema',
		[
			'callback'            => 'video_accessibility_rest_api_schema_callback',
			'permission_callback' => 'is_user_logged_in',
			'args'                => [
				'url' => [
					'description'       => 'The oEmbed URL to get the schema for',
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'validate_callback' => 'rest_validate_request_arg',
				],
				'provider' => [
					'description'       => 'The oEmbed provider for the url',
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'validate_callback' => 'rest_validate_request_arg',
				]
			]
		]
	);
}

/**
 * Get the capability required to manage settings
 *
 * @return string
 */
function video_accessibility_settings_capability() : string {
	return (string) apply_filters( 'video_accessibility_settings_capability', 'manage_options' );
}

/**
 * Get the list of available settings
 *
 * @return array
 */
function video_accessibility_settings() : array {
	static $settings;

	if ( ! isset( $settings ) ) {
		$settings = apply_filters(
			'video_accessibility_settings',
			[
				'video_accessibility_youtube_api_key' => [
					'type'              => 'string',
					'description'       => __( 'YouTube API Key', 'video-accessibility' ),
					'help'              => sprintf( __( 'The YouTube API Key is used to get extended VideoObject schema information. If not supplied, basic oEmbed schema will be used. Follow <a href="%1$s" target="_blank">these instructions</a> to get an API Key.', 'video-accessibility' ), 'https://developers.google.com/youtube/v3/getting-started' ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest'      => false,
				],
				'video_accessibility_statement' => [
					'type'              => 'string',
					'description'       => __( 'Default Video Statement', 'video-accessibility' ),
					'sanitize_callback' => 'wp_kses_post',
					'show_in_rest'      => true,
					'input_type'        => 'richtext',
				],
			]
		);

		foreach ( array_keys( $settings ) as $name ) {
			$const = strtoupper( $name );

			if ( defined( $const ) ) {
				add_filter( "pre_option_$name", fn() => constant( $const ), 1, 3 );
			}
		}
	}

	return $settings;
}

/**
 * Callback for the rest api route for accessing the statement
 *
 * @return array
 */
function video_accessibility_rest_api_settings_callback() : array {
	$data     = [];
	$settings = video_accessibility_settings();

	foreach ( $settings as $key => $setting ) {
		if ( empty( $setting['show_in_rest'] ) ) {
			continue;
		}

		$data[ $key ] = get_option( $key );
	}

	return $data;
}

/**
 * Callback for the rest api route for accessing the statement
 *
 * @return ?object
 */
function video_accessibility_rest_api_schema_callback( $request ) : ?object {
	if ( ! empty( $request['url'] ) && ! empty( $request['provider'] ) ) {
		$callable = 'video_accessibility_get_' . $request['provider'] . '_schema';

		if ( is_callable( $callable ) ) {
			$schema = call_user_func( $callable, $request['url'] );
		}
	}

	return $schema ?? null;
}

/**
 * Get oembed data using the core wordpress oembed provider
 *
 * @param string $url
 * @return ?object
 */
function video_accessibility_get_oembed_data( string $url ) : ?object {
	if ( empty( $url ) ) {
		return null;
	}
	$transient_key = __FUNCTION__ . ':' . hash( 'md5', $url );
	$data          = get_transient( $transient_key );

	if ( ! $data ) {
		$data = _wp_oembed_get_object()->get_data( $url ) ?: null;

		if ( ! empty( $data ) ) {
			set_transient( $transient_key, $data, __FUNCTION__, 1 * HOUR_IN_SECONDS );
		}
	}

	return $data;
}

/**
 * Get an YouTube schema object from oembed and youtube api v3
 *
 * @param string $url
 * @return ?object
 */
function video_accessibility_get_youtube_schema( string $url ) : ?object {

	$transient_key = __FUNCTION__ . ':' . hash( 'md5', $url );
	$schema        = get_transient( $transient_key ) ?: null;

	if ( ! empty( $schema ) ) {
		return apply_filters( 'video_accessibility_youtube_schema', $schema, $url );
	}

	$oembed = video_accessibility_get_oembed_data( $url );

	if ( empty( $oembed ) ) {
		return apply_filters( 'video_accessibility_youtube_schema', null, $url );
	}

	if ( 'youtu.be' === parse_url( $url, PHP_URL_HOST ) ) {
		$video_id = str_replace('/','',parse_url( $url, PHP_URL_PATH ));
	} else {
		parse_str( parse_url( $url, PHP_URL_QUERY ), $url_params );
		$video_id = $url_params['v'] ?? null;
	}

	if ( empty( $video_id ) ) {
		return apply_filters( 'video_accessibility_youtube_schema', $schema, $url );
	}

	$content_url_params = [
		'enablejsapi' => '1',
		'rel'         => '0',
		'showinfo'    => '0',
		'autohide'    => '1',
	];

	$schema = (object) [
		'embedUrl'     => sprintf( 'https://www.youtube.com/embed/%s?%s', $video_id, http_build_query( $content_url_params ) ),
		'description'  => '',
		'duration'     => '',
		'name'         => $oembed->title,
		'thumbnailUrl' => $oembed->thumbnail_url,
		'uploadDate'   => '',
		'height'       => $oembed->height,
		'width'        => $oembed->width,
	];

	$api_key = get_option( 'video_accessibility_youtube_api_key', '' );

	if ( empty( $api_key ) ) {
		return apply_filters( 'video_accessibility_youtube_schema', $schema, $url );
	}

	// get data from youtube api
	$api_params = [
		'key'  => $api_key,
		'id'   => $video_id,
		'part' => 'snippet,contentDetails',
	];

	$response = wp_remote_get( 'https://www.googleapis.com/youtube/v3/videos?' . http_build_query( $api_params ) );

	if ( is_wp_error( $response ) || 200 !== ( $response['response']['code'] ?? 418 ) ) {
		return apply_filters( 'video_accessibility_youtube_schema', null, $url );
	}

	try {
		$body = json_decode( $response['body'] );
		$item = current( $body->items );

		$schema->description = trim( $item->snippet->description );
		$schema->duration    = $item->contentDetails->duration;
		$schema->uploadDate  = get_date_from_gmt( $item->snippet->publishedAt, 'Y-m-d' );
	} catch ( Throwable $fault ) {
		return null;
	}

	set_transient( $transient_key, $schema, 1 * HOUR_IN_SECONDS );

	$schema = apply_filters( 'video_accessibility_youtube_schema', $schema, $url );

	return $schema;
}

/**
 * Get an oembed object for a vimeo url
 *
 * @param string $url
 * @return ?object
 */
function video_accessibility_get_vimeo_schema( string $url ) : ?object {
	$oembed = video_accessibility_get_oembed_data( $url );

	preg_match( '/src="([^"]+)"/', $oembed->html, $matches );

	$schema = (object) [
		'embedUrl'     => $matches[1] ?? '',
		'description'  => $oembed->description,
		'duration'     => "PT{$oembed->duration}S",
		'name'         => $oembed->title,
		'thumbnailUrl' => $oembed->thumbnail_url,
		'uploadDate'   => get_date_from_gmt( $oembed->upload_date, 'Y-m-d' ),
		'height'       => $oembed->height,
		'width'        => $oembed->width,
	];

	return apply_filters( 'video_accessibility_vimeo_schema', $schema, $url );
}

/**
 * Get an oembed-like object for a media library hosted video
 *
 * @param int $id
 * @return ?object
 */
function video_accessibility_get_video_schema( int $id ) : ?object {
	if ( ! wp_attachment_is( 'video', $id ) ) {
		return null;
	}

	$schema = (object) [
		'contentUrl'   => '',
		'description'  => '',
		'duration'     => '',
		'name'         => '',
		'thumbnailUrl' => '',
		'uploadDate'   => '',
		'height'       => 0,
		'width'        => 0,
		'duration'     => '',
	];

	$media = get_post( $id );
	$meta  = wp_get_attachment_metadata( $id );

	$schema->contentUrl  = wp_get_attachment_url( $id );
	$schema->name        = get_the_title( $id );
	$schema->description = wp_strip_all_tags( $media->post_content );
	$schema->uploadDate  = get_the_date( 'Y-m-d', $id );

	if ( ! empty( $meta ) ) {
		$schema->width    = (int) $meta['width'];
		$schema->height   = (int) $meta['height'];
		$schema->duration = 'PT' . (int) $meta['length'] . 'S';
	}

	$poster_id = get_post_thumbnail_id( $id );

	if ( ! empty( $poster_id ) && wp_attachment_is( 'image', $poster_id ) ) {
		$schema->thumbnailUrl = wp_get_attachment_url( $poster_id );
	}

	return apply_filters( 'video_accessibility_media_library_schema', $schema, $id );
}

/**
 * Render a list of meta tags coming from a schema object
 *
 * @param object $schema
 * @return string
 */
function video_accessibility_render_schema( object $schema ) : string {
	$html = '';

	if ( ! empty( $schema ) ) {
		foreach ( $schema as $itemprop => $content ) {
			if ( ! empty( $content ) ) {
				$html .= sprintf( '<meta itemprop="%s" content="%s">' . "\n", esc_attr( $itemprop ), esc_attr( $content ) );
			}
		}
	}

	return $html;
}

/**
 * Add the video object schema to the core/embed block for supported providers
 *
 * @param string $html
 * @param array $data
 * @param WP_Block $block
 * @return string
 */
function video_accessibility_render_core_embed( $html, $data, $block ) {
	if ( empty( $data['attrs']['providerNameSlug'] ) || empty( $data['attrs']['url'] ) ) {
		return $html;
	}

	$callable = 'video_accessibility_get_' . $data['attrs']['providerNameSlug'] . '_schema';

	if ( ! is_callable( $callable ) ) {
		return $html;
	}

	$schema = call_user_func( $callable, $data['attrs']['url'] );

	if ( ! empty( $schema ) ) {
		$html = str_replace( '<figure ', '<figure itemscope itemtype="http://schema.org/VideoObject" ', $html );

		$schema_html = video_accessibility_render_schema( $schema );
		$html        = str_replace( '<iframe ', $schema_html . '<iframe ', $html );
	}

	return $html;
}

/**
 * Add the video object schema to the core/video block
 *
 * @param string $html
 * @param array $data
 * @param WP_Block $block
 * @return string
 */
function video_accessibility_render_core_video( $html, $data, $block ) {
	if ( ! empty( $data['attrs']['id'] ) ) {
		$schema = video_accessibility_get_video_schema( $data['attrs']['id'] );

		if ( ! empty( $schema ) ) {
			$html = str_replace( '<figure ', '<figure itemscope itemtype="http://schema.org/VideoObject" ', $html );

			$schema_html = video_accessibility_render_schema( $schema );
			$html        = str_replace( '<video', $schema_html . '<video', $html );
		}
	}

	return $html;
}


/**
 * Generate a class list based by allowing any truthy value (any scalar value except false, 0, -0, 0.0, -0.0, '', '0', null, false) evaluated by the empty function
 *
 * @see https://www.php.net/manual/en/language.types.boolean.php#language.types.boolean.casting
 *
 * Data types accepted (other types will be ignored):
 * - string
 * - double
 * - integer
 * - array:
 *   * if an index is numeric, the value is add to the classlist if truthy
 *   * if an index is a non-numeric string, the index is added to the classlist if the value is truthy
 * - object:
 *   * if a __toString method exists on the object, it will be used and evaluated for truthiness
 *   * otherwise will iterate over public properties and the property name added if the property value is truthy
 *
 * ```php
 * video_accessibility_classnames(
 *     'string-class',
 *     3,
 *     0,
 *     [
 *         'array',
 *         'of',
 *         'classes',
 *         '',
 *         0,
 *     ],
 *     [
 *         'array-key-truthy' => true,
 *         'array-key-falsy' => false
 *     ]
 *     (object) [
 *         'object-prop-truthy' => 1,
 *         'object-prop-falsy' => 0
 *     ]
 * );
 * ```
 *
 * -> 'string-class 3 array of classes array-key-truthy object-prop-truthy'
 *
 * @param mixed
 * @return string
 */
function video_accessibility_classnames() : string {
	$args       = func_get_args();
	$classnames = [];

	foreach ( $args as $arg ) {
		if ( empty( $arg ) ) {
			continue;
		}

		$arg_type = gettype( $arg );

		if ( 'string' === $arg_type ) {
			array_push( $classnames, $arg );
			continue;
		}

		if ( 'integer' === $arg_type || 'double' === $arg_type || ( 'object' === $arg_type && is_callable( [ $arg, '__toString' ] ) ) ) {
			array_push( $classnames, (string) $arg );
			continue;
		}

		if ( 'object' === $arg_type || 'array' === $arg_type ) {
			foreach ( $arg as $key => $val ) {
				if ( is_array( $val ) || is_object( $val ) ) {
					array_push( $classnames, trim( call_user_func_array( __FUNCTION__, $arg ) ) );
					continue;
				}

				if ( is_numeric( $key ) && ! empty( $val ) ) {
					array_push( $classnames, $val );
					continue;
				}

				if ( ! empty( $val ) ) {
					array_push( $classnames, $key );
					continue;
				}
			}
			continue;
		}
	}

	return implode( ' ', array_filter( $classnames ) );
}
