import block from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { AudioDescribed as icon } from '../../components/icons.js';

registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: function ( { context, clientId } ) {
			const currentPanel = context['video-accessibility/currentPanel'] ?? -1;

			useSelect( select => {
				const aside   = select('core/block-editor').getBlock( clientId );
				const content = aside.innerBlocks.find( innerBlock => 'video-accessibility/aside-content' === innerBlock.name );
				const panels  = aside.innerBlocks.find( innerBlock => 'video-accessibility/panels' === innerBlock.name );

				if ( ! content || ! panels ) {
					return;
				}

				const contentNode = document.getElementById(`block-${content.clientId}`);
				const panelsNode  = document.getElementById(`block-${panels.clientId}`);

				if ( ! contentNode || ! panelsNode ) {
					return;
				}

				if ( currentPanel > -1 ) {
					// has a panel control active
					contentNode.hidden = true;
					panelsNode.removeAttribute('hidden');

					panels.innerBlocks.forEach( ( panel, panelIndex ) => {
						const panelNode = document.getElementById(`block-${panel.clientId}`);

						if ( panelNode ) {
							if ( currentPanel === panelIndex ) {
								panelNode.removeAttribute('hidden');
							} else {
								panelNode.hidden = true;
							}
						}
					} );
				} else {
					// default content
					panelsNode.hidden = true;
					contentNode.removeAttribute('hidden');
					panels.innerBlocks.map( innerBlock => document.getElementById(`block-${innerBlock.clientId}`) ).filter( n => n instanceof HTMLElement ).forEach( panelNode => panelNode.hidden = true );
				}
			}, [ currentPanel, clientId ] );

			return (
				<div { ...useBlockProps({ className: 'video-accessibility__aside' }) }>
					<InnerBlocks
						allowedBlocks={ [
							'video-accessibility/aside-content',
							'video-accessibility/panels',
						] }
						template={ [
							[
								'video-accessibility/aside-content',
							],
							[
								'video-accessibility/panels',
								{},
								[
									[
										'video-accessibility/panel',
										{},
										[
											["core/heading",
												{
													content: "Transcript",
													level: 2,
													className: "video-accessibility__panel-heading",
												},
											],
											[
												'video-accessibility/transcript',
												{
													title: 'Transcript'
												},
												[
													[
														'video-accessibility/transcript'
													]
												]
											],
										]
									],
									[
										'video-accessibility/panel',
										{},
										[
											["core/heading",
												{
													content: "Accessibility Statement",
													level: 2,
													className: "video-accessibility__panel-heading",
												},
											],
											[
												'video-accessibility/statement',
												{
													title: 'Accessibility Statement'
												},
												[
													[
														'video-accessibility/statement'
													]
												]
											]
										]
									]
								],
							],
						] }
						templateLock={false}
					/>
				</div>
			)
		},
		save: () => (
			<div { ...useBlockProps.save({ className: 'video-accessibility__aside' }) }>
				<InnerBlocks.Content />
			</div>
		),
	}
);
