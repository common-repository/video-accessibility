import block from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { AudioDescribed as icon } from '../../components/icons.js';

registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: ( { clientId, context } ) => {
			// const currentMedia = context['video-accessibility/currentMedia'];

			// useSelect( select => {
			// 	const block = select('core/block-editor').getBlock( clientId );

			// 	// hide/show the correct video
			// 	if ( block && block.innerBlocks.length ) {
			// 		for ( let innerBlock of block.innerBlocks ) {
			// 			const node = document.getElementById( `block-${innerBlock.clientId}` );

			// 			if ( node ) {
			// 				let hidden = false;

			// 				if ( 0 === currentMedia && 'video-accessibility/primary' !== innerBlock.name ) {
			// 					hidden = true;
			// 				} else if ( 1 === currentMedia && 'video-accessibility/secondary' !== innerBlock.name ) {
			// 					hidden = true;
			// 				}

			// 				if ( hidden ) {
			// 					node.hidden = true;
			// 				} else {
			// 					node.removeAttribute('hidden');
			// 				}
			// 			}
			// 		}
			// 	}
			// }, [ currentMedia ] );

			return (
				<>
					<div { ...useBlockProps({ className: 'video-accessibility__media' }) }>
						<InnerBlocks
							template={ [
								[ 'video-accessibility/primary' ],
								[ 'video-accessibility/secondary' ],
							] }
							templateLock="all"
						/>
					</div>
				</>
			);
		},
		save: () => (
			<div { ...useBlockProps.save({ className: 'video-accessibility__media' }) }>
				<InnerBlocks.Content />
			</div>
		),
	}
);
