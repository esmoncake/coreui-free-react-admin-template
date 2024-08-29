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

const Equipo = () => {
    const [rows, setRows] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newEquipoData, setNewEquipoData] = useState({ tipo: '', idPersonal: '', fechaEntrega: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await axios.get('http://localhost:4000/equipo');
                setRows(response.data);
            } catch (error) {
                addAlert('Error fetching equipo: ' + error.message);
            }
        };

        const fetchPersonal = async () => {
            try {
                const response = await axios.get('http://localhost:4000/personal');
                setPersonal(response.data);
            } catch (error) {
                console.error('Error obtniendo personal:', error);
            }
        };

        fetchPersonal();
        fetchEquipo();
    }, []);

    const addAlert = (message) => {
        setAlerts([...alerts, { message }]);
        setTimeout(() => {
            setAlerts((prevAlerts) => prevAlerts.slice(1));
        }, 5000); // Elimina el alert después de 5 segundos
    };

    const handleAddRow = async () => {
        if (!newEquipoData.tipo.trim() || !newEquipoData.idPersonal.trim() || !newEquipoData.fechaEntrega.trim()) {
            addAlert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/equipo', newEquipoData);
            setRows([...rows, response.data]);
            setShowAddModal(false);
            setNewEquipoData({ tipo: '', idPersonal: '', fechaEntrega: '' });
        } catch (error) {
            addAlert('Error adding equipo: ' + error.message);
        }
    };

    const handleDeleteRow = async () => {
        if (!selectedRowId) {
            addAlert('No se ha seleccionado ningún equipo.');
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/equipo/${selectedRowId}`);
            setRows(rows.filter(row => row.id !== selectedRowId));
            setSelectedRowId(null);
            setShowDeleteModal(false);
        } catch (error) {
            addAlert('Error deleting equipo: ' + error.message);
        }
    };

    const handleEditRow = (id) => {
        const rowToEdit = rows.find(row => row.id === id);
        if (rowToEdit) {
            setFormData(rowToEdit);
            setSelectedRowId(id);
            setShowEditModal(true);
        } else {
            addAlert('Equipo no encontrado.');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewEquipoChange = (e) => {
        const { name, value } = e.target;
        setNewEquipoData({ ...newEquipoData, [name]: value });
    };

    const handleSaveEdit = async () => {
        if (!formData.tipo.trim() || !formData.idPersonal.trim() || !formData.fechaEntrega.trim()) {
            addAlert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/equipo/${selectedRowId}`, formData);
            setRows(rows.map(row => row.id === selectedRowId ? response.data : row));
            setShowEditModal(false);
        } catch (error) {
            addAlert('Error updating equipo: ' + error.message);
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

            pdf.save('equipo.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRows = rows.filter(row =>
        row.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.fechaEntrega.toString().includes(searchTerm) ||
        row.personal.toString().includes(searchTerm)
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Equipamiento
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
                                        <CTableHeaderCell className="bg-body-tertiary">Personal</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-terciario">Fecha Entrega</CTableHeaderCell>
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
                                            <CTableDataCell>{row.personal}</CTableDataCell>
                                            <CTableDataCell>{formatDate(row.fechaEntrega)}</CTableDataCell>
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
                    <h5>Añadir Equipo</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={newEquipoData.tipo}
                        onChange={handleNewEquipoChange}
                    >
                         <option value="">Seleccionar Tipo</option>
                        <option value="Pr24">Pr24</option>
                        <option value="Silbato">Silbato</option>
                        <option value="Linterna">Linterna</option>
                        <option value="Porta linterna">Porta linterna</option>
                        <option value="Porta radio">Porta radio</option>
                        <option value="Tarjetero">Tarjetero</option>
                        <option value="Arillo">Arillo</option>
                        <option value="Gas pimienta">Gas pimienta</option>
                        <option value="Fornitura">Fornitura</option>
                    </CFormSelect>
                    <CFormSelect
                        label="ID Personal"
                        name="idPersonal"
                        value={newEquipoData.idPersonal}
                        onChange={handleNewEquipoChange}
                    >
                        <option value="">Seleccionar Personal</option>
                        {personal.map(person => (
                            <option key={person.idPersonal} value={person.idPersonal}>{person.nombre}</option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        label="Fecha Entrega"
                        name="fechaEntrega"
                        type="date"
                        value={newEquipoData.fechaEntrega}
                        onChange={handleNewEquipoChange}
                    />
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
                    <h5>Editar Equipo</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Pr24">Pr24</option>
                        <option value="Silbato">Silbato</option>
                        <option value="Linterna">Linterna</option>
                        <option value="Porta linterna">Porta linterna</option>
                        <option value="Porta radio">Porta radio</option>
                        <option value="Tarjetero">Tarjetero</option>
                        <option value="Arillo">Arillo</option>
                        <option value="Gas pimienta">Gas pimienta</option>
                        <option value="Fornitura">Fornitura</option>
                    </CFormSelect>
                    <CFormSelect
                        label="ID Personal"
                        name="idPersonal"
                        value={formData.idPersonal || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar Personal</option>
                        {personal.map(person => (
                            <option key={person.idPersonal} value={person.idPersonal}>{person.nombre}</option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        label="Fecha Entrega"
                        name="fechaEntrega"
                        type="date"
                        value={formData.fechaEntrega || ''}
                        onChange={handleFormChange}
                    />
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
                    <h5>Eliminar Equipo</h5>
                </CModalHeader>
                <CModalBody>
                    ¿Estás seguro de que deseas eliminar este equipo?
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

export default Equipo;
