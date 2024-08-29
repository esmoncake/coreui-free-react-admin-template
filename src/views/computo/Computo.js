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

const Computo = () => {
    const [rows, setRows] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newComputoData, setNewComputoData] = useState({
        tipo: '',
        marca: '',
        modelo: '',
        noSerie: '',
        capacidad: '',
        area: 0,
        resguardo: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchComputo = async () => {
            try {
                const response = await axios.get('http://localhost:4000/computo');
                setRows(response.data);
            } catch (error) {
                addAlert('Error fetching computo: ' + error.message);
            }
        };

        const fetchPersonal = async () => {
            try {
                const response = await axios.get('http://localhost:4000/personal');
                setPersonal(response.data);
            } catch (error) {
                console.error('Error obteniendo personal:', error);
            }
        };

        const fetchAreas = async () => {
            try {
                const response = await axios.get('http://localhost:4000/areas');
                setAreas(response.data);
            } catch (error) {
                console.error('Error obteniendo áreas:', error);
            }
        };

        fetchPersonal();
        fetchComputo();
        fetchAreas();
    }, []);

    const addAlert = (message) => {
        setAlerts([...alerts, { message }]);
        setTimeout(() => {
            setAlerts((prevAlerts) => prevAlerts.slice(1));
        }, 5000); // Elimina el alert después de 5 segundos
    };

    const handleAddRow = async () => {
        if (!newComputoData.tipo.trim() || !newComputoData.resguardo.trim() || !newComputoData.area.trim()) {
            addAlert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/computo', newComputoData);
            setRows([...rows, response.data]);
            setShowAddModal(false);
            setNewComputoData({
                tipo: '',
                marca: '',
                modelo: '',
                noSerie: '',
                capacidad: '',
                area: 0,
                resguardo: 0,
            });
        } catch (error) {
            addAlert('Error adding computo: ' + error.message);
        }
    };

    const handleDeleteRow = async () => {
        if (!selectedRowId) {
            addAlert('No se ha seleccionado ningún computo.');
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/computo/${selectedRowId}`);
            setRows(rows.filter(row => row.id !== selectedRowId));
            setSelectedRowId(null);
            setShowDeleteModal(false);
        } catch (error) {
            addAlert('Error deleting computo: ' + error.message);
        }
    };

    const handleEditRow = (id) => {
        const rowToEdit = rows.find(row => row.id === id);
        if (rowToEdit) {
            setFormData(rowToEdit);
            setSelectedRowId(id);
            setShowEditModal(true);
        } else {
            addAlert('Computo no encontrado.');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewComputoChange = (e) => {
        const { name, value } = e.target;
        setNewComputoData({ ...newComputoData, [name]: value });
    };

    const handleSaveEdit = async () => {
        if (!formData.tipo.trim() || !formData.resguardo.trim() || !formData.area.trim()) {
            addAlert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/computo/${selectedRowId}`, formData);
            setRows(rows.map(row => row.id === selectedRowId ? response.data : row));
            setShowEditModal(false);
        } catch (error) {
            addAlert('Error updating computo: ' + error.message);
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

            pdf.save('computo.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRowClick = (id) => {
        setSelectedRowId(id);
    };

    const filteredRows = rows.filter(row =>
        row.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.fechaEntrega.toString().includes(searchTerm) ||
        row.idPersonal.toString().includes(searchTerm)
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Equipos Computo
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
                                        <CTableHeaderCell className="bg-body-terciario">#</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-terciario">Tipo</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-terciario">Marca</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-terciario">Modelo</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-terciario">No. Serie</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-terciario">Capacidad</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-terciario">Área</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-terciario">Resguardo</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredRows.map((row, index) => (
                                        <CTableRow
                                            key={row.id}
                                            onClick={() => handleRowClick(row.id)}
                                            className={row.id === selectedRowId ? 'bg-light' : ''}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell> {/* Número consecutivo */}
                                            <CTableDataCell>{row.tipo}</CTableDataCell>
                                            <CTableDataCell>{row.marca}</CTableDataCell>
                                            <CTableDataCell>{row.modelo}</CTableDataCell>
                                            <CTableDataCell>{row.noSerie}</CTableDataCell>
                                            <CTableDataCell>{row.capacidad}</CTableDataCell>
                                            <CTableDataCell>{row.area}</CTableDataCell>
                                            <CTableDataCell>{row.resguardo}</CTableDataCell>
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
                    <h5>Añadir Computo</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={newComputoData.tipo}
                        onChange={handleNewComputoChange}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Computadora">Computadora</option>
                        <option value="Laptop">Laptop</option>
                        <option value="CPU">CPU</option>
                    </CFormSelect>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={newComputoData.marca}
                        onChange={handleNewComputoChange}
                    />
                    <CFormInput
                        label="Modelo"
                        name="modelo"
                        value={newComputoData.modelo}
                        onChange={handleNewComputoChange}
                    />
                    <CFormInput
                        label="No. Serie"
                        name="noSerie"
                        value={newComputoData.noSerie}
                        onChange={handleNewComputoChange}
                    />
                    <CFormInput
                        label="Capacidad"
                        name="capacidad"
                        value={newComputoData.capacidad}
                        onChange={handleNewComputoChange}
                    />
                    <CFormSelect
                        label="Área"
                        name="area"
                        value={newComputoData.area}
                        onChange={handleNewComputoChange}
                    >
                        <option value={0}>Selecciona una ubicación</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
                        ))}
                    </CFormSelect>
                    <CFormSelect
                        label="Resguardo"
                        name="resguardo"
                        value={newComputoData.resguardo}
                        onChange={handleNewComputoChange}
                    >
                        <option value="">Seleccionar Personal</option>
                        {personal.map(person => (
                            <option key={person.idPersonal} value={person.idPersonal}>{person.nombre}</option>
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
                    <h5>Editar Computo</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Computadora">Computadora</option>
                        <option value="Laptop">Laptop</option>
                        <option value="CPU">CPU</option>
                    </CFormSelect>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={formData.marca || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="Modelo"
                        name="modelo"
                        value={formData.modelo || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="No. Serie"
                        name="noSerie"
                        value={formData.noSerie || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="Capacidad"
                        name="capacidad"
                        value={formData.capacidad || ''}
                        onChange={handleFormChange}
                    />
                    <CFormSelect
                        label="Área"
                        name="area"
                        value={formData.area}
                        onChange={handleFormChange}
                    >
                        <option value={0}>Selecciona una ubicación</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
                        ))}
                    </CFormSelect>
                    <CFormSelect
                        label="Resguardo"
                        name="resguardo"
                        value={formData.resguardo}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar Personal</option>
                        {personal.map(person => (
                            <option key={person.idPersonal} value={person.idPersonal}>{person.nombre}</option>
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
                    <h5>Eliminar Computo</h5>
                </CModalHeader>
                <CModalBody>
                    ¿Estás seguro de que deseas eliminar este computo?
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

            {alerts.length > 0 && alerts.map((alert, index) => (
                <CAlert color="danger" key={index}>
                    {alert.message}
                </CAlert>
            ))}
        </>
    );
};

export default Computo;
