import block from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { autop } from '@wordpress/autop';
import { AudioDescribed as icon } from '../../components/icons.js';

registerBlockType(
	block.name,
	{
		...block,
		icon,
		edit: ( { attributes, setAttributes } ) => {
			const [ loading, setLoading ]     = useState( false );
			const [ statement, setStatement ] = useState( null );
			const [ error, setError ]         = useState( null );

			useEffect( () => {
				if ( ! attributes.custom ) {
					setLoading(true);
					setError(null);

					apiFetch({
						path: '/video-accessibility/v1/settings'
					}).then(response => {
						setStatement( autop( response.video_accessibility_statement || '' ) );
					}).catch((error) => {
						console.error(error);
						setError(error);
					}).finally(() => {
						setLoading(false);
					});
				}
			}, [ attributes.custom ] );

			return (
				<>
					<InspectorControls>
						<PanelBody>
							<ToggleControl
								label="Use custom statement"
								checked={ attributes.custom }
								onChange={ custom => setAttributes( { custom } ) }
							/>
						</PanelBody>
					</InspectorControls>
					<div { ...useBlockProps( { className: 'video-accessibility__aside-content' } ) }>
						{ attributes.custom ? (
							<InnerBlocks
								allowedBlocks={ [
									'core/heading',
									'core/paragraph',
									'core/list',
								] }
								template={ [
									[
										'core/heading',
										{
											level: 3
										}
									],
									[
										'core/paragraph',
									],
								] }
							/>
						) : loading ? (
							<Spinner />
						) : error ? (
							error.toString()
						) : (
							<div dangerouslySetInnerHTML={ { __html: statement } } />
						) }
					</div>
				</>
			)
		},
		save: ( { attributes } ) => attributes.custom ? <InnerBlocks.Content /> : null,
	}
);

