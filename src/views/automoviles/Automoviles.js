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

const Automovil = () => {
    const [rows, setRows] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newAutomovilData, setNewAutomovilData] = useState({
        matricula: '',
        tipo: '',
        marca: '',
        modelo: '',
        color: '',
        noMotor: '',
        servicio: '',
        idPersonal: 0,
        observaciones: '',
        tenencia: '',
        seguro: '',
        verificacion: '',
        ubicacion: 0,
        noSerie: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [automovilesResponse, personalResponse, areasResponse] = await Promise.all([
                    axios.get('http://localhost:4000/automoviles'),
                    axios.get('http://localhost:4000/personal'),
                    axios.get('http://localhost:4000/areas')
                ]);

                setRows(automovilesResponse.data);
                setPersonal(personalResponse.data);
                setAreas(areasResponse.data);
            } catch (error) {
                addAlert('Error fetching data: ' + error.message);
            }
        };

        fetchData();
    }, []);

    const addAlert = (message) => {
        setAlerts([...alerts, { message }]);
        setTimeout(() => {
            setAlerts((prevAlerts) => prevAlerts.slice(1));
        }, 5000);
    };

    const handleAddRow = async () => {
        if (Object.values(newAutomovilData).some(value => !value.toString().trim())) {
            addAlert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/automoviles', newAutomovilData);
            setRows([...rows, response.data]);
            setShowAddModal(false);
            setNewAutomovilData({
                matricula: '',
                tipo: '',
                marca: '',
                modelo: '',
                color: '',
                noMotor: '',
                servicio: '',
                idPersonal: 0,
                observaciones: '',
                tenencia: '',
                seguro: '',
                verificacion: '',
                ubicacion: 0,
                noSerie: ''
            });
        } catch (error) {
            addAlert('Error adding automovil: ' + error.message);
        }
    };

    const handleDeleteRow = async () => {
        if (!selectedRowId) {
            addAlert('No se ha seleccionado ningún automóvil.');
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/automoviles/${selectedRowId}`);
            setRows(rows.filter(row => row.id !== selectedRowId));
            setSelectedRowId(null);
            setShowDeleteModal(false);
        } catch (error) {
            addAlert('Error deleting automovil: ' + error.message);
        }
    };

    const handleEditRow = (id) => {
        const rowToEdit = rows.find(row => row.id === id);
        if (rowToEdit) {
            setFormData(rowToEdit);
            setSelectedRowId(id);
            setShowEditModal(true);
        } else {
            addAlert('Automóvil no encontrado.');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewAutomovilChange = (e) => {
        const { name, value } = e.target;
        setNewAutomovilData({ ...newAutomovilData, [name]: value });
    };

    const handleSaveEdit = async () => {
        if (Object.values(formData).some(value => !value.toString().trim())) {
            addAlert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/automoviles/${selectedRowId}`, formData);
            setRows(rows.map(row => row.id === selectedRowId ? response.data : row));
            setShowEditModal(false);
        } catch (error) {
            addAlert('Error updating automovil: ' + error.message);
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

            pdf.save('automovil.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRows = rows.filter(row =>
        row.matricula.toString().includes(searchTerm) ||
        row.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.noMotor.toString().includes(searchTerm) ||
        row.servicio.toString().includes(searchTerm) ||
        row.personal.toString().includes(searchTerm) ||
        row.observaciones.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.tenencia.toString().includes(searchTerm) ||
        row.seguro.toString().includes(searchTerm) ||
        row.verificacion.toString().includes(searchTerm) ||
        row.ubicacion.toString().includes(searchTerm) ||
        row.noSerie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Automóviles
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
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Matricula</CTableHeaderCell>
                                        <CTableHeaderCell>Tipo</CTableHeaderCell>
                                        <CTableHeaderCell>Marca</CTableHeaderCell>
                                        <CTableHeaderCell>Modelo</CTableHeaderCell>
                                        <CTableHeaderCell>Color</CTableHeaderCell>
                                        <CTableHeaderCell>No. Motor</CTableHeaderCell>
                                        <CTableHeaderCell>Prox-Mantenimiento</CTableHeaderCell>
                                        <CTableHeaderCell>Resguardo</CTableHeaderCell>
                                        <CTableHeaderCell>Observaciones</CTableHeaderCell>
                                        <CTableHeaderCell>Tenencia</CTableHeaderCell>
                                        <CTableHeaderCell>Seguro</CTableHeaderCell>
                                        <CTableHeaderCell>Verificación</CTableHeaderCell>
                                        <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                        <CTableHeaderCell>No. Serie</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredRows.map((row, index) => (
                                        <CTableRow
                                            key={row.id}
                                            active={selectedRowId === row.id}
                                            onClick={() => setSelectedRowId(row.id)}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{row.matricula}</CTableDataCell>
                                            <CTableDataCell>{row.tipo}</CTableDataCell>
                                            <CTableDataCell>{row.marca}</CTableDataCell>
                                            <CTableDataCell>{row.modelo}</CTableDataCell>
                                            <CTableDataCell>{row.color}</CTableDataCell>
                                            <CTableDataCell>{row.noMotor}</CTableDataCell>
                                            <CTableDataCell>{formatDate(row.servicio)}</CTableDataCell>
                                            <CTableDataCell>{row.personal}</CTableDataCell>
                                            <CTableDataCell>{row.observaciones}</CTableDataCell>
                                            <CTableDataCell>{formatDate(row.tenencia)}</CTableDataCell>
                                            <CTableDataCell>{formatDate(row.seguro)}</CTableDataCell>
                                            <CTableDataCell>{formatDate(row.verificacion)}</CTableDataCell>
                                            <CTableDataCell>{row.ubicacion}</CTableDataCell>
                                            <CTableDataCell>{row.noSerie}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {alerts.map((alert, index) => (
                <CAlert key={index} color="danger" className="d-inline-block w-auto">
                    {alert.message}
                </CAlert>
            ))}

            {/* Modales */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader>Agregar Automóvil</CModalHeader>
                <CModalBody>
                    <CFormInput
                        type="text"
                        name="matricula"
                        label="Matricula"
                        value={newAutomovilData.matricula}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={newAutomovilData.tipo}
                        onChange={handleNewAutomovilChange}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Auto">Auto</option>
                        <option value="Camioneta">Camioneta</option>
                        <option value="Moto">Moto</option>
                        <option value="Scooter">Scooter</option>
                        <option value="Bicicletas">Bicicletas</option>
                    </CFormSelect>
                    <CFormInput
                        type="text"
                        name="marca"
                        label="Marca"
                        value={newAutomovilData.marca}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormInput
                        type="text"
                        name="modelo"
                        label="Modelo"
                        value={newAutomovilData.modelo}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormInput
                        type="text"
                        name="color"
                        label="Color"
                        value={newAutomovilData.color}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormInput
                        type="text"
                        name="noMotor"
                        label="No. Motor"
                        value={newAutomovilData.noMotor}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormInput
                        type="date"
                        name="servicio"
                        label="Servicio"
                        value={newAutomovilData.servicio}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormSelect
                        name="idPersonal"
                        label="Personal"
                        value={newAutomovilData.idPersonal}
                        onChange={handleNewAutomovilChange}
                    >
                        <option value={0}>Selecciona Personal</option>
                        {personal.map(person => (
                            <option key={person.idPersonal} value={person.idPersonal}>{person.nombre}</option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        type="text"
                        name="observaciones"
                        label="Observaciones"
                        value={newAutomovilData.observaciones}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormInput
                        type="date"
                        name="tenencia"
                        label="Tenencia"
                        value={newAutomovilData.tenencia}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormInput
                        type="date"
                        name="seguro"
                        label="Seguro"
                        value={newAutomovilData.seguro}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormInput
                        type="date"
                        name="verificacion"
                        label="Verificación"
                        value={newAutomovilData.verificacion}
                        onChange={handleNewAutomovilChange}
                    />
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={newAutomovilData.ubicacion || ''}
                        onChange={handleNewAutomovilChange}
                    >
                        <option value="">Seleccionar</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>
                                {area.area}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        type="text"
                        name="noSerie"
                        label="No. Serie"
                        value={newAutomovilData.noSerie}
                        onChange={handleNewAutomovilChange}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleAddRow}>Añadir</CButton>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancelar</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>Editar Automóvil</CModalHeader>
                <CModalBody>
                    <CFormInput
                        type="text"
                        name="matricula"
                        label="Matricula"
                        value={formData.matricula || ''}
                        onChange={handleFormChange}
                    />
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Auto">Auto</option>
                        <option value="Camioneta">Camioneta</option>
                        <option value="Moto">Moto</option>
                        <option value="Scooter">Scooter</option>
                        <option value="Bicicletas">Bicicletas</option>
                    </CFormSelect>
                    <CFormInput
                        type="text"
                        name="marca"
                        label="Marca"
                        value={formData.marca || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        type="text"
                        name="modelo"
                        label="Modelo"
                        value={formData.modelo || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        type="text"
                        name="color"
                        label="Color"
                        value={formData.color || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        type="text"
                        name="noMotor"
                        label="No. Motor"
                        value={formData.noMotor || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        type="date"
                        name="servicio"
                        label="Servicio"
                        value={formData.servicio || ''}
                        onChange={handleFormChange}
                    />
                    <CFormSelect
                        name="idPersonal"
                        label="Personal"
                        value={formData.idPersonal || ''}
                        onChange={handleFormChange}
                    >
                        <option value={0}>Selecciona Personal</option>
                        {personal.map(person => (
                            <option key={person.idPersonal} value={person.idPersonal}>{person.nombre}</option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        type="text"
                        name="observaciones"
                        label="Observaciones"
                        value={formData.observaciones || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        type="date"
                        name="tenencia"
                        label="Tenencia"
                        value={formData.tenencia || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        type="date"
                        name="seguro"
                        label="Seguro"
                        value={formData.seguro || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        type="date"
                        name="verificacion"
                        label="Verificación"
                        value={formData.verificacion || ''}
                        onChange={handleFormChange}
                    />
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={formData.ubicacion || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>
                                {area.area}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        type="text"
                        name="noSerie"
                        label="No. Serie"
                        value={formData.noSerie || ''}
                        onChange={handleFormChange}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleSaveEdit}>Guardar cambios</CButton>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancelar</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>Eliminar Automóvil</CModalHeader>
                <CModalBody>¿Estás seguro de que quieres eliminar este automóvil?</CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={handleDeleteRow}>Eliminar</CButton>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Automovil;
