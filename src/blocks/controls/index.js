import block from './block.json';
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';
import { AudioDescribed as icon } from '../../components/icons.js';
import { isEqual } from 'lodash';

const { removeBlock, moveBlockToPosition } = dispatch('core/block-editor');

export function combineArrays( arr1, arr2 ) {
	return arr1.reduce( ( obj, item, index ) => ( { ...obj, [ item ]: arr2[ index ] } ), {} );
}

export function combineArraysColumn( arr1, arr2, column = 'clientId' ) {
	return combineArrays( arr1.map( v => v[ column ] ), arr2.map( v => v[ column ] ) );
}

registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: ( { attributes, setAttributes, clientId, context, isSelected, ...props } ) => {
			const [ prevControlPanelMap, setPrevControlPanelMap ] = useState();

			const { insertBlock } = dispatch( 'core/block-editor' );
			const block           = useSelect( select => select('core/block-editor').getBlock( clientId ) );

			const parent = useSelect( select => {
				const parents = select('core/block-editor').getBlockParentsByBlockName( clientId, 'video-accessibility/block' );

				return parents && parents.length ? select('core/block-editor').getBlock( parents[0] ) : null;
			} );

			const aside  = parent && parent.innerBlocks ? parent.innerBlocks.find( innerBlock => 'video-accessibility/aside' === innerBlock.name ) : null;
			const panels = aside && aside.innerBlocks ? aside.innerBlocks.find( innerBlock => 'video-accessibility/panels' === innerBlock.name ) : null;

			const controlClientIds = block.innerBlocks.filter( ib => 'panel' === ib.attributes.control ).map( ib => ib.clientId );
			const panelClientIds   = panels && panels.innerBlocks ? panels.innerBlocks.map( ib => ib.clientId ) : [];
			const controlPanelMap  = combineArrays( controlClientIds, panelClientIds );

			useEffect( () => {
				if ( controlClientIds && panelClientIds && prevControlPanelMap ) {
					// delete panels when controls are deleted
					Object.keys( prevControlPanelMap ).filter( controlId => ! controlPanelMap[ controlId ] ).map( controlId => prevControlPanelMap[ controlId ] ).forEach( removeBlock );

					// re-sort panel blocks based on the updated sort
					Object.keys( controlPanelMap ).map( controlId => prevControlPanelMap[ controlId ] ).forEach( ( panelId, index ) => moveBlockToPosition( panelId, panels.clientId, panels.clientId, index ) );
				}

				setPrevControlPanelMap( controlPanelMap );
			}, [ isEqual( controlPanelMap, prevControlPanelMap ) ] );

			return (
				<div { ...useBlockProps({ className: 'video-accessibility__controls' }) }>
					<InnerBlocks
						allowedBlocks={ [ 'video-accessibility/control' ] }
						template={ [
							[
								'video-accessibility/control',
								{
									text: 'Switch to video with audio description',
									control: 'switch',
									switchText: 'Switch to video without audio descriptions',
									// lock: {
									// 	remove: true
									// },
								}
							],
							[
								'video-accessibility/control',
								{
									text: 'Transcript',
									icon: 'transcript'
								},
								[
									[
										'video-accessibility/transcript'
									]
								]
							],
							[
								'video-accessibility/control',
								{
									text: 'Accessibility Statement',
									icon: 'info',
								},
								[
									[
										'video-accessibility/statement'
									]
								]
							],
						] }
						orientation="horizontal"
						templateLock={ false }
						renderAppender={ () => {
							if ( isSelected ) {
								return (
									<div className="components-dropdown block-editor-inserter">
										<Button
											className="video-accessibility__render-appender block-editor-inserter__toggle has-icon"
											onClick={ () => {
												insertBlock( createBlock( 'video-accessibility/control' ), block.innerBlocks.length, clientId, false );
												insertBlock( createBlock( 'video-accessibility/panel' ), panels.innerBlocks.length, panels.clientId, false );
											}}
											icon={ plus }
										/>
									</div>
								);
							}

							return null;
						} }
					/>
				</div>
			);
		},
		save: () => (
			<div {...useBlockProps.save( { className: 'video-accessibility__controls' } ) }>
				<InnerBlocks.Content />
			</div>
		),
	}
);
