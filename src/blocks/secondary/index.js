import block from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { AudioDescribed as icon } from '../../components/icons.js';

registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: () => (
			<div { ...useBlockProps({ className: 'video-accessibility__secondary' }) }>
				<p className="video-accessibility__label">{ __('Secondary Video', 'video-accessibility') }</p>
				<InnerBlocks
					allowedBlocks={ [
						'core/embed',
						'core/video'
					] }
					template={ [['core/embed']] }
					templateLock={ false }
				/>
			</div>
		),
		save: () => (
			<div { ...useBlockProps.save( { className: 'video-accessibility__media video-accessibility__media--secondary' } ) }>
				<InnerBlocks.Content />
			</div>
		)
	}
);
