(()=>{"use strict";const e=window.React,t=JSON.parse('{"apiVersion":2,"name":"video-accessibility/transcript","title":"Transcript","description":"Transcript within a video accessibility block.","category":"embed","parent":["video-accessibility/panel","video-accessibility/aside-default"],"supports":{"className":true},"attributes":{"file":{"type":"number"},"displayDownloadBtn":{"type":"boolean","default":false},"buttonText":{"type":"string","default":"Download transcript"}},"render":"file:render.php","editorScript":"file:index.js"}'),l=window.wp.blocks,n=window.wp.blockEditor,a=window.wp.components,i=window.wp.i18n,r=window.wp.data,o=window.wp.element;(0,l.registerBlockType)(t.name,{...t,icon:function(){return(0,e.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"45",height:"21",viewBox:"0 0 308.25 104.28",fill:"currentColor"},(0,e.createElement)("title",null,"Audio Described"),(0,e.createElement)("g",null,(0,e.createElement)("path",{d:"m0,104.28L46.13,0h23.26l46.13,104.28h-22.46l-9.49-22.06h-51.47l-9.63,22.06H0Zm40.78-42.25h34.09l-16.98-39.04-17.11,39.04Z"}),(0,e.createElement)("path",{d:"m121.95,104.28V0h44.79c33.02,0,54.01,18.72,54.01,52.01s-21.52,52.28-54.01,52.28h-44.79Zm20.86-18.72h23.93c20.46,0,32.62-12.03,32.62-33.69s-12.17-33.16-32.62-33.16h-23.93v66.85Z"}),(0,e.createElement)("path",{d:"m214.69,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.53,31.8,21.53,51.03,0,20.6-8.02,40.36-21.53,53.25h-14.44Z"}),(0,e.createElement)("path",{d:"m243.49,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.52,31.8,21.52,51.03,0,20.6-8.02,40.36-21.52,53.25h-14.44Z"}),(0,e.createElement)("path",{d:"m272.28,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.53,31.8,21.53,51.03,0,20.6-8.02,40.36-21.53,53.25h-14.44Z"})))},edit:({attributes:t,setAttributes:l})=>{const c=(0,r.useSelect)((e=>e("core").getMedia(t.file)),[t.file]),[s,d]=(0,o.useState)(null);return(0,o.useEffect)((()=>{c&&fetch(c.source_url).then((e=>e.text())).then((e=>{d(e.replace(/\\r/g,"").split("\n"))}))}),[c]),(0,e.createElement)(e.Fragment,null,(0,e.createElement)(n.InspectorControls,null,(0,e.createElement)(a.PanelBody,null,(0,e.createElement)(a.BaseControl,{label:"Transcript File",help:"Select a text file to upload for the transcript: .txt and .vtt recommended"},(0,e.createElement)(a.Flex,null,(0,e.createElement)(n.MediaUploadCheck,null,(0,e.createElement)(n.MediaUpload,{allowedTypes:["text/plain"],value:t.file,onSelect:e=>l({file:e.id}),render:({open:l})=>(0,e.createElement)(a.Button,{className:"video-accessibility__transcript-preview",onClick:l},t.file?c?c.source_url.split("/").pop():(0,e.createElement)(a.Spinner,null):(0,i.__)("Import Transcript","video-accessibility"))}))))),(0,e.createElement)(a.PanelBody,null,(0,e.createElement)(a.ToggleControl,{label:"Display transcript download button",help:"Automatically add a download link from the file used for the transcript import. For more customization, leave this unchecked and add a Wordpress Button Block to the Transcript Panel area.",checked:t.displayDownloadBtn,onChange:e=>l({displayDownloadBtn:e})}),t.displayDownloadBtn&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)(a.TextControl,{label:"Button Text",value:t.buttonText,onChange:e=>l({buttonText:e})})))),(0,e.createElement)("div",{...(0,n.useBlockProps)({className:"video-accessibility__transcript"})},t.file?(0,e.createElement)(e.Fragment,null,t.displayDownloadBtn&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)("div",{className:"wp-block-button video-accessibility__download-btn"},(0,e.createElement)(n.RichText,{allowedFormats:[],tagName:"span",value:t.buttonText,onChange:e=>l({buttonText:e}),className:"wp-block-button__link wp-element-button"}))),s?s.map(((t,l)=>(0,e.createElement)(e.Fragment,{key:l},t,(0,e.createElement)("br",null)))):(0,e.createElement)(a.Spinner,null)):(0,e.createElement)(n.MediaUploadCheck,{fallback:()=>(0,i.__)("Sorry, you don't have permission to upload transcripts","video-accessibility")},(0,e.createElement)(n.MediaUpload,{allowedTypes:["text/plain"],value:t.file,onSelect:e=>l({file:e.id}),render:({open:l})=>(0,e.createElement)(a.Button,{className:"video-accessibility__transcript-preview",onClick:l},t.file?c?c.source_url.split("/").pop():(0,e.createElement)(a.Spinner,null):(0,i.__)("Import Transcript","video-accessibility"))}))))},save:()=>null})})();