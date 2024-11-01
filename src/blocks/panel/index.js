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
		edit: function ( { attributes, setAttributes, context, isSelected, clientId } ) {
			const parents    = useSelect( select => select('core/block-editor').getBlockParents( clientId ).map( id => select('core/block-editor').getBlock( id ) ) );
			const parent     = parents && parents.length ? parents[ parents.length - 1 ] : null;
			const blockIndex = parent && parent.innerBlocks ? parent.innerBlocks.map( ib => ib.clientId ).findIndex( blockClientId => blockClientId === clientId ) : -1;

			// update the currentPanel to match the current index of this panel when focused
			// useEffect( () => {
			// 	if ( isSelected && blockIndex > -1 && context['video-accessibility/currentPanel'] !== blockIndex ) {
			// 		dispatch( 'core/block-editor' ).updateBlock( parents[0].clientId, { attributes: { ...parents[0].attributes, currentPanel: blockIndex } } );
			// 	}
			// }, [ isSelected, blockIndex, context['video-accessibility/currentPanel'] ] );

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
								'core/buttons',
								'core/media-text',
								'core/freeform',
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
