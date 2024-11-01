import block from './block.json';
import classNames from 'classnames';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, BlockControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, BaseControl, Flex, Toolbar, ToolbarGroup, Button, ButtonGroup, ToolbarDropdownMenu, ToggleControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { drawerRight, video } from '@wordpress/icons';
import { AudioDescribed as icon } from '../../components/icons.js';
import './editor-style.scss';
import './style.scss';

import "../../plugins/embed.js";

const v1 = {
    save: ({ attributes }) => (
		<div { ...useBlockProps.save({
			className: classNames({
				'video-accessibility': true,
				[`video-accessibility--${ attributes.layout }`]: attributes.layout,
				[`video-accessibility--no-default`]: !attributes.displayDefault,
			})
		}) }>
			<InnerBlocks.Content />
		</div>
	),
};
const deprecated = [ v1 ];

registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: function ({ attributes, setAttributes, clientId }) {
			const block = useSelect(select => select('core/block-editor').getBlock(clientId));
			const controls = block.innerBlocks.find(innerBlock => 'video-accessibility/controls' === innerBlock.name);

			// always start on the first panel in the admin
			useEffect(() => {
				setAttributes({
					currentMedia: 0,
					currentPanel: -1,
				});
			}, []);

			const panelDropdownMenuControls = [
				{
					title: 'Default Panel',
					icon: drawerRight,
					onClick: () => setAttributes({ currentPanel: -1 }),
					isActive: attributes.currentPanel === -1,
				},
			];

			if (controls && controls.innerBlocks) {
				controls.innerBlocks.filter(innerBlock => 'panel' === innerBlock.attributes.control).forEach((control, currentPanel) => {
					panelDropdownMenuControls.push({
						title: control.attributes.text || `Panel ${ currentPanel }`,
						icon: drawerRight,
						onClick: () => setAttributes({ currentPanel }),
						isActive: currentPanel === attributes.currentPanel,
					});
				});
			}

			const menuDropdownMenuControls = [
				{
					title: 'Primary',
					icon: video,
					onClick: () => setAttributes({ currentMedia: 0 }),
					isActive: 0 === attributes.currentMedia,
				},
				{
					title: 'Secondary',
					icon: video,
					onClick: () => setAttributes({ currentMedia: 1 }),
					isActive: 1 === attributes.currentMedia,
				},
			];

			return (
				<>
					<BlockControls>
						<Toolbar label="Options">
							<ToolbarGroup>
								<ToolbarDropdownMenu
									label="Select media to edit"
									icon={ video }
									controls={ menuDropdownMenuControls }
								/>
							</ToolbarGroup>
							<ToolbarGroup>
								<ToolbarDropdownMenu
									label="Select a panel to edit"
									icon={ drawerRight }
									controls={ panelDropdownMenuControls }
								/>
							</ToolbarGroup>
						</Toolbar>
					</BlockControls>
					<InspectorControls>
						<PanelBody>
							<BaseControl label="Layout">
								<Flex>
									<ButtonGroup>
										<Button
											onClick={ () => setAttributes({ layout: '1c' }) }
											isPressed={ attributes.layout === '1c' }
										>
											{ __('One column', 'video-accessibility') }
										</Button>
										<Button
											onClick={ () => setAttributes({ layout: '2c' }) }
											isPressed={ attributes.layout === '2c' }
										>
											{ __('Two columns', 'video-accessibility') }
										</Button>
									</ButtonGroup>
								</Flex>
							</BaseControl>
							<ToggleControl
								label="Display initial default panel"
								checked={ attributes.displayDefault }
								onChange={ displayDefault => setAttributes({ displayDefault }) }
							/>
							<ToggleControl
								label="Add screen reader message"
								help = "Include screen reader text that is hidden on the page. This hidden text will be positioned before the video player controls and can indicate if audio descriptions are available before a user hits play. Only fill out the Primary Video Screen Reader Text to add a single message. Fill out both Primary and Secondary text to have the text swap when the switch button is clicked."
								checked={ attributes.displayScreenReaderText }
								onChange={ displayScreenReaderText => setAttributes({ displayScreenReaderText }) }
							/>
							{ attributes.displayScreenReaderText && (
								<>
								<TextareaControl
									label="Primary Video Screen Reader Text"
									value={ attributes.primaryScreenReaderText }
									onChange={ primaryScreenReaderText => setAttributes({ primaryScreenReaderText }) }
								/>
								<TextareaControl
									label="Secondary Video Screen Reader Text"
									value={ attributes.secondaryScreenReaderText }
									onChange={ secondaryScreenReaderText => setAttributes({ secondaryScreenReaderText }) }
								/>
								</>
							)}
						</PanelBody>
					</InspectorControls>
					<div { ...useBlockProps({
						className: classNames({
							'video-accessibility': true,
							[`video-accessibility--${ attributes.layout }`]: attributes.layout,
							[`video-accessibility--no-default`]: !attributes.displayDefault,
						})
					}) }>
						{ attributes.displayScreenReaderText && attributes.primaryScreenReaderText && (
							<p className="video-accessibility__srt visually-hidden">
							{ attributes.primaryScreenReaderText && (<span className="video-accessibility__srt--primary">{attributes.primaryScreenReaderText}</span>)}
							{ attributes.secondaryScreenReaderText && (<span className="video-accessibility__srt--secondary" hidden>{attributes.secondaryScreenReaderText}</span>)}
							</p>
						)}
						<InnerBlocks
							template={ [
								['video-accessibility/media'],
								['video-accessibility/controls'],
								['video-accessibility/aside'],
							] }
							templateLock="all"
						/>
					</div>
				</>
			)
		},
		save: ({ attributes }) => (
			<div { ...useBlockProps.save({
				className: classNames({
					'video-accessibility': true,
					[`video-accessibility--${ attributes.layout }`]: attributes.layout,
					[`video-accessibility--no-default`]: !attributes.displayDefault,
				})
			}) }>
				{ attributes.displayScreenReaderText && attributes.primaryScreenReaderText && (
					<p className="video-accessibility__srt visually-hidden">
					{ attributes.primaryScreenReaderText && (<span className="video-accessibility__srt--primary">{attributes.primaryScreenReaderText}</span>)}
					{ attributes.secondaryScreenReaderText && (<span className="video-accessibility__srt--secondary" hidden>{attributes.secondaryScreenReaderText}</span>)}
					</p>
				)}
				<InnerBlocks.Content />
			</div>
		),
		deprecated
	}
	
);
