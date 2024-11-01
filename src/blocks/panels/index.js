import block from './block.json';
import classNames from 'classnames';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { AudioDescribed as icon } from '../../components/icons.js';
import { useSelect } from '@wordpress/data';

registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: function ({ attributes, setAttributes, context, clientId }) {
			const innerBlockCount = useSelect((select) => select('core/block-editor').getBlock(clientId).innerBlocks);

			return (
				<div { ...useBlockProps({
					className: classNames({
						'video-accessibility__panels': true,
						[`video-accessibility__panels--${ innerBlockCount.length }`]: true
					})
				}) }>
					<InnerBlocks
						allowedBlocks={ ['video-accessibility/panel'] }
						template={ [
							['video-accessibility/panel'],
							['video-accessibility/panel'],
						] }
						templateLock={ false }
						renderAppender={ () => null }
					/>
				</div>
			)
		},
		save: () => (
			<div { ...useBlockProps.save({ className: 'video-accessibility__panels' }) }>
				<InnerBlocks.Content />
			</div>
		),
	}
);
