import block from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';
import { PanelBody, SelectControl, Icon, TextControl, Popover, Button, Toolbar, ToolbarGroup, ToolbarDropdownMenu, ButtonGroup, BaseControl, Flex } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import * as icons from '../../components/icons.js';
import { drawerRight, tool, video } from '@wordpress/icons';

const iconOptions = block.attributes.icon.enum.map( value => ( {
	value,
	label: value ? value.trim().charAt(0).toUpperCase() + value.trim().slice(1).replace( /-/g, ' ' ) : 'No icon'
} ) );

function upperCamelize( str ) {
	let res = '';

	if ( typeof str === 'string' ) {
		if ( str.length ) {
			res += str.charAt(0).toUpperCase();

		}

		if ( str.length > 1 ) {
			res += str.slice(1).replace( /-([a-zA-Z0-9])/g, ( _, char ) => char.toUpperCase() );
		}
	}

	return res;
}

registerBlockType(
	block.name,
	{
		...block,
		icon: icons.AudioDescribed,
		edit: ( { attributes, setAttributes, clientId, context, isSelected } ) => {
			const [ popoverAnchor, setPopoverAnchor ]         = useState();
			const [ iconComponentName, setIconComponentName ] = useState( upperCamelize( attributes.icon ?? '' ) );

			const currentMedia = context['video-accessibility/currentMedia'] || 0;
			const parents      = useSelect( select => select('core/block-editor').getBlockParents( clientId ).map( id => select('core/block-editor').getBlock( id ) ) );
			const parent       = parents && parents.length ? parents[ parents.length - 1 ] : null;
			const blockIndex   = parent && parent.innerBlocks ? parent.innerBlocks.filter( ib => 'panel' === ib.attributes.control ).map( ib => ib.clientId ).findIndex( blockClientId => blockClientId === clientId ) : -1;
			const rootBlock    = parents.find( block => block.name === 'video-accessibility/block' );

			const updateContext = ( context ) => {
				dispatch( 'core/block-editor' ).updateBlock(
					rootBlock.clientId,
					{
						attributes: {
							...rootBlock.attributes,
							...context
						}
					}
				);
			}

			useEffect( () => {
				setIconComponentName( upperCamelize( attributes.icon ) );
			}, [ attributes.icon ] );

			return (
				<>
					<BlockControls>
						<Toolbar label="Control Options">
							<ToolbarGroup>
								<ToolbarDropdownMenu
									label="Control Type"
									icon={ tool }
									controls={ [
										{
											title: 'Switch Video',
											icon: video,
											onClick: () => setAttributes( { control: 'switch' } ),
											isActive: 'switch' === attributes.control,
										},
										{
											title: 'Panel',
											icon: drawerRight,
											onClick: () => setAttributes( { control: 'panel' } ),
											isActive: 'panel' === attributes.control,
										},
									] }
								/>
							</ToolbarGroup>
						</Toolbar>
					</BlockControls>
					<InspectorControls>
						<PanelBody>
							<SelectControl
								label={ __( 'Control', 'video-accessibility' ) }
								value={ attributes.control }
								options={ [
									{
										value: 'switch',
										label: 'Switch Video'
									},
									{
										value: 'panel',
										label: 'Panel',
									},
								] }
								onChange={ control => setAttributes( { control } ) }
							/>
							<SelectControl
								label={ __( 'Icon', 'video-accessibility' ) }
								value={ attributes.icon }
								options={ iconOptions }
								onChange={ icon => setAttributes( { icon } ) }
							/>
							<TextControl
								label={__('Button Text', 'video-accessibility')}
								value={ attributes.text }
								onChange={ text => setAttributes( { text } ) }
							/>
							{ 'switch' === attributes.control && (
								<TextControl
									label={__("Secondary Toggle Button Text",'video-accessibility')}
									value={ attributes.switchText }
									onChange={ switchText => setAttributes( { switchText } ) }
								/>
							) }
						</PanelBody>
					</InspectorControls>
					<div { ...useBlockProps( { className: 'video-accessibility__control' } ) }>
						<button
							className='wp-block-button__link'
							ref={ setPopoverAnchor }
							onClick={ () => {
								if ( 'panel' === attributes.control ) {
									updateContext( { currentPanel: blockIndex } );
								}
							} }
						>
							{ ( iconComponentName && icons[ iconComponentName ] ) && (
								<Icon icon={ icons[ iconComponentName ] } />
							) }

							{ ( 'switch' === attributes.control && 1 === currentMedia ? attributes.switchText : attributes.text ) || 'Panel Label...' }

							{ isSelected && (
								<Popover
									anchor={ popoverAnchor }
									className="video-accessibility__popover"
									placement="bottom"
								>
									<TextControl
										label="Button Text"
										value={ attributes.text }
										onChange={ text => setAttributes( { text } ) }
									/>

									{ 'switch' === attributes.control && (
										<>
											<TextControl
												label={ __( 'Secondary Toggle Button Text' ) }
												value={ attributes.switchText }
												onChange={ switchText => setAttributes( { switchText } ) }
											/>
										</>
									) }
								</Popover>
							) }
						</button>
					</div>
				</>
			);
		},
		save: () => {
			useBlockProps.save();
			return null;
		}
	}
);
