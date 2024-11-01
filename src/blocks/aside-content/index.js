import block from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { AudioDescribed as icon } from '../../components/icons.js';

registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: function () {
			return (
				<>
					<div { ...useBlockProps({ className: 'video-accessibility__panel' }) }>
						<InnerBlocks
							template={ [ [ 'core/paragraph' ] ] }
							allowedBlocks={ [
								'core/heading',
								'core/paragraph',
								'core/list',
								'core/image',
								'core/media-text',
								'video-accessibility/statement',
								'video-accessibility/transcript',
							] }
							templateLock={ false }
						/>
					</div>
				</>
			)
		},
		save: ( { attributes } ) => (
			<div { ...useBlockProps.save( { className: 'video-accessibility__panel', 'data-title': attributes.title } ) }>
				<InnerBlocks.Content />
			</div>
		),
	}
);
