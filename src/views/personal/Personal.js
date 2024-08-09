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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons';

const Personal = () => {
    const [personal, setPersonal] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedPersonalId, setSelectedPersonalId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({});

    const [newPersonalData, setNewPersonalData] = useState({
        nombre: '',
        apePaterno: '',
        apeMaterno: '',
        cumpleanos: '',
        ubicacion: 0,
    });

    useEffect(() => {
        const fetchPersonal = async () => {
            try {
                const response = await axios.get('http://localhost:4000/personal');
                setPersonal(response.data);
            } catch (error) {
                console.error('Error fetching personal:', error);
            }
        };

        const fetchAreas = async () => {
            try {
                const response = await axios.get('http://localhost:4000/areas'); // Asegúrate de que esta URL sea la correcta
                setAreas(response.data);
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        };

        fetchPersonal();
        fetchAreas();
    }, []);

    const handleAddPersonal = async () => {
        try {
            const response = await axios.post('http://localhost:4000/personal', newPersonalData);
            setPersonal([...personal, response.data]);
            setShowAddModal(false);
            setNewPersonalData({
                nombre: '',
                apePaterno: '',
                apeMaterno: '',
                cumpleanos: '',
                ubicacion: '',
            });
        } catch (error) {
            console.error('Error adding personal:', error);
        }
    };

    const handleDeletePersonal = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/personal/${id}`);
            const newPersonal = personal.filter(persona => persona.idPersonal !== id);
            setPersonal(newPersonal);
            setSelectedPersonalId(null);
        } catch (error) {
            console.error('Error deleting personal:', error);
        }
    };

    const handleEditPersonal = (id) => {
        const personalToEdit = personal.find(persona => persona.idPersonal === id);
        setFormData(personalToEdit);
        setSelectedPersonalId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewPersonalChange = (e) => {
        const { name, value } = e.target;
        setNewPersonalData({ ...newPersonalData, [name]: value });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/personal/${selectedPersonalId}`, formData);
            const updatedPersonal = personal.map(persona => persona.idPersonal === selectedPersonalId ? response.data : persona);
            setPersonal(updatedPersonal);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating personal:', error);
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

            pdf.save('personal.pdf');
        });
    };

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
                            Tabla Personal
                            <div className="d-flex justify-content-end">
                                <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                    <CIcon icon={cilPlus} /> Añadir
                                </CButton>
                                <CButton color="danger" onClick={() => handleDeletePersonal(selectedPersonalId)} disabled={selectedPersonalId === null} className="me-2">
                                    <CIcon icon={cilTrash} /> Eliminar
                                </CButton>
                                <CButton color="info" onClick={() => handleEditPersonal(selectedPersonalId)} disabled={selectedPersonalId === null} className="me-2">
                                    <CIcon icon={cilPen} /> Editar
                                </CButton>
                                <CButton color="success" onClick={handleGeneratePDF}>
                                    <CIcon icon={cilPrint} /> Generar PDF
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CTable id="table-to-pdf" align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Nombre</CTableHeaderCell>
                                        <CTableHeaderCell>Apellido Paterno</CTableHeaderCell>
                                        <CTableHeaderCell>Apellido Materno</CTableHeaderCell>
                                        <CTableHeaderCell>Cumpleaños</CTableHeaderCell>
                                        <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {personal.map(persona => (
                                        <CTableRow
                                            key={persona.idPersonal}
                                            onClick={() => setSelectedPersonalId(persona.idPersonal)}
                                            className={persona.idPersonal === selectedPersonalId ? 'table-active' : ''}>
                                            <CTableDataCell>{persona.idPersonal}</CTableDataCell>
                                            <CTableDataCell>{persona.nombre}</CTableDataCell>
                                            <CTableDataCell>{persona.apePaterno}</CTableDataCell>
                                            <CTableDataCell>{persona.apeMaterno}</CTableDataCell>
                                            <CTableDataCell>{formatDate(persona.cumpleanos)}</CTableDataCell>
                                            <CTableDataCell>{persona.ubicacion}</CTableDataCell>
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
                    <h5>Añadir Personal</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Nombre"
                        name="nombre"
                        value={newPersonalData.nombre}
                        onChange={handleNewPersonalChange}
                    />
                    <CFormInput
                        label="Apellido Paterno"
                        name="apePaterno"
                        value={newPersonalData.apePaterno}
                        onChange={handleNewPersonalChange}
                    />
                    <CFormInput
                        label="Apellido Materno"
                        name="apeMaterno"
                        value={newPersonalData.apeMaterno}
                        onChange={handleNewPersonalChange}
                    />
                    <CFormInput
                        type="date"
                        label="Cumpleaños"
                        name="cumpleanos"
                        value={newPersonalData.cumpleanos}
                        onChange={handleNewPersonalChange}
                    />
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={newPersonalData.ubicacion}
                        onChange={handleNewPersonalChange}
                    >
                        <option value="">Seleccionar ubicación</option>
                        {areas.map(area => (
                            <option key={area.iAreas} value={area.idAreas}>{area.area}</option>
                        ))}
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleAddPersonal}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para editar */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Personal</h5>
                </CModalHeader>
                <CModalBody>
                    {formData && (
                        <>
                            <CFormInput
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleFormChange}
                            />
                            <CFormInput
                                label="Apellido Paterno"
                                name="apePaterno"
                                value={formData.apePaterno}
                                onChange={handleFormChange}
                            />
                            <CFormInput
                                label="Apellido Materno"
                                name="apeMaterno"
                                value={formData.apeMaterno}
                                onChange={handleFormChange}
                            />
                            <CFormInput
                                type="date"
                                label="Cumpleaños"
                                name="cumpleanos"
                                value={formData.cumpleanos}
                                onChange={handleFormChange}
                            />
                            <CFormSelect
                                label="Ubicación"
                                name="ubicacion"
                                value={formData.ubicacion}
                                onChange={handleFormChange}
                            >
                                <option value="">Seleccionar ubicación</option>
                                {areas.map(area => (
                                    <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
                                ))}
                            </CFormSelect>
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
        </>
    );
};

export default Personal;
