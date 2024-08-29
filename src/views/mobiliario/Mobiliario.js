import React, { useState, useEffect } from 'react';
import {
  CAvatar,
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
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const MobiliarioTable = () => {
  const [rows, setRows] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [newRowData, setNewRowData] = useState({
    tipo: '',
    cantidad: '',
    estado: '',
    ubicacion: 0,
    color: '',
    tamano: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMobiliario = async () => {
      try {
        const response = await fetch('http://localhost:4000/mobiliario');
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error('Error fetching mobiliario data:', error);
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
    fetchMobiliario();
  }, []);

  const handleAddRow = () => {
    setNewRowData({
      tipo: '',
      cantidad: '',
      estado: '',
      ubicacion: 0,
      color: '',
      tamano: ''
    });
    setShowInsertModal(true);
  };

  const handleDeleteRow = async () => {
    try {
      await fetch(`http://localhost:4000/mobiliario/${selectedRowId}`, {
        method: 'DELETE',
      });

      const newRows = rows.filter(row => row.id !== selectedRowId);
      const updatedRows = newRows.map((row, index) => ({ ...row, id: index + 1 }));
      setRows(updatedRows);
      setSelectedRowId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting mobiliario:', error);
    }
  };

  const handleEditRow = (id) => {
    const rowToEdit = rows.find(row => row.id === id);
    setFormData(rowToEdit);
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewRowChange = (e) => {
    const { name, value } = e.target;
    setNewRowData({ ...newRowData, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`http://localhost:4000/mobiliario/${selectedRowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const updatedRows = rows.map(row =>
        row.id === selectedRowId ? { ...formData, id: selectedRowId } : row
      );
      setRows(updatedRows);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating mobiliario:', error);
    }
  };

  const handleInsertRow = async () => {
    try {
      const response = await fetch('http://localhost:4000/mobiliario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRowData),
      });

      const data = await response.json();
      setRows([...rows, data]);
      setShowInsertModal(false);
    } catch (error) {
      console.error('Error adding mobiliario:', error);
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

      pdf.save('mobiliario.pdf');
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = rows.filter(row =>
    row.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              Tabla de Mobiliario
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <CButton color="primary" onClick={handleAddRow} className="me-2">
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
                  placeholder="Buscar por Tipo o Color"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-25 me-2"
                />
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable id="table-to-pdf" align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">ID</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tipo</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Cantidad</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Estado</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Ubicación</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Color</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tamaño</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredRows.map(row => (
                    <CTableRow
                      key={row.id}
                      onClick={() => setSelectedRowId(row.id)}
                      className={row.id === selectedRowId ? 'table-active' : ''}
                    >
                      <CTableDataCell>{row.id}</CTableDataCell>
                      <CTableDataCell>{row.tipo}</CTableDataCell>
                      <CTableDataCell>{row.cantidad}</CTableDataCell>
                      <CTableDataCell>{row.estado}</CTableDataCell>
                      <CTableDataCell>{row.ubicacion}</CTableDataCell>
                      <CTableDataCell>{row.color}</CTableDataCell>
                      <CTableDataCell>{row.tamano}</CTableDataCell>
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
          <h5>Editar Mobiliario</h5>
        </CModalHeader>
        <CModalBody>
          {formData && (
            <>
              <CFormSelect
                label="Tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleFormChange}
                className="mb-2"
              >
                <option value="">Selecciona un tipo</option>
                <option value="Escritorio">Escritorio</option>
                <option value="Silla">Silla</option>
                <option value="Mesa">Mesa</option>
                <option value="Anaqueles">Anaqueles</option>
                <option value="Butaca">Butaca</option>
                <option value="Pizarron">Pizarrón</option>
                <option value="Libreros">Libreros</option>
              </CFormSelect>
              <CFormInput
                label="Cantidad"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleFormChange}
                className="mb-2"
              />
              <CFormInput
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleFormChange}
                className="mb-2"
              />
              <CFormSelect
                label="Ubicación"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleFormChange}
                className="mb-2"
              >
                <option value="">Selecciona una ubicación</option>
                {areas.map(area => (
                  <option key={area.idAreas} value={area.idAreas}>
                    {area.area}
                  </option>
                ))}
              </CFormSelect>
              <CFormInput
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleFormChange}
                className="mb-2"
              />
              <CFormInput
                label="Tamaño"
                name="tamano"
                value={formData.tamano}
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

      {/* Modal para añadir */}
      <CModal visible={showInsertModal} onClose={() => setShowInsertModal(false)}>
        <CModalHeader>
          <h5>Añadir Mobiliario</h5>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            label="Tipo"
            name="tipo"
            value={newRowData.tipo}
            onChange={handleNewRowChange}
            className="mb-2"
          >
            <option value="">Selecciona un tipo</option>
            <option value="Escritorio">Escritorio</option>
            <option value="Silla">Silla</option>
            <option value="Mesa">Mesa</option>
            <option value="Anaqueles">Anaqueles</option>
            <option value="Butaca">Butaca</option>
            <option value="Pizarron">Pizarrón</option>
            <option value="Libreros">Libreros</option>
          </CFormSelect>
          <CFormInput
            label="Cantidad"
            name="cantidad"
            value={newRowData.cantidad}
            onChange={handleNewRowChange}
            className="mb-2"
          />
          <CFormInput
            label="Estado"
            name="estado"
            value={newRowData.estado}
            onChange={handleNewRowChange}
            className="mb-2"
          />
          <CFormSelect
            label="Ubicación"
            name="ubicacion"
            value={newRowData.ubicacion}
            onChange={handleNewRowChange}
            className="mb-2"
          >
            <option value="">Selecciona una ubicación</option>
            {areas.map(area => (
              <option key={area.idAreas} value={area.idAreas}>
                {area.area}
              </option>
            ))}
          </CFormSelect>
          <CFormInput
            label="Color"
            name="color"
            value={newRowData.color}
            onChange={handleNewRowChange}
            className="mb-2"
          />
          <CFormInput
            label="Tamaño"
            name="tamano"
            value={newRowData.tamano}
            onChange={handleNewRowChange}
            className="mb-2"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowInsertModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleInsertRow}>
            Añadir
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para eliminar */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <h5>Eliminar Mobiliario</h5>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que deseas eliminar este mobiliario?
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
    </>
  );
};

export default MobiliarioTable;
