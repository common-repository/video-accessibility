<?php
$icon_path = ! empty( $attributes['icon'] ) ? VIDEO_ACCESSIBILITY_DIR . '/svg/' . $attributes['icon'] . '.svg' : null;

$block_attributes = get_block_wrapper_attributes(
	[
		'class'=>'video-accessibility__control',
	]
);

?>

<div <?php echo $block_attributes;?>>
	<button type="button" class="wp-block-button__link" data-control="<?php echo esc_attr( $attributes['control'] ?? '' ); ?>">
		<?php if ( ! empty( $icon_path ) && file_exists( $icon_path ) ) : ?>
			<i class="video-accessibility__icon video-accessibility__icon--<?php echo esc_attr( $attributes['icon'] ); ?>"><?php echo file_get_contents( $icon_path ); ?></i>
		<?php endif; ?>

		<span class="video-accessibility__control-text">
			<?php echo wp_kses_post( $attributes['text'] ); ?>
		</span>

		<?php if ( 'switch' === $attributes['control'] && ! empty( $attributes['switchText']) ) : ?>
			<span class="video-accessibility__control-text video-accessibility__control-text--switch">
				<?php echo wp_kses_post( $attributes['switchText'] ); ?>
			</span>
		<?php endif; ?>
	</button>
</div>
