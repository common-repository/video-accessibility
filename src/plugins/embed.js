import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const withEmbedSchema = createHigherOrderComponent( BlockEdit => {
	return ( block ) => {
		const [ schema, setSchema ] = useState();
		const { attributes } = block;
		const canGetSchema   = 'core/embed' === block.name && [ 'youtube', 'vimeo' ].includes( block.attributes.providerNameSlug );

		useEffect( () => {
			if ( canGetSchema && attributes.url ) {
				const params = new URLSearchParams( {
					url: attributes.url,
					provider: attributes.providerNameSlug
				} );

				apiFetch( {
					path: `video-accessibility/v1/schema?${params}`
				} ).then((response) => {
					setSchema( response );
				} ).catch( err => console.error( err ) );
			}
		}, [ canGetSchema, attributes.url ] );

		return (
			<>
				<BlockEdit {...block} />

				{ canGetSchema && (
					<InspectorControls>
						<PanelBody title="Video Schema" initialOpen>
							{ schema && (
								<>
									<TextControl
										label="Name"
										value={ schema.name || '' }
										readOnly
									/>
									<TextareaControl
										label="Description"
										value={ schema.description || '' }
										readOnly
									/>
									<TextControl
										label="Duration"
										value={ schema.duration || '' }
										readOnly
									/>
									<TextControl
										label="Thumbnail"
										value={ schema.thumbnailUrl || '' }
										readOnly
									/>
									{ schema.thumbnailUrl && (
										<img src={ schema.thumbnailUrl } style={ { maxWidth: '100%', width: 'auto', height: 'auto' } } />
									) }
									<TextControl
										label="Upload Date"
										value={ schema.uploadDate || '' }
										readOnly
									/>
								</>
							) }
						</PanelBody>
					</InspectorControls>
				) }
			</>
		);
	}
}, 'withEmbedSchema' );

addFilter( 'editor.BlockEdit', `video-accessibility/embed-schema`, withEmbedSchema, 1 );
