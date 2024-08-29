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

const Llantas = () => {
  const [rows, setRows] = useState([]);
  const [automoviles, setAutomoviles] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [newLlantasData, setNewLlantasData] = useState({ marca: '', medida: '', estado: '', idMatricula: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchLlantas = async () => {
      try {
        const response = await axios.get('http://localhost:4000/llantas');
        setRows(response.data);
      } catch (error) {
        addAlert('Error fetching llantas: ' + error.message);
      }
    };

    const fetchAutomoviles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/automoviles');
        setAutomoviles(response.data);
      } catch (error) {
        addAlert('Error fetching automoviles');
      }
    };

    fetchAutomoviles();
    fetchLlantas();
  }, []);

  const addAlert = (message) => {
    setAlerts([...alerts, { message }]);
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.slice(1));
    }, 5000); // Elimina el alert después de 5 segundos
  };

  const handleAddRow = async () => {
    if (!newLlantasData.marca.trim() || !newLlantasData.medida.trim() || !newLlantasData.estado.trim() || !newLlantasData.idMatricula.trim()) {
      addAlert('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/llantas', newLlantasData);
      setRows([...rows, response.data]);
      setShowAddModal(false);
      setNewLlantasData({ marca: '', medida: '', estado: '', idMatricula: '' });
    } catch (error) {
      addAlert('Error adding llantas: ' + error.message);
    }
  };

  const handleDeleteRow = async () => {
    if (!selectedRowId) {
      addAlert('No se ha seleccionado ninguna llanta.');
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/llantas/${selectedRowId}`);
      setRows(rows.filter(row => row.id !== selectedRowId));
      setSelectedRowId(null);
      setShowDeleteModal(false);
    } catch (error) {
      addAlert('Error deleting llantas: ' + error.message);
    }
  };

  const handleEditRow = (id) => {
    const rowToEdit = rows.find(row => row.id === id);
    if (rowToEdit) {
      setFormData(rowToEdit);
      setSelectedRowId(id);
      setShowEditModal(true);
    } else {
      addAlert('Llanta no encontrada.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewLlantasChange = (e) => {
    const { name, value } = e.target;
    setNewLlantasData({ ...newLlantasData, [name]: value });
  };

  const handleSaveEdit = async () => {
    if (!formData.marca.trim() || !formData.medida.trim() || !formData.estado.trim() || !formData.idMatricula.trim()) {
      addAlert('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/llantas/${selectedRowId}`, formData);
      setRows(rows.map(row => row.id === selectedRowId ? response.data : row));
      setShowEditModal(false);
    } catch (error) {
      addAlert('Error updating llantas: ' + error.message);
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

      pdf.save('llantas.pdf');
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = rows.filter(row =>
    row.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.medida.toString().includes(searchTerm) ||
    row.estado.toLowerCase().includes(searchTerm) ||
    row.idMatricula.toString().includes(searchTerm)
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-2">
            <CCardHeader>
              Tabla Llantas
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
                  placeholder="Buscar"
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
                    <CTableHeaderCell className="bg-body-tertiary">Marca</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Medida</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Estado</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Vehiculo</CTableHeaderCell>
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
                      <CTableDataCell>{row.marca}</CTableDataCell>
                      <CTableDataCell>{row.medida}</CTableDataCell>
                      <CTableDataCell>{row.estado}</CTableDataCell>
                      <CTableDataCell>{row.idMatricula}</CTableDataCell>
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
          <h5>Añadir Llanta</h5>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Marca"
            name="marca"
            value={newLlantasData.marca}
            onChange={handleNewLlantasChange}
          />
          <CFormInput
            label="Medida"
            name="medida"
            value={newLlantasData.memedidadia}
            onChange={handleNewLlantasChange}
          />
          <CFormSelect
            label="Estado"
            name="estado"
            value={newLlantasData.estado}
            onChange={handleNewLlantasChange}
          >
            <option value="">Seleccionar Estado</option>
            <option value="Buena">Buena</option>
            <option value="Regular">Regular</option>
            <option value="Mala">Mala</option>
          </CFormSelect>

          <CFormSelect
            label="Vehiculo"
            name="idMatricula"
            value={newLlantasData.idMatricula}
            onChange={handleNewLlantasChange}
          >
            <option value={0}>Selecciona la Matricula</option>
            {automoviles.map(automovil => (
              <option key={automovil.id} value={automovil.id}>
                {automovil.matricula}
              </option>
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
          <h5>Editar Llanta</h5>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Marca"
            name="marca"
            value={formData.marca || ''}
            onChange={handleFormChange}
          />
          <CFormInput
            label="Medida"
            name="medida"
            value={formData.medida || ''}
            onChange={handleFormChange}
          />
          <CFormSelect
            label="Estado"
            name="estado"
            value={formData.estado || ''}
            onChange={handleFormChange}
          >
            <option value="">Seleccionar Estado</option>
            <option value="Buena">Buena</option>
            <option value="Regular">Regular</option>
            <option value="Mala">Mala</option>
          </CFormSelect>

          <CFormSelect
            label="Vehiculo"
            name="idMatricula"
            value={formData.idMatricula || ''}
            onChange={handleFormChange}
          >
            <option value={0}>Selecciona la Matricula</option>
            {automoviles.map(automovil => (
              <option key={automovil.id} value={automovil.id}>
                {automovil.matricula}
              </option>
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
          <h5>Eliminar Llanta</h5>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que deseas eliminar esta llanta?
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

export default Llantas;
