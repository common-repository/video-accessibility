=== Video Accessibility ===
Contributors: fordfoundation
Tags: accessibility, video, audio-described
Requires at least: 6.2
Tested up to: 6.5.3
Stable tag: 1.0.6
Requires PHP: 8.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

== Description ==

<strong>Better video accessibility everywhere.</strong>

Display video transcripts next to embeds, toggle between two videos, and display a site-wide statement all in a single block.

= Features =
* Display a scrollable video transcript next to a video embed. Upload a plain text file transcript or create one in admin.
* Switch the embed player to display a second video. Ideal for displaying audio-described and non-audio-described versions of a video.
* Display a site-wide statement next to each embed.
* Responsive one or two column layout
* Intuitive block that supports two videos and multiple sidebar panels
* Customizable colors and fonts - block inherits existing site styles

= Benefits =
Improve site-wide video accessibility by

* Displaying transcripts next to embeds
* Providing the ability to switch between two videos in the same embed (which allows for seamless display of audio-described and non-audio-described video)
* Presenting a site-wide message (which could be your site's accessibility statement)


### Schema.org VideoObject
Automatically adds the [schema.org VideoObject schema](https://schema.org/VideoObject) to Video and Vimeo embed blocks. For the YouTube embed block, a YouTube API key can be added to the plugin settings page to fetch video data. For more information please read YouTube [developer documentation](https://developers.google.com/youtube) and [terms](https://developers.google.com/youtube/terms/api-services-terms-of-service).
The following VideoObject schema will be added:

* embedUrl or contentUrl
* description
* duration
* name
* thumbnailUrl
* uploadDate
* height
* width

== Installation ==
= Minimum Requirements =
* WordPress 6.2 or greater
* PHP version 8.0 or greater

= Recommended Requirements =
* WordPress 6.4.2 or greater
* PHP version 8.0 or greater

= Installation and Usage =
1. Install using the WordPress built-in Plugin installer, or extract the zip file and drop the contents in the wp-content/plugins/ directory of your WordPress installation.
2. Activate the plugin through the ‘Plugins’ menu in WordPress.
3. Configure settings via Dashboard > Settings > Video Accessibility. The YouTube API key is optional. The Default Video Statement allows for a site-wide statement to be displayed in the block. This could be used for something such as an accessibility standards statement.
4. Navigate to any post, page or custom post type item. Using any block insertion method, add the Video Accessibility block.
5. Select a One column or Two column Layout as well as whether default panel content should display. The default content supports core text, image, media & text, and buttons blocks.
6. Add Primary Video and Secondary Video data into the blocks.
7. Edit Toggle Button text: text that displays initially in the video toggle switch button.
8. Edit Secondary Button text: the text that displays after the button has been clicked.
9. Edit Transcript: Selecting this button for editing will also display the corresponding Transcript panel block. This area is where a transcript plain text file could be imported or this block also supports core text, image and buttons blocks.
10. Edit Accessibility Statement: Selecting this button for editing will also display the corresponding Accessibility Statement panel block. This area is where the text from the plugin settings is displayed. Optionally edit this block on an as-needed with core text, image and buttons blocks.

== Screenshots ==
1. Front-end visual
2. Responsive view
3. Editor view
4. Link to videos
5. Customizable button text
6. Editable text transcript

== Changelog ==
= 1.0.6 =
* Enhancement - Video Accessibility Parent Block: adds the ability for WordPress users to turn on/off screen reader messaging.
* Enhancement - Video Accessibility Transcript Block: adds the ability for WordPress admins to turn on/off the addition of an automatic transcript download button linking to the file used for transcript import.
* Enhancement - Changes to the JavaScript behavior of the two-column view at sizes 781 and below to hide all panels until transcript or statement button is selected.
* Bug Fix - Stop videos in block only when switching between videos
* Improvement - Change block.json `script` to `editorScript`

= 1.0.5 =
* Bug Fix - Allow for empty YouTube embed blocks

= 1.0.4 =
* Fix Missing build files

= 1.0.3 =
* Update Docs

= 1.0.2 =
* New - Add settings link to the plugin page

= 1.0.1 =
* New - readme updates
* New - missing build folder
* WordPress 6.4.1 testing

= 1.0.0 =
* Initial release