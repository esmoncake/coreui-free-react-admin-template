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
  CFormSelect,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons';

const Menaje = () => {
  const [rows, setRows] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [newMenajeData, setNewMenajeData] = useState({ tipo: '', cantidad: '', ubicacion: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchMenaje = async () => {
      try {
        const response = await axios.get('http://localhost:4000/menaje');
        setRows(response.data);
      } catch (error) {
        addAlert('Error fetching menaje: ' + error.message);
      }
    };

    const fetchAreas = async () => {
      try {
        const response = await axios.get('http://localhost:4000/areas');
        setAreas(response.data);
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };

    fetchAreas();
    fetchMenaje();
  }, []);

  const addAlert = (message) => {
    setAlerts([...alerts, { message }]);
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.slice(1));
    }, 5000); // Elimina el alert después de 5 segundos
  };

  const handleAddRow = async () => {
    if (!newMenajeData.tipo.trim() || !newMenajeData.cantidad.trim() || !newMenajeData.ubicacion.trim()) {
      addAlert('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/menaje', newMenajeData);
      setRows([...rows, response.data]);
      setShowAddModal(false);
      setNewMenajeData({ tipo: '', cantidad: '', ubicacion: '' });
    } catch (error) {
      addAlert('Error adding menaje: ' + error.message);
    }
  };

  const handleDeleteRow = async () => {
    if (!selectedRowId) {
      addAlert('No se ha seleccionado ningún menaje.');
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/menaje/${selectedRowId}`);
      setRows(rows.filter(row => row.id !== selectedRowId));
      setSelectedRowId(null);
      setShowDeleteModal(false);
    } catch (error) {
      addAlert('Error deleting menaje: ' + error.message);
    }
  };

  const handleEditRow = (id) => {
    const rowToEdit = rows.find(row => row.id === id);
    if (rowToEdit) {
      setFormData(rowToEdit);
      setSelectedRowId(id);
      setShowEditModal(true);
    } else {
      addAlert('Menaje no encontrado.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewMenajeChange = (e) => {
    const { name, value } = e.target;
    setNewMenajeData({ ...newMenajeData, [name]: value });
  };

  const handleSaveEdit = async () => {
    if (!formData.tipo.trim() || !formData.cantidad.trim() || !formData.ubicacion.trim()) {
      addAlert('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/menaje/${selectedRowId}`, formData);
      setRows(rows.map(row => row.id === selectedRowId ? response.data : row));
      setShowEditModal(false);
    } catch (error) {
      addAlert('Error updating menaje: ' + error.message);
    }
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

      pdf.save('menaje.pdf');
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = rows.filter(row =>
    row.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.cantidad.toString().includes(searchTerm) ||
    row.ubicacion.toString().includes(searchTerm)
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-2">
            <CCardHeader>
              Tabla Menaje
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                    <CIcon icon={cilPlus} /> Añadir
                  </CButton>
                  <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedRowId === null} className="me-2">
                    <CIcon icon={cilTrash} /> Eliminar
                  </CButton>
                  <CButton color="info" onClick={() => handleEditRow(selectedRowId)} disabled={selectedRowId === null} className="me-2">
                    <CIcon icon={cilPen} /> Editar
                  </CButton>
                  <CButton color="success" onClick={handleGeneratePDF}>
                    <CIcon icon={cilPrint} /> Generar PDF
                  </CButton>
                </div>
                <CFormInput
                  type="text"
                  placeholder="Buscar por Tipo"
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
                    <CTableHeaderCell className="bg-body-tertiary">#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tipo</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Cantidad</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiario">Ubicación</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredRows.map((row, index) => (
                    <CTableRow
                      key={row.id}
                      onClick={() => setSelectedRowId(row.id)}
                      className={row.id === selectedRowId ? 'table-active' : ''}
                      data-id={row.id}
                    >
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{row.tipo}</CTableDataCell>
                      <CTableDataCell>{row.cantidad}</CTableDataCell>
                      <CTableDataCell>{row.ubicacion}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal para agregar */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <h5>Añadir Menaje</h5>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            label="Tipo"
            name="tipo"
            value={newMenajeData.tipo}
            onChange={handleNewMenajeChange}
          >
            <option value="">Seleccionar Tipo</option>
            <option value="Tazas">Tazas</option>
            <option value="Termos">Termos</option>
            <option value="Vasos">Vasos</option>
          </CFormSelect>
          <CFormInput
            label="Cantidad"
            name="cantidad"
            type="number"
            value={newMenajeData.cantidad}
            onChange={handleNewMenajeChange}
          />
          <CFormSelect
              label="Ubicación"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleFormChange}
          >
              {areas.map(area => (
                  <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
              ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleAddRow}>
            Añadir
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para editar */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <h5>Editar Menaje</h5>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            label="Tipo"
            name="tipo"
            value={formData.tipo || ''}
            onChange={handleFormChange}
          >
            <option value="">Seleccionar Tipo</option>
            <option value="Tazas">Tazas</option>
            <option value="Termos">Termos</option>
            <option value="Vasos">Vasos</option>
          </CFormSelect>
          <CFormInput
            label="Cantidad"
            name="cantidad"
            type="number"
            value={formData.cantidad || ''}
            onChange={handleFormChange}
          />
          <CFormSelect
              label="Ubicación"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleFormChange}
          >
              {areas.map(area => (
                  <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
              ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit}>
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para eliminar */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <h5>Eliminar Menaje</h5>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que deseas eliminar este menaje?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDeleteRow}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Alertas */}
      {alerts.map((alert, index) => (
        <CAlert key={index} color="warning">
          {alert.message}
        </CAlert>
      ))}
    </>
  );
};

export default Menaje;
