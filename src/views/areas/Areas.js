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
    CAlert // Importa CAlert para las notificaciones
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons';

const Areas = () => {
    const [rows, setRows] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newAreaData, setNewAreaData] = useState({ area: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await axios.get('http://localhost:4000/areas');
                setRows(response.data);
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        };

        fetchAreas();
    }, []);

    const addAlert = (message) => {
        setAlerts([...alerts, { message }]);
        setTimeout(() => {
            setAlerts((prevAlerts) => prevAlerts.slice(1));
        }, 5000); // Elimina el alert después de 5 segundos
    };

    const handleAddRow = async () => {
        if (!newAreaData.area.trim()) {
            addAlert('El nombre del área no puede estar vacío.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/areas', newAreaData);
            setRows([...rows, response.data]);
            setShowAddModal(false);
            setNewAreaData({ area: '' });
        } catch (error) {
            console.error('Error adding area:', error);
        }
    };

    const handleDeleteRow = async () => {
        try {
            await axios.delete(`http://localhost:4000/areas/${selectedRowId}`);
            const newRows = rows.filter(row => row.idAreas !== selectedRowId);
            setRows(newRows);
            setSelectedRowId(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting area:', error);
        }
    };

    const handleEditRow = (id) => {
        const rowToEdit = rows.find(row => row.idAreas === id);
        setFormData(rowToEdit);
        setSelectedRowId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewAreaChange = (e) => {
        const { name, value } = e.target;
        setNewAreaData({ ...newAreaData, [name]: value });
    };

    const handleSaveEdit = async () => {
        if (!formData.area.trim()) {
            addAlert('El nombre del área no puede estar vacío.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/areas/${selectedRowId}`, formData);
            const updatedRows = rows.map(row => row.idAreas === selectedRowId ? response.data : row);
            setRows(updatedRows);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating area:', error);
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

            pdf.save('table.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRows = rows.filter(row =>
        row.area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Áreas
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
                                    placeholder="Buscar por Área"
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
                                        <CTableHeaderCell className="bg-body-tertiary">Área</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredRows.map((row, index) => (
                                        <CTableRow
                                            key={row.idAreas} // Mantén el uso de `key` aquí
                                            onClick={() => setSelectedRowId(row.idAreas)}
                                            className={row.idAreas === selectedRowId ? 'table-active' : ''}
                                            data-id={row.idAreas} // Usa `data-id` para almacenar la identificación si es necesario
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{row.area}</CTableDataCell>
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
                    <h5>Añadir Área</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Nombre del Área"
                        name="area"
                        value={newAreaData.area}
                        onChange={handleNewAreaChange}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleAddRow}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para editar */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Área</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Nombre del Área"
                        name="area"
                        value={formData.area || ''}
                        onChange={handleFormChange}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleSaveEdit}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para eliminar */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <h5>Confirmar eliminación</h5>
                </CModalHeader>
                <CModalBody>
                    ¿Estás seguro de que quieres eliminar esta área?
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

export default Areas;