(()=>{"use strict";const e=window.React,t=JSON.parse('{"apiVersion":2,"name":"video-accessibility/statement","title":"Accessibility Statement","description":"Accessibility statement generated from the settings page.","category":"embed","parent":["video-accessibility/panel","video-accessibility/aside-default"],"supports":{"className":false},"attributes":{"custom":{"type":"boolean","default":false}},"usesContext":["video-accessibility/statement/blockId"],"render":"file:render.php","editorScript":"file:index.js"}'),n=window.wp.blocks,l=window.wp.blockEditor,c=window.wp.components,s=(window.wp.i18n,window.wp.apiFetch),a=window.wp.element,i=window.wp.autop;(0,n.registerBlockType)(t.name,{...t,icon:function(){return(0,e.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"45",height:"21",viewBox:"0 0 308.25 104.28",fill:"currentColor"},(0,e.createElement)("title",null,"Audio Described"),(0,e.createElement)("g",null,(0,e.createElement)("path",{d:"m0,104.28L46.13,0h23.26l46.13,104.28h-22.46l-9.49-22.06h-51.47l-9.63,22.06H0Zm40.78-42.25h34.09l-16.98-39.04-17.11,39.04Z"}),(0,e.createElement)("path",{d:"m121.95,104.28V0h44.79c33.02,0,54.01,18.72,54.01,52.01s-21.52,52.28-54.01,52.28h-44.79Zm20.86-18.72h23.93c20.46,0,32.62-12.03,32.62-33.69s-12.17-33.16-32.62-33.16h-23.93v66.85Z"}),(0,e.createElement)("path",{d:"m214.69,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.53,31.8,21.53,51.03,0,20.6-8.02,40.36-21.53,53.25h-14.44Z"}),(0,e.createElement)("path",{d:"m243.49,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.52,31.8,21.52,51.03,0,20.6-8.02,40.36-21.52,53.25h-14.44Z"}),(0,e.createElement)("path",{d:"m272.28,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.53,31.8,21.53,51.03,0,20.6-8.02,40.36-21.53,53.25h-14.44Z"})))},edit:({attributes:t,setAttributes:n})=>{const[o,r]=(0,a.useState)(!1),[m,d]=(0,a.useState)(null),[u,p]=(0,a.useState)(null);return(0,a.useEffect)((()=>{t.custom||(r(!0),p(null),s({path:"/video-accessibility/v1/settings"}).then((e=>{d((0,i.autop)(e.video_accessibility_statement||""))})).catch((e=>{console.error(e),p(e)})).finally((()=>{r(!1)})))}),[t.custom]),(0,e.createElement)(e.Fragment,null,(0,e.createElement)(l.InspectorControls,null,(0,e.createElement)(c.PanelBody,null,(0,e.createElement)(c.ToggleControl,{label:"Use custom statement",checked:t.custom,onChange:e=>n({custom:e})}))),(0,e.createElement)("div",{...(0,l.useBlockProps)({className:"video-accessibility__aside-content"})},t.custom?(0,e.createElement)(l.InnerBlocks,{allowedBlocks:["core/heading","core/paragraph","core/list"],template:[["core/heading",{level:3}],["core/paragraph"]]}):o?(0,e.createElement)(c.Spinner,null):u?u.toString():(0,e.createElement)("div",{dangerouslySetInnerHTML:{__html:m}})))},save:({attributes:t})=>t.custom?(0,e.createElement)(l.InnerBlocks.Content,null):null})})();