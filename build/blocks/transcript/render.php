<?php
$block_attributes = get_block_wrapper_attributes(
	[
		'class'=>'video-accessibility__transcript',
	]
);
?>
<div <?php echo $block_attributes;?>>
<?php
	if ( ! empty( $attributes['file'] ) ) {
		$path = get_attached_file( $attributes['file'] );
		$attachment_url = wp_get_attachment_url( $attributes['file'] );
		?>
		<div class="wp-block-button video-accessibility__download-btn">
			<a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( $attachment_url );?>"><?php echo esc_attr($attributes['buttonText']);?></a>
		</div>
		
		<?php

		if ( is_readable( $path ) ) {
			echo nl2br( esc_html( file_get_contents( $path ) ) );
		}
		
	}
?>
</div>
