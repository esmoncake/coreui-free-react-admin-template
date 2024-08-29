import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons';

const ProveedoresTable = () => {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [newProveedorData, setNewProveedorData] = useState({
    nombre: '',
    contacto: '',
    correo: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/proveedores');
        setProveedores(response.data);
      } catch (error) {
        showAlert('Error fetching proveedores: ' + error.message);
      }
    };

    fetchProveedores();
  }, []);

  const showAlert = (message) => {
    setAlerts([{ message }]);
    setTimeout(() => {
      setAlerts([]);
    }, 3000); // Oculta la alerta después de 3 segundos
  };

  const handleAddProveedor = () => {
    setNewProveedorData({
      nombre: '',
      contacto: '',
      correo: '',
    });
    setShowInsertModal(true);
  };

  const handleInsertProveedor = async () => {
    const { nombre, contacto, correo } = newProveedorData;

    if (!nombre.trim()) {
        showAlert('El nombre no puede estar vacío.');
        return;
    }
    if (!contacto.trim()) {
        showAlert('El contacto no puede estar vacío.');
        return;
    }
    if (!correo.trim()) {
        showAlert('El correo no puede estar vacío.');
        return;
    }
    if (!/\S+@\S+\.\S+/.test(correo)) {
        showAlert('El formato del correo es incorrecto.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:4000/proveedores', newProveedorData);
        setProveedores([...proveedores, response.data]);
        setShowInsertModal(false);
        setNewProveedorData({
            nombre: '',
            contacto: '',
            correo: '',
        });
    } catch (error) {
        showAlert('Error al agregar proveedor: ' + error.message);
    }
};

const handleSaveEdit = async () => {
    const { nombre, contacto, correo } = formData;

    if (!nombre.trim()) {
        showAlert('El nombre no puede estar vacío.');
        return;
    }
    if (!contacto.trim()) {
        showAlert('El contacto no puede estar vacío.');
        return;
    }
    if (!correo.trim()) {
        showAlert('El correo no puede estar vacío.');
        return;
    }
    if (!/\S+@\S+\.\S+/.test(correo)) {
        showAlert('El formato del correo es incorrecto.');
        return;
    }

    try {
        const response = await axios.put(`http://localhost:4000/proveedores/${selectedProveedorId}`, formData);
        const updatedProveedores = proveedores.map(proveedor =>
            proveedor.id === selectedProveedorId ? response.data : proveedor
        );
        setProveedores(updatedProveedores);
        setShowEditModal(false);
    } catch (error) {
        showAlert('Error al actualizar proveedor: ' + error.message);
    }
};

  const handleDeleteProveedor = async () => {
    if (!selectedProveedorId) {
      showAlert('No se ha seleccionado ningún proveedor.');
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/proveedores/${selectedProveedorId}`);
      const newProveedores = proveedores.filter(proveedor => proveedor.id !== selectedProveedorId);
      setProveedores(newProveedores);
      setSelectedProveedorId(null);
      setShowDeleteModal(false);
    } catch (error) {
      showAlert('Error deleting proveedor: ' + error.message);
    }
  };

  const handleEditProveedor = (id) => {
    const proveedorToEdit = proveedores.find(proveedor => proveedor.id === id);
    if (proveedorToEdit) {
      setFormData(proveedorToEdit);
      setSelectedProveedorId(id);
      setShowEditModal(true);
    } else {
      showAlert('Proveedor no encontrado.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleGeneratePDF = () => {
    const input = document.getElementById('table-to-pdf');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('proveedores.pdf');
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              Tabla de Proveedores
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <CButton color="primary" onClick={handleAddProveedor} className="me-2">
                    <CIcon icon={cilPlus} /> Añadir
                  </CButton>
                  <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedProveedorId === null} className="me-2">
                    <CIcon icon={cilTrash} /> Eliminar
                  </CButton>
                  <CButton color="info" onClick={() => handleEditProveedor(selectedProveedorId)} disabled={selectedProveedorId === null} className="me-2">
                    <CIcon icon={cilPen} /> Editar
                  </CButton>
                  <CButton color="success" onClick={handleGeneratePDF}>
                    <CIcon icon={cilPrint} /> Generar PDF
                  </CButton>
                </div>

                <CFormInput
                  type="text"
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-25"
                />
              </div>
              
            </CCardHeader>
            <CCardBody>
              <CTable id="table-to-pdf" align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Nombre</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Contacto</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Correo</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredProveedores.map((proveedor, index) => (
                    <CTableRow
                      key={proveedor.id}
                      onClick={() => setSelectedProveedorId(proveedor.id)}
                      className={proveedor.id === selectedProveedorId ? 'table-active' : ''}
                    >
                      <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                      <CTableDataCell>{proveedor.nombre}</CTableDataCell>
                      <CTableDataCell>{proveedor.contacto}</CTableDataCell>
                      <CTableDataCell>{proveedor.correo}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal para editar */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <h5>Editar Proveedor</h5>
        </CModalHeader>
        <CModalBody>
          {formData && (
            <>
              <CFormInput
                label="Nombre"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleFormChange}
                className="mb-2"
              />
              <CFormInput
                label="Contacto"
                name="contacto"
                value={formData.contacto || ''}
                onChange={handleFormChange}
                className="mb-2"
              />
              <CFormInput
                label="Correo"
                name="correo"
                value={formData.correo || ''}
                onChange={handleFormChange}
                className="mb-2"
              />
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit}>
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para agregar */}
      <CModal visible={showInsertModal} onClose={() => setShowInsertModal(false)}>
        <CModalHeader>
          <h5>Agregar Proveedor</h5>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Nombre"
            value={newProveedorData.nombre}
            onChange={(e) => setNewProveedorData({ ...newProveedorData, nombre: e.target.value })}
            className="mb-2"
          />
          <CFormInput
            label="Contacto"
            value={newProveedorData.contacto}
            onChange={(e) => setNewProveedorData({ ...newProveedorData, contacto: e.target.value })}
            className="mb-2"
          />
          <CFormInput
            label="Correo"
            value={newProveedorData.correo}
            onChange={(e) => setNewProveedorData({ ...newProveedorData, correo: e.target.value })}
            className="mb-2"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowInsertModal(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleInsertProveedor}>
            Agregar Proveedor
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para eliminar */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <h5>Eliminar Proveedor</h5>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que quieres eliminar este proveedor?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDeleteProveedor}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      <div className="position-fixed bottom-0 start-0 p-3" style={{ zIndex: 1550 }}>
            {alerts.map((alert, index) => (
                <CAlert key={index} color="danger" className="mb-2" style={{ zIndex: 1560 }}>
                    {alert.message}
                </CAlert>
            ))}
        </div>
    </>
  );
};

export default ProveedoresTable;
