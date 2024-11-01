<div class="video-accessibility__statement">
<?php
	if ( empty( $attributes['custom'] ) ) {
		echo wp_kses_post( wpautop( get_option( 'video_accessibility_statement', '' ) ) );
	} elseif ( ! empty( $content ) ) {
		echo wp_kses_post( $content );
	}
?>
</div>
