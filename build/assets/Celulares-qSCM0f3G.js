import{r,j as e}from"./index-Cq3cNOe4.js";import{a as u}from"./axios-Bl1vbFzL.js";import{C as ee,a as ae,b as G,c as t,d as oe,e as d,h as se,E as le}from"./jspdf.es.min-DhbDYEgH.js";import{a as h,c as y}from"./index.esm-BVbxNr3O.js";import{C as ne,a as re}from"./CRow-CR1dTeP1.js";import{C as ce,a as ie}from"./CCardBody-BZy5Kcki.js";import{C as te}from"./CCardHeader-Drjisk7v.js";import{c as de,a as he,b as me,d as xe}from"./cil-trash-BnkbpAXr.js";import{C as n}from"./CFormInput-CPK1Hc24.js";import{C as D,a as T,b as I,c as A}from"./CModalHeader-DM5zFOOe.js";import{C as p}from"./CFormSelect-sMFcUcNb.js";import"./DefaultLayout-VGzP6Txu.js";const Se=()=>{const[f,g]=r.useState([]),[k,U]=r.useState([]),[F,$]=r.useState([]),[R,q]=r.useState([]),[j,S]=r.useState(null),[W,b]=r.useState(!1),[z,v]=r.useState(!1),[J,w]=r.useState(!1),[c,B]=r.useState({}),[i,H]=r.useState({marca:"",modelo:"",noimei:"",ubicacion:0,estado:"",notelefono:"",descripcion:"",idPersonal:0,idProveedor:0}),[N,K]=r.useState("");r.useEffect(()=>{const a=async()=>{try{const o=await u.get("http://localhost:4000/celulares");g(o.data)}catch(o){console.error("Error fetching celulares:",o)}},s=async()=>{try{const o=await u.get("http://localhost:4000/areas");U(o.data)}catch(o){console.error("Error fetching areas:",o)}},l=async()=>{try{const o=await u.get("http://localhost:4000/proveedores");$(o.data)}catch(o){console.error("Error fetching proveedores:",o)}},C=async()=>{try{const o=await u.get("http://localhost:4000/personal");q(o.data)}catch(o){console.error("Error fetching encargados:",o)}};a(),s(),l(),C()},[]);const O=async()=>{try{const a=await u.post("http://localhost:4000/celulares",i);g([...f,a.data]),v(!1),H({marca:"",modelo:"",noimei:"",ubicacion:0,estado:"",notelefono:"",descripcion:"",idPersonal:0,idProveedor:0})}catch(a){console.error("Error adding celular:",a)}},Q=async()=>{try{await u.delete(`http://localhost:4000/celulares/${j}`);const a=f.filter(s=>s.id!==j);g(a),S(null),w(!1)}catch(a){console.error("Error deleting celular:",a)}},V=a=>{const s=f.find(l=>l.id===a);B(s),S(a),b(!0)},m=a=>{const{name:s,value:l}=a.target;B({...c,[s]:l})},x=a=>{const{name:s,value:l}=a.target;H({...i,[s]:l})},X=async()=>{try{const a=await u.put(`http://localhost:4000/celulares/${j}`,c),s=f.map(l=>l.id===j?a.data:l);g(s),b(!1)}catch(a){console.error("Error updating celular:",a)}},Y=()=>{const a=document.getElementById("table-to-pdf");se(a,{scale:2}).then(s=>{const l=s.toDataURL("image/png"),C=new le("p","mm","a4"),o=210,L=295,P=s.height*o/s.width;let E=P,M=0;for(C.addImage(l,"PNG",0,M,o,P),E-=L;E>=0;)M=E-P,C.addPage(),C.addImage(l,"PNG",0,M,o,P),E-=L;C.save("Celulares.pdf")})},Z=a=>{K(a.target.value)},_=f.filter(a=>a.marca.toLowerCase().includes(N.toLowerCase())||a.modelo.toLowerCase().includes(N.toLowerCase()));return e.jsxs(e.Fragment,{children:[e.jsx(ne,{children:e.jsx(re,{xs:12,children:e.jsxs(ce,{className:"mb-2",children:[e.jsxs(te,{children:["Tabla Celulares",e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{className:"d-flex",children:[e.jsxs(h,{color:"primary",onClick:()=>v(!0),className:"me-2",children:[e.jsx(y,{icon:de})," Añadir"]}),e.jsxs(h,{color:"danger",onClick:()=>w(!0),disabled:j===null,className:"me-2",children:[e.jsx(y,{icon:he})," Eliminar"]}),e.jsxs(h,{color:"info",onClick:()=>V(j),disabled:j===null,className:"me-2",children:[e.jsx(y,{icon:me})," Editar"]}),e.jsxs(h,{color:"success",onClick:Y,children:[e.jsx(y,{icon:xe})," Generar PDF"]})]}),e.jsx(n,{type:"text",placeholder:"Buscar por marca o modelo",value:N,onChange:Z,className:"w-25"})]})]}),e.jsx(ie,{children:e.jsxs(ee,{id:"table-to-pdf",align:"middle",className:"mb-0 border",hover:!0,responsive:!0,children:[e.jsx(ae,{className:"text-nowrap",children:e.jsxs(G,{children:[e.jsx(t,{children:"#"}),e.jsx(t,{children:"Marca"}),e.jsx(t,{children:"Modelo"}),e.jsx(t,{children:"No. IMEI"}),e.jsx(t,{children:"Ubicación"}),e.jsx(t,{children:"Estado"}),e.jsx(t,{children:"No. Teléfono"}),e.jsx(t,{children:"Descripción"}),e.jsx(t,{children:"Personal"}),e.jsx(t,{children:"Proveedor"})]})}),e.jsx(oe,{children:_.map((a,s)=>e.jsxs(G,{onClick:()=>S(a.id),className:a.id===j?"table-active":"",children:[e.jsx(d,{children:s+1}),e.jsx(d,{children:a.marca}),e.jsx(d,{children:a.modelo}),e.jsx(d,{children:a.noimei}),e.jsx(d,{children:a.ubicacion}),e.jsx(d,{children:a.estado}),e.jsx(d,{children:a.notelefono}),e.jsx(d,{children:a.descripcion}),e.jsx(d,{children:a.encargado}),e.jsx(d,{children:a.proveedor})]},a.id))})]})})]})})}),e.jsxs(D,{visible:z,onClose:()=>v(!1),children:[e.jsx(T,{children:e.jsx("h5",{className:"modal-title",children:"Añadir Celular"})}),e.jsxs(I,{children:[e.jsx(n,{label:"Marca",name:"marca",value:i.marca,onChange:x}),e.jsx(n,{label:"Modelo",name:"modelo",value:i.modelo,onChange:x}),e.jsx(n,{label:"No. IMEI",name:"noimei",value:i.noimei,onChange:x}),e.jsxs(p,{label:"Ubicación",name:"ubicacion",value:i.ubicacion,onChange:x,children:[e.jsx("option",{value:"",children:"Seleccionar"}),k.map(a=>e.jsx("option",{value:a.idAreas,children:a.area},a.idAreas))]}),e.jsx(n,{label:"Estado",name:"estado",value:i.estado,onChange:x}),e.jsx(n,{label:"No. Teléfono",name:"notelefono",value:i.noTelefono,onChange:x}),e.jsx(n,{label:"Descripción",name:"descripcion",value:i.descripcion,onChange:x}),e.jsxs(p,{label:"Personal",name:"idPersonal",value:i.idPersonal,onChange:x,children:[e.jsx("option",{value:"",children:"Seleccionar"}),R.map(a=>e.jsx("option",{value:a.idPersonal,children:a.nombre},a.idPersonal))]}),e.jsxs(p,{label:"Proveedor",name:"idProveedor",value:i.idProveedor,onChange:x,children:[e.jsx("option",{value:"",children:"Seleccionar"}),F.map(a=>e.jsx("option",{value:a.id,children:a.nombre},a.id))]})]}),e.jsxs(A,{children:[e.jsx(h,{color:"secondary",onClick:()=>v(!1),children:"Cancelar"}),e.jsx(h,{color:"primary",onClick:O,children:"Añadir"})]})]}),e.jsxs(D,{visible:W,onClose:()=>b(!1),children:[e.jsx(T,{children:e.jsx("h5",{className:"modal-title",children:"Editar Celular"})}),e.jsxs(I,{children:[e.jsx(n,{label:"Marca",name:"marca",value:c.marca||"",onChange:m}),e.jsx(n,{label:"Modelo",name:"modelo",value:c.modelo||"",onChange:m}),e.jsx(n,{label:"No. IMEI",name:"noimei",value:c.noimei||"",onChange:m}),e.jsxs(p,{label:"Ubicación",name:"ubicacion",value:c.ubicacion||"",onChange:m,children:[e.jsx("option",{value:"",children:"Seleccionar"}),k.map(a=>e.jsx("option",{value:a.idAreas,children:a.area},a.idAreas))]}),e.jsx(n,{label:"Estado",name:"estado",value:c.estado||"",onChange:m}),e.jsx(n,{label:"No. Teléfono",name:"notelefono",value:c.notelefono||"",onChange:m}),e.jsx(n,{label:"Descripción",name:"descripcion",value:c.descripcion||"",onChange:m}),e.jsxs(p,{label:"Personal",name:"idPersonal",value:c.idPersonal||"",onChange:m,children:[e.jsx("option",{value:"",children:"Seleccionar"}),R.map(a=>e.jsx("option",{value:a.idPersonal,children:a.nombre},a.idPersonal))]}),e.jsxs(p,{label:"Proveedor",name:"idProveedor",value:c.idProveedor||"",onChange:m,children:[e.jsx("option",{value:"",children:"Seleccionar"}),F.map(a=>e.jsx("option",{value:a.id,children:a.nombre},a.id))]})]}),e.jsxs(A,{children:[e.jsx(h,{color:"secondary",onClick:()=>b(!1),children:"Cancelar"}),e.jsx(h,{color:"primary",onClick:X,children:"Guardar Cambios"})]})]}),e.jsxs(D,{visible:J,onClose:()=>w(!1),children:[e.jsx(T,{children:e.jsx("h5",{className:"modal-title",children:"Eliminar Celular"})}),e.jsx(I,{children:"¿Estás seguro de que deseas eliminar este celular?"}),e.jsxs(A,{children:[e.jsx(h,{color:"secondary",onClick:()=>w(!1),children:"Cancelar"}),e.jsx(h,{color:"danger",onClick:Q,children:"Eliminar"})]})]})]})};export{Se as default};
