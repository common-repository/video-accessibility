import block from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { PanelBody, Spinner, Button, BaseControl, Flex, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { AudioDescribed as icon } from '../../components/icons.js';

/**
 * This block renders a plain text file for the uploading a transcript
 */
registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: ( { attributes, setAttributes } ) => {
			const file = useSelect( select => select('core').getMedia( attributes.file ), [ attributes.file ] );
			const [ fileLines, setFileLines ] = useState( null );

			useEffect( () => {
				if ( file ) {
					fetch( file.source_url ).then(( response ) => {
						return response.text();
					}).then( text => {
						setFileLines( text.replace( /\\r/g, '' ).split("\n") );
					});
				}
			}, [ file ] );

			return (
				<>
					<InspectorControls>
						<PanelBody>
							<BaseControl label="Transcript File" help="Select a text file to upload for the transcript: .txt and .vtt recommended">
								<Flex>
									<MediaUploadCheck>
										<MediaUpload
											allowedTypes={ [ 'text/plain' ] }
											value={ attributes.file }
											onSelect={ file => setAttributes( { file: file.id } ) }
											render={ ({ open }) => (
												<Button
													className="video-accessibility__transcript-preview"
													onClick={ open }
												>
													{ attributes.file ? (
														file ? (
															file.source_url.split('/').pop()
														) : (
															<Spinner />
														)
													) : (
														__("Import Transcript", 'video-accessibility')
													) }
												</Button>
											) }
										/>
									</MediaUploadCheck>
								</Flex>
							</BaseControl>
						</PanelBody>
						<PanelBody>
						<ToggleControl
								label="Display transcript download button"
								help = "Automatically add a download link from the file used for the transcript import. For more customization, leave this unchecked and add a Wordpress Button Block to the Transcript Panel area."
								checked={ attributes.displayDownloadBtn }
								onChange={ displayDownloadBtn => setAttributes({ displayDownloadBtn }) }
							/>
							{ attributes.displayDownloadBtn && (
								<>
								<TextControl
									label="Button Text"
									value={ attributes.buttonText }
									onChange={ buttonText => setAttributes({ buttonText }) }
								/>
								</>
							)}
						</PanelBody>
					</InspectorControls>
					<div {...useBlockProps( { className: 'video-accessibility__transcript' } ) }>
						{ attributes.file ? (
							<>
							{ attributes.displayDownloadBtn && (
								<>
								
									<div className="wp-block-button video-accessibility__download-btn">
										<RichText
												allowedFormats={ [] }
												tagName="span"
												value={ attributes.buttonText }
												onChange={ buttonText => setAttributes({ buttonText }) }
												className="wp-block-button__link wp-element-button"
											/>
										
									</div>
								</>
							)}
							{fileLines ? (
								fileLines.map( ( line, lineIndex ) => (
									<Fragment key={ lineIndex }>
										{ line }
										<br />
									</Fragment>
								) )
							) : (
								<Spinner />
							)}
							
							</>
						) : (
							<MediaUploadCheck fallback={ () => __( "Sorry, you don't have permission to upload transcripts", 'video-accessibility' ) }>
								<MediaUpload
									allowedTypes={ [ 'text/plain' ] }
									value={ attributes.file }
									onSelect={ file => setAttributes( { file: file.id } ) }
									render={ ({ open }) => (
										<Button
											className="video-accessibility__transcript-preview"
											onClick={ open }
										>
											{ attributes.file ? (
												file ? (
													file.source_url.split('/').pop()
												) : (
													<Spinner />
												)
											) : (
												__("Import Transcript", 'video-accessibility')
											) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
						) }
					</div>
				</>
			)
		},
		save: () => null,
	}
);
