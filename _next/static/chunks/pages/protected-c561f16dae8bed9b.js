(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[322],{4660:(e,t,i)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/protected",function(){return i(4249)}])},4249:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>m});var r=i(4848),s=i(6540),a=i(3368),l=i.n(a),n=i(1458),c=i(3533),o=i(3271),d=i(6118),p=i(4731);d.t1.register(d.PP,d.kc,d.FN,d.No,d.hE,d.m_,d.s$);let u={responsive:!0,plugins:{legend:{position:"top"},title:{display:!0,text:"ADA Price Prediction"}}};function h(){let[e,t]=(0,s.useState)(null);return(0,s.useEffect)(()=>{fetch("/api/price-prediction").then(e=>e.json()).then(e=>{t(function(e){if(!e)return null;let t=e.data.reverse().reduce((e,t)=>(e.timestamp.push(t.timestamp),e.price.push(t.price),e.predict.push(t.predict),e),{timestamp:[],price:[],predict:[]});return{labels:t.timestamp,datasets:[{label:"Predicted Price",data:t.predict,borderColor:"rgb(255, 99, 132)",backgroundColor:"rgba(255, 99, 132, 0.5)"},{label:"Real Price",data:t.price,borderColor:"rgb(53, 162, 235)",backgroundColor:"rgba(53, 162, 235, 0.5)"}]}}(e))}).catch(e=>{console.log(e)})},[]),(0,r.jsx)("div",{className:"bg-white",children:e&&(0,r.jsx)(p.N1,{options:u,data:e})})}var x=i(3118);let m=()=>{(0,x.x)();let{checkPremiumAccessByToken:e,premiumAccessStatus:t}=(0,n.vT)();return(0,s.useEffect)(()=>{e()},[]),(0,r.jsxs)("div",{children:[(0,r.jsx)(l(),{children:(0,r.jsx)("title",{children:"Halal ADA - HLAL1: Halal ADA Staking Pool"})}),(0,r.jsx)(c.Y,{}),(0,r.jsxs)("section",{className:"default-page container mx-auto relative overflow-hidden pt-60 pl-6 sm:pl-0 pr-6 sm:pr-0",children:[(0,r.jsx)("h1",{className:"text-5xl c-white mb-16","data-aos":"fade-down",children:"ADA Price Prediction"}),("unknown"===t||"checking"===t)&&(0,r.jsx)("div",{className:"text-3xl text-white",children:"Connecting to wallet..."}),"granted"===t&&(0,r.jsx)(h,{}),"denied"===t&&(0,r.jsx)("div",{className:"text-white",children:"This is premium content, to access you should get HLAL1 token."})]}),(0,r.jsx)(o.w,{})]})}}},e=>{var t=t=>e(e.s=t);e.O(0,[69,180,348,201,904,734,888,672,636,593,792],()=>t(4660)),_N_E=e.O()}]);