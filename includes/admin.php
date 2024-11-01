<?php

/**
 * Initialize the settings sections/fields
 *
 * @return void
 * @action admin_init
 */
function video_accessibility_admin_init() : void {
	$settings = video_accessibility_settings();
	$sections = array_unique( array_merge( [ 'video_accessibility_group' ], array_column( $settings, 'section' ) ) );

	foreach ( $sections as $section ) {
		add_settings_section( $section, $section === 'video_accessibility_group' ? '' : $section, '__return_empty_string', 'video-accessibility' );
	}

	foreach ( $settings as $name => $setting ) {
		register_setting( $setting[ $section ] ?? 'video_accessibility_group', $name, $setting );
		add_settings_field(
			$name,
			$setting['description'] ?? '',
			'video_accessibility_render_field',
			'video-accessibility',
			$setting['section'] ?? 'video_accessibility_group',
			array_merge( $setting, [ 'name' => $name ] )
		);

		$constant = strtoupper( $name );

		if ( defined( $constant ) ) {
			add_filter( "pre_option_$name", fn() => constant( $constant ), 1 );
		}
	}
}

/**
 * Add the options page
 *
 * @return void
 * @action admin_menu
 */
function video_accessibility_admin_menu() : void {
	add_options_page(
		__( 'Video Accessibility', 'video-accessibility' ),
		__( 'Video Accessibility', 'video-accessibility' ),
		video_accessibility_settings_capability(),
		'video-accessibility',
		'video_accessibility_render_settings'
	);
}

/**
 * Render the settings page
 *
 * @return void
 */
function video_accessibility_render_settings() : void {
	if ( ! current_user_can( video_accessibility_settings_capability() ) ) {
		return;
	}

	settings_errors( 'video-accessibility' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="<?php echo esc_url( admin_url( 'options.php' ) ); ?>" method="POST">
			<?php
				settings_fields( 'video_accessibility_group' );
				do_settings_sections( 'video-accessibility' );
				submit_button( 'Save' );
			?>
		</form>
	</div>
	<?php
}

/**
 * Render a field for the settings api
 *
 * @param array
 * @return void
 */
function video_accessibility_render_field( $args ) : void {
	$const      = strtoupper( $args['name'] );
	$defined    = defined( $const );
	$input_type = $args['input_type'] ?? 'text';
	$value      = get_option( $args['name'] );

	if ( 'richtext' === $input_type ) {
		wp_editor( $value, $args['name'], [] );
	} elseif ( 'textarea' === $input_type ) {
		printf(
			'<textarea id="%1$s" name="%1$s" class="regular-text"%3$s rows="10">%2$s</textarea>',
			esc_attr( $args['name'] ),
			esc_textarea( $value ),
			disabled( $defined, true, false )
		);
	} elseif ( 'checkbox' === $input_type ) {
		printf(
			'<input type="checkbox" id="%1$s" name="%1$s"%2$s%3$s>',
			esc_attr( $args['name'] ),
			checked( (bool) $value, true, false ),
			disabled( $defined, true, false )
		);
	} elseif ( 'select' === $input_type ) {
		$options = '';

		foreach ( $args['options'] as $option => $label ) {
			$options .= sprintf(
				'<option value="%1$s"%2$s>%3$s</option>' . "\n",
				esc_attr( $option ),
				selected( $option, $value, false ),
				esc_attr( $label )
			);
		}

		printf(
			'<select id="%1$s" name="%1$s"%2$s>%3$s</select>',
			esc_attr( $args['name'] ),
			disabled( $defined, true, false ),
			$options
		);
	} else {
		printf(
			'<input id="%1$s" name="%1$s" value="%2$s" type="%3$s" class="regular-text"%4$s>',
			esc_attr( $args['name'] ),
			esc_attr( $value ),
			esc_attr( $input_type ),
			disabled( $defined, true, false )
		);
	}

	if ( ! empty( $args['help'] ) ) {
		printf( sprintf( '<br><small>%s</small>', wp_kses_post( $args['help'] ) ) );
	}
}
