import{r as l,j as e}from"./index-Cq3cNOe4.js";import{a as n,c as y}from"./index.esm-BVbxNr3O.js";import{C as X,a as Y,b as B,c as h,d as Z,e as m,h as _,E as ee}from"./jspdf.es.min-DhbDYEgH.js";import{a as ae}from"./axios-Bl1vbFzL.js";import{C as oe,a as se}from"./CRow-CR1dTeP1.js";import{C as ie,a as le}from"./CCardBody-BZy5Kcki.js";import{C as ne}from"./CCardHeader-Drjisk7v.js";import{c as re,a as te,b as ce,d as de}from"./cil-trash-BnkbpAXr.js";import{C as t}from"./CFormInput-CPK1Hc24.js";import{C as T,a as M,b as R,c as A}from"./CModalHeader-DM5zFOOe.js";import{C as w}from"./CFormSelect-sMFcUcNb.js";import"./DefaultLayout-VGzP6Txu.js";const we=()=>{const[b,u]=l.useState([]),[D,F]=l.useState([]),[r,P]=l.useState(null),[H,p]=l.useState(!1),[q,C]=l.useState(!1),[G,g]=l.useState(!1),[i,k]=l.useState({}),[c,I]=l.useState({tipo:"",cantidad:"",estado:"",ubicacion:0,color:"",tamano:""}),[N,U]=l.useState("");l.useEffect(()=>{const a=async()=>{try{const d=await(await fetch("http://localhost:4000/mobiliario")).json();u(d)}catch(o){console.error("Error fetching mobiliario data:",o)}};(async()=>{try{const o=await ae.get("http://localhost:4000/areas");F(o.data)}catch(o){console.error("Error fetching areas:",o)}})(),a()},[]);const z=()=>{I({tipo:"",cantidad:"",estado:"",ubicacion:0,color:"",tamano:""}),C(!0)},O=async()=>{try{await fetch(`http://localhost:4000/mobiliario/${r}`,{method:"DELETE"});const s=b.filter(o=>o.id!==r).map((o,d)=>({...o,id:d+1}));u(s),P(null),g(!1)}catch(a){console.error("Error deleting mobiliario:",a)}},J=a=>{const s=b.find(o=>o.id===a);k(s),p(!0)},x=a=>{const{name:s,value:o}=a.target;k({...i,[s]:o})},j=a=>{const{name:s,value:o}=a.target;I({...c,[s]:o})},$=async()=>{try{await fetch(`http://localhost:4000/mobiliario/${r}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});const a=b.map(s=>s.id===r?{...i,id:r}:s);u(a),p(!1)}catch(a){console.error("Error updating mobiliario:",a)}},W=async()=>{try{const s=await(await fetch("http://localhost:4000/mobiliario",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)})).json();u([...b,s]),C(!1)}catch(a){console.error("Error adding mobiliario:",a)}},K=()=>{const a=document.getElementById("table-to-pdf");_(a,{scale:2}).then(s=>{const o=s.toDataURL("image/png"),d=new ee("p","mm","a4"),E=210,L=295,f=s.height*E/s.width;let v=f,S=0;for(d.addImage(o,"PNG",0,S,E,f),v-=L;v>=0;)S=v-f,d.addPage(),d.addImage(o,"PNG",0,S,E,f),v-=L;d.save("mobiliario.pdf")})},Q=a=>{U(a.target.value)},V=b.filter(a=>a.tipo.toLowerCase().includes(N.toLowerCase())||a.color.toLowerCase().includes(N.toLowerCase()));return e.jsxs(e.Fragment,{children:[e.jsx(oe,{children:e.jsx(se,{xs:12,children:e.jsxs(ie,{className:"mb-4",children:[e.jsxs(ne,{children:["Tabla de Mobiliario",e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{className:"d-flex",children:[e.jsxs(n,{color:"primary",onClick:z,className:"me-2",children:[e.jsx(y,{icon:re})," Añadir"]}),e.jsxs(n,{color:"danger",onClick:()=>g(!0),disabled:r===null,className:"me-2",children:[e.jsx(y,{icon:te})," Eliminar"]}),e.jsxs(n,{color:"info",onClick:()=>J(r),disabled:r===null,className:"me-2",children:[e.jsx(y,{icon:ce})," Editar"]}),e.jsxs(n,{color:"success",onClick:K,children:[e.jsx(y,{icon:de})," Generar PDF"]})]}),e.jsx(t,{type:"text",placeholder:"Buscar por Tipo o Color",value:N,onChange:Q,className:"w-25 me-2"})]})]}),e.jsx(le,{children:e.jsxs(X,{id:"table-to-pdf",align:"middle",className:"mb-0 border",hover:!0,responsive:!0,children:[e.jsx(Y,{className:"text-nowrap",children:e.jsxs(B,{children:[e.jsx(h,{className:"bg-body-tertiary",children:"ID"}),e.jsx(h,{className:"bg-body-tertiary",children:"Tipo"}),e.jsx(h,{className:"bg-body-tertiary",children:"Cantidad"}),e.jsx(h,{className:"bg-body-tertiary",children:"Estado"}),e.jsx(h,{className:"bg-body-tertiary",children:"Ubicación"}),e.jsx(h,{className:"bg-body-tertiary",children:"Color"}),e.jsx(h,{className:"bg-body-tertiary",children:"Tamaño"})]})}),e.jsx(Z,{children:V.map(a=>e.jsxs(B,{onClick:()=>P(a.id),className:a.id===r?"table-active":"",children:[e.jsx(m,{children:a.id}),e.jsx(m,{children:a.tipo}),e.jsx(m,{children:a.cantidad}),e.jsx(m,{children:a.estado}),e.jsx(m,{children:a.ubicacion}),e.jsx(m,{children:a.color}),e.jsx(m,{children:a.tamano})]},a.id))})]})})]})})}),e.jsxs(T,{visible:H,onClose:()=>p(!1),children:[e.jsx(M,{children:e.jsx("h5",{children:"Editar Mobiliario"})}),e.jsx(R,{children:i&&e.jsxs(e.Fragment,{children:[e.jsxs(w,{label:"Tipo",name:"tipo",value:i.tipo,onChange:x,className:"mb-2",children:[e.jsx("option",{value:"",children:"Selecciona un tipo"}),e.jsx("option",{value:"Escritorio",children:"Escritorio"}),e.jsx("option",{value:"Silla",children:"Silla"}),e.jsx("option",{value:"Mesa",children:"Mesa"}),e.jsx("option",{value:"Anaqueles",children:"Anaqueles"}),e.jsx("option",{value:"Butaca",children:"Butaca"}),e.jsx("option",{value:"Pizarron",children:"Pizarrón"}),e.jsx("option",{value:"Libreros",children:"Libreros"})]}),e.jsx(t,{label:"Cantidad",name:"cantidad",value:i.cantidad,onChange:x,className:"mb-2"}),e.jsx(t,{label:"Estado",name:"estado",value:i.estado,onChange:x,className:"mb-2"}),e.jsxs(w,{label:"Ubicación",name:"ubicacion",value:i.ubicacion,onChange:x,className:"mb-2",children:[e.jsx("option",{value:"",children:"Selecciona una ubicación"}),D.map(a=>e.jsx("option",{value:a.idAreas,children:a.area},a.idAreas))]}),e.jsx(t,{label:"Color",name:"color",value:i.color,onChange:x,className:"mb-2"}),e.jsx(t,{label:"Tamaño",name:"tamano",value:i.tamano,onChange:x,className:"mb-2"})]})}),e.jsxs(A,{children:[e.jsx(n,{color:"secondary",onClick:()=>p(!1),children:"Cerrar"}),e.jsx(n,{color:"primary",onClick:$,children:"Guardar Cambios"})]})]}),e.jsxs(T,{visible:q,onClose:()=>C(!1),children:[e.jsx(M,{children:e.jsx("h5",{children:"Añadir Mobiliario"})}),e.jsxs(R,{children:[e.jsxs(w,{label:"Tipo",name:"tipo",value:c.tipo,onChange:j,className:"mb-2",children:[e.jsx("option",{value:"",children:"Selecciona un tipo"}),e.jsx("option",{value:"Escritorio",children:"Escritorio"}),e.jsx("option",{value:"Silla",children:"Silla"}),e.jsx("option",{value:"Mesa",children:"Mesa"}),e.jsx("option",{value:"Anaqueles",children:"Anaqueles"}),e.jsx("option",{value:"Butaca",children:"Butaca"}),e.jsx("option",{value:"Pizarron",children:"Pizarrón"}),e.jsx("option",{value:"Libreros",children:"Libreros"})]}),e.jsx(t,{label:"Cantidad",name:"cantidad",value:c.cantidad,onChange:j,className:"mb-2"}),e.jsx(t,{label:"Estado",name:"estado",value:c.estado,onChange:j,className:"mb-2"}),e.jsxs(w,{label:"Ubicación",name:"ubicacion",value:c.ubicacion,onChange:j,className:"mb-2",children:[e.jsx("option",{value:"",children:"Selecciona una ubicación"}),D.map(a=>e.jsx("option",{value:a.idAreas,children:a.area},a.idAreas))]}),e.jsx(t,{label:"Color",name:"color",value:c.color,onChange:j,className:"mb-2"}),e.jsx(t,{label:"Tamaño",name:"tamano",value:c.tamano,onChange:j,className:"mb-2"})]}),e.jsxs(A,{children:[e.jsx(n,{color:"secondary",onClick:()=>C(!1),children:"Cancelar"}),e.jsx(n,{color:"primary",onClick:W,children:"Añadir"})]})]}),e.jsxs(T,{visible:G,onClose:()=>g(!1),children:[e.jsx(M,{children:e.jsx("h5",{children:"Eliminar Mobiliario"})}),e.jsx(R,{children:"¿Estás seguro de que deseas eliminar este mobiliario?"}),e.jsxs(A,{children:[e.jsx(n,{color:"secondary",onClick:()=>g(!1),children:"Cancelar"}),e.jsx(n,{color:"danger",onClick:O,children:"Eliminar"})]})]})]})};export{we as default};
