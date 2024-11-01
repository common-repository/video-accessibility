(()=>{"use strict";const e=window.React,i=JSON.parse('{"apiVersion":2,"name":"video-accessibility/aside","title":"Aside","description":"Video accessibility aside","category":"embed","supports":{"className":false,"align":true,"color":true},"parent":["video-accessibility/block"],"usesContext":["video-accessibility/currentPanel"],"attributes":{},"editorScript":"file:index.js"}'),t=window.wp.blocks,c=window.wp.blockEditor,n=(window.wp.i18n,window.wp.data);(0,t.registerBlockType)(i.name,{...i,icon:function(){return(0,e.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"45",height:"21",viewBox:"0 0 308.25 104.28",fill:"currentColor"},(0,e.createElement)("title",null,"Audio Described"),(0,e.createElement)("g",null,(0,e.createElement)("path",{d:"m0,104.28L46.13,0h23.26l46.13,104.28h-22.46l-9.49-22.06h-51.47l-9.63,22.06H0Zm40.78-42.25h34.09l-16.98-39.04-17.11,39.04Z"}),(0,e.createElement)("path",{d:"m121.95,104.28V0h44.79c33.02,0,54.01,18.72,54.01,52.01s-21.52,52.28-54.01,52.28h-44.79Zm20.86-18.72h23.93c20.46,0,32.62-12.03,32.62-33.69s-12.17-33.16-32.62-33.16h-23.93v66.85Z"}),(0,e.createElement)("path",{d:"m214.69,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.53,31.8,21.53,51.03,0,20.6-8.02,40.36-21.53,53.25h-14.44Z"}),(0,e.createElement)("path",{d:"m243.49,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.52,31.8,21.52,51.03,0,20.6-8.02,40.36-21.52,53.25h-14.44Z"}),(0,e.createElement)("path",{d:"m272.28,104.28c13.64-13.42,22.46-33.18,22.46-53.25,0-18.91-8.82-37.82-22.46-51.03h14.44c13.5,12.89,21.53,31.8,21.53,51.03,0,20.6-8.02,40.36-21.53,53.25h-14.44Z"})))},edit:function({context:i,clientId:t}){var s;const l=null!==(s=i["video-accessibility/currentPanel"])&&void 0!==s?s:-1;return(0,n.useSelect)((e=>{const i=e("core/block-editor").getBlock(t),c=i.innerBlocks.find((e=>"video-accessibility/aside-content"===e.name)),n=i.innerBlocks.find((e=>"video-accessibility/panels"===e.name));if(!c||!n)return;const s=document.getElementById(`block-${c.clientId}`),a=document.getElementById(`block-${n.clientId}`);s&&a&&(l>-1?(s.hidden=!0,a.removeAttribute("hidden"),n.innerBlocks.forEach(((e,i)=>{const t=document.getElementById(`block-${e.clientId}`);t&&(l===i?t.removeAttribute("hidden"):t.hidden=!0)}))):(a.hidden=!0,s.removeAttribute("hidden"),n.innerBlocks.map((e=>document.getElementById(`block-${e.clientId}`))).filter((e=>e instanceof HTMLElement)).forEach((e=>e.hidden=!0))))}),[l,t]),(0,e.createElement)("div",{...(0,c.useBlockProps)({className:"video-accessibility__aside"})},(0,e.createElement)(c.InnerBlocks,{allowedBlocks:["video-accessibility/aside-content","video-accessibility/panels"],template:[["video-accessibility/aside-content"],["video-accessibility/panels",{},[["video-accessibility/panel",{},[["core/heading",{content:"Transcript",level:2,className:"video-accessibility__panel-heading"}],["video-accessibility/transcript",{title:"Transcript"},[["video-accessibility/transcript"]]]]],["video-accessibility/panel",{},[["core/heading",{content:"Accessibility Statement",level:2,className:"video-accessibility__panel-heading"}],["video-accessibility/statement",{title:"Accessibility Statement"},[["video-accessibility/statement"]]]]]]]],templateLock:!1}))},save:()=>(0,e.createElement)("div",{...c.useBlockProps.save({className:"video-accessibility__aside"})},(0,e.createElement)(c.InnerBlocks.Content,null))})})();