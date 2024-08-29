import{r as l,j as e}from"./index-Cq3cNOe4.js";import{a as x}from"./axios-Bl1vbFzL.js";import{C as X,a as Y,b as H,c as d,d as Z,e as h,h as _,E as ee}from"./jspdf.es.min-DhbDYEgH.js";import{a as s,c as E}from"./index.esm-BVbxNr3O.js";import{C as ae,a as oe}from"./CRow-CR1dTeP1.js";import{C as re,a as le}from"./CCardBody-BZy5Kcki.js";import{C as se}from"./CCardHeader-Drjisk7v.js";import{c as ne,a as ie,b as te,d as ce}from"./cil-trash-BnkbpAXr.js";import{C as c}from"./CFormInput-CPK1Hc24.js";import{C as F,a as I,b as L,c as N}from"./CModalHeader-DM5zFOOe.js";import{C as w}from"./CFormSelect-sMFcUcNb.js";import"./DefaultLayout-VGzP6Txu.js";const Pe=()=>{const[p,u]=l.useState([]),[G,z]=l.useState([]),[n,S]=l.useState(null),[B,C]=l.useState(!1),[R,v]=l.useState(!1),[$,f]=l.useState(!1),[i,M]=l.useState({}),[t,D]=l.useState({marca:"",color:"",proveedor:0,tipo:"Lapiz",cantidad:0}),[k,q]=l.useState("");l.useEffect(()=>{const a=async()=>{try{const o=await x.get("http://localhost:4000/Papeleria");u(o.data)}catch(o){console.error("Error fetching Papeleria:",o)}},r=async()=>{try{const o=await x.get("http://localhost:4000/proveedores");z(o.data)}catch(o){console.error("Error fetching proveedores:",o)}};a(),r()},[]);const U=async()=>{try{const a=await x.post("http://localhost:4000/Papeleria",t);u([...p,a.data]),v(!1),D({marca:"",color:"",proveedor:0,tipo:"Lapiz",cantidad:0})}catch(a){console.error("Error adding item:",a)}},W=async()=>{try{await x.delete(`http://localhost:4000/Papeleria/${n}`);const a=p.filter(r=>r.id!==n);u(a),S(null),f(!1)}catch(a){console.error("Error deleting item:",a)}},J=a=>{const r=p.find(o=>o.id===a);M(r),S(a),C(!0)},m=a=>{const{name:r,value:o}=a.target;M({...i,[r]:o})},j=a=>{const{name:r,value:o}=a.target;D({...t,[r]:o})},K=async()=>{try{const a=await x.put(`http://localhost:4000/Papeleria/${n}`,i),r=p.map(o=>o.id===n?a.data:o);u(r),C(!1)}catch(a){console.error("Error updating item:",a)}},O=()=>{const a=document.getElementById("table-to-pdf");_(a,{scale:2}).then(r=>{const o=r.toDataURL("image/png"),g=new ee("p","mm","a4"),y=210,A=295,b=r.height*y/r.width;let P=b,T=0;for(g.addImage(o,"PNG",0,T,y,b),P-=A;P>=0;)T=P-b,g.addPage(),g.addImage(o,"PNG",0,T,y,b),P-=A;g.save("Papeleria.pdf")})},Q=a=>{q(a.target.value)},V=p.filter(a=>a.marca.toLowerCase().includes(k.toLowerCase()));return e.jsxs(e.Fragment,{children:[e.jsx(ae,{children:e.jsx(oe,{xs:12,children:e.jsxs(re,{className:"mb-2",children:[e.jsxs(se,{children:["Tabla Papelería",e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{className:"d-flex",children:[e.jsxs(s,{color:"primary",onClick:()=>v(!0),className:"me-2",children:[e.jsx(E,{icon:ne})," Añadir"]}),e.jsxs(s,{color:"danger",onClick:()=>f(!0),disabled:n===null,className:"me-2",children:[e.jsx(E,{icon:ie})," Eliminar"]}),e.jsxs(s,{color:"info",onClick:()=>J(n),disabled:n===null,className:"me-2",children:[e.jsx(E,{icon:te})," Editar"]}),e.jsxs(s,{color:"success",onClick:O,children:[e.jsx(E,{icon:ce})," Generar PDF"]})]}),e.jsx(c,{type:"text",placeholder:"Buscar por marca",value:k,onChange:Q,className:"w-25"})]})]}),e.jsx(le,{children:e.jsxs(X,{id:"table-to-pdf",align:"middle",className:"mb-0 border",hover:!0,responsive:!0,children:[e.jsx(Y,{className:"text-nowrap",children:e.jsxs(H,{children:[e.jsx(d,{children:"#"}),e.jsx(d,{children:"Marca"}),e.jsx(d,{children:"Color"}),e.jsx(d,{children:"Proveedor"}),e.jsx(d,{children:"Tipo"}),e.jsx(d,{children:"Cantidad"})]})}),e.jsx(Z,{children:V.map((a,r)=>e.jsxs(H,{onClick:()=>S(a.id),className:a.id===n?"table-active":"",children:[e.jsx(h,{children:r+1}),e.jsx(h,{children:a.marca}),e.jsx(h,{children:a.color}),e.jsx(h,{children:a.proveedor}),e.jsx(h,{children:a.tipo}),e.jsx(h,{children:a.cantidad})]},a.id))})]})})]})})}),e.jsxs(F,{visible:R,onClose:()=>v(!1),children:[e.jsx(I,{children:e.jsx("h5",{children:"Añadir Papelería"})}),e.jsxs(L,{children:[e.jsx(c,{label:"Marca",name:"marca",value:t.marca,onChange:j}),e.jsx(c,{label:"Color",name:"color",value:t.color,onChange:j}),e.jsxs(w,{label:"Proveedor",name:"proveedor",value:t.proveedor,onChange:j,children:[e.jsx("option",{value:"",children:"Seleccionar proveedor"}),G.map(a=>e.jsx("option",{value:a.id,children:a.nombre},a.id))]}),e.jsxs(w,{label:"Tipo",name:"tipo",value:t.tipo,onChange:j,children:[e.jsx("option",{value:"",children:"Seleccionar tipo"}),e.jsx("option",{value:"Lapiz",children:"Lapiz"}),e.jsx("option",{value:"Goma",children:"Goma"}),e.jsx("option",{value:"Sacapunta",children:"Sacapunta"}),e.jsx("option",{value:"Enmicadora",children:"Enmicadora"}),e.jsx("option",{value:"Guillotina",children:"Guillotina"}),e.jsx("option",{value:"Tijera",children:"Tijera"}),e.jsx("option",{value:"Perforadora",children:"Perforadora"}),e.jsx("option",{value:"Engrapadora",children:"Engrapadora"}),e.jsx("option",{value:"Lapicero",children:"Lapicero"}),e.jsx("option",{value:"Hojas",children:"Hojas"}),e.jsx("option",{value:"Folders",children:"Folders"}),e.jsx("option",{value:"Formato de Accesos",children:"Formato de Accesos"})]}),e.jsx(c,{label:"Cantidad",name:"cantidad",type:"number",value:t.cantidad,onChange:j})]}),e.jsxs(N,{children:[e.jsx(s,{color:"secondary",onClick:()=>v(!1),children:"Cancelar"}),e.jsx(s,{color:"primary",onClick:U,children:"Añadir"})]})]}),e.jsxs(F,{visible:B,onClose:()=>C(!1),children:[e.jsx(I,{children:e.jsx("h5",{children:"Editar Papelería"})}),e.jsxs(L,{children:[e.jsx(c,{label:"Marca",name:"marca",value:i.marca,onChange:m}),e.jsx(c,{label:"Color",name:"color",value:i.color,onChange:m}),e.jsxs(w,{label:"Proveedor",name:"proveedor",value:i.proveedor,onChange:m,children:[e.jsx("option",{value:"",children:"Seleccionar proveedor"}),G.map(a=>e.jsx("option",{value:a.id,children:a.nombre},a.id))]}),e.jsxs(w,{label:"Tipo",name:"tipo",value:i.tipo,onChange:m,children:[e.jsx("option",{value:"",children:"Seleccionar tipo"}),e.jsx("option",{value:"Lapiz",children:"Lapiz"}),e.jsx("option",{value:"Goma",children:"Goma"}),e.jsx("option",{value:"Sacapunta",children:"Sacapunta"}),e.jsx("option",{value:"Enmicadora",children:"Enmicadora"}),e.jsx("option",{value:"Guillotina",children:"Guillotina"}),e.jsx("option",{value:"Tijera",children:"Tijera"}),e.jsx("option",{value:"Perforadora",children:"Perforadora"}),e.jsx("option",{value:"Engrapadora",children:"Engrapadora"}),e.jsx("option",{value:"Lapicero",children:"Lapicero"}),e.jsx("option",{value:"Hojas",children:"Hojas"}),e.jsx("option",{value:"Folders",children:"Folders"}),e.jsx("option",{value:"Formato de Accesos",children:"Formato de Accesos"})]}),e.jsx(c,{label:"Cantidad",name:"cantidad",type:"number",value:i.cantidad,onChange:m})]}),e.jsxs(N,{children:[e.jsx(s,{color:"secondary",onClick:()=>C(!1),children:"Cancelar"}),e.jsx(s,{color:"primary",onClick:K,children:"Guardar"})]})]}),e.jsxs(F,{visible:$,onClose:()=>f(!1),children:[e.jsx(I,{children:e.jsx("h5",{children:"Eliminar Papelería"})}),e.jsx(L,{children:e.jsx("p",{children:"¿Estás seguro de que deseas eliminar este ítem?"})}),e.jsxs(N,{children:[e.jsx(s,{color:"secondary",onClick:()=>f(!1),children:"Cancelar"}),e.jsx(s,{color:"danger",onClick:W,children:"Eliminar"})]})]})]})};export{Pe as default};
