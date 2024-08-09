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

const Expedientes = () => {
    const [expedientes, setExpedientes] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [selectedExpedienteId, setSelectedExpedienteId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newExpedienteData, setNewExpedienteData] = useState({
        expediente: 'No hay',
        curp: 'Original',
        ine: 'No hay',
        certificado: 'No hay',
        comDomicilio: 'No hay',
        cartilla: 'No hay',
        nss: 'No hay',
        rfc: 'No hay',
        observaciones: '',
        id_Personal: 0, // Cambiar nombre de campo a id_Personal
    });

    useEffect(() => {
        const fetchExpedientes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/expedientes');
                setExpedientes(response.data);
            } catch (error) {
                console.error('Error fetching expedientes:', error);
            }
        };

        const fetchPersonal = async () => {
            try {
                const response = await axios.get('http://localhost:4000/personal/sinExpediente');
                setPersonal(response.data);
            } catch (error) {
                console.error('Error fetching personal:', error);
            }
        };

        fetchExpedientes();
        fetchPersonal();
    }, []);

    const handleAddExpediente = async () => {
        try {
            const response = await axios.post('http://localhost:4000/expedientes', newExpedienteData);
            setExpedientes([...expedientes, response.data]);
            setShowAddModal(false);
            setNewExpedienteData({
                expediente: 'No hay',
                curp: 'No hay',
                ine: 'No hay',
                certificado: 'No hay',
                comDomicilio: 'No hay',
                cartilla: 'No hay',
                nss: 'No hay',
                rfc: 'No hay',
                observaciones: '',
                id_Personal: 0, // Restablecer a valor inicial
            });
        } catch (error) {
            console.error('Error adding expediente:', error);
        }
    };

    const handleDeleteExpediente = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/expedientes/${id}`);
            const newExpedientes = expedientes.filter(expediente => expediente.idExpediente !== id);
            setExpedientes(newExpedientes);
            setSelectedExpedienteId(null);
        } catch (error) {
            console.error('Error deleting expediente:', error);
        }
    };

    const handleEditExpediente = (id) => {
        const expedienteToEdit = expedientes.find(expediente => expediente.idExpediente === id);
        setFormData(expedienteToEdit);
        setSelectedExpedienteId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewExpedienteChange = (e) => {
        const { name, value } = e.target;
        setNewExpedienteData({ ...newExpedienteData, [name]: value });
    };

    const handleSaveEdit = async () => {
        console.log('Saving changes for expediente:', formData)
        try {
            const response = await axios.put(`http://localhost:4000/expedientes/${selectedExpedienteId}`, formData);
            const updatedExpedientes = expedientes.map(expediente =>
                expediente.idExpediente === selectedExpedienteId ? response.data : expediente
            );
            setExpedientes(updatedExpedientes);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating expediente:', error)
        }
    }

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

            pdf.save('expedientes.pdf');
        });
    };

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Expedientes
                            <div className="d-flex justify-content-end">
                                <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                    <CIcon icon={cilPlus} /> Añadir
                                </CButton>
                                <CButton color="danger" onClick={() => handleDeleteExpediente(selectedExpedienteId)} disabled={selectedExpedienteId === null} className="me-2">
                                    <CIcon icon={cilTrash} /> Eliminar
                                </CButton>
                                <CButton color="info" onClick={() => handleEditExpediente(selectedExpedienteId)} disabled={selectedExpedienteId === null} className="me-2">
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
                                        <CTableHeaderCell>Personal</CTableHeaderCell>
                                        <CTableHeaderCell>Expediente</CTableHeaderCell>
                                        <CTableHeaderCell>Curp</CTableHeaderCell>
                                        <CTableHeaderCell>INE</CTableHeaderCell>
                                        <CTableHeaderCell>Certificado</CTableHeaderCell>
                                        <CTableHeaderCell>Comprobante Dom.</CTableHeaderCell>
                                        <CTableHeaderCell>Cartilla</CTableHeaderCell>
                                        <CTableHeaderCell>NSS</CTableHeaderCell>
                                        <CTableHeaderCell>RFC</CTableHeaderCell>
                                        <CTableHeaderCell>Observaciones</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {expedientes.map(expediente => (
                                        <CTableRow
                                            key={expediente.idExpediente}
                                            onClick={() => setSelectedExpedienteId(expediente.idExpediente)}
                                            className={expediente.idExpediente === selectedExpedienteId ? 'table-active' : ''}>
                                            <CTableDataCell>{expediente.idExpediente}</CTableDataCell>
                                            <CTableDataCell>{expediente.nombre}</CTableDataCell>
                                            <CTableDataCell>{expediente.expediente}</CTableDataCell>
                                            <CTableDataCell>{expediente.curp}</CTableDataCell>
                                            <CTableDataCell>{expediente.ine}</CTableDataCell>
                                            <CTableDataCell>{expediente.certificado}</CTableDataCell>
                                            <CTableDataCell>{expediente.comDomicilio}</CTableDataCell>
                                            <CTableDataCell>{expediente.cartilla}</CTableDataCell>
                                            <CTableDataCell>{expediente.nss}</CTableDataCell>
                                            <CTableDataCell>{expediente.rfc}</CTableDataCell>
                                            <CTableDataCell>{expediente.observaciones}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CModal size="lg" visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Expediente</h5>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs={6}>
                            <CFormInput
                                label="Expediente"
                                type="text"
                                name="expediente"
                                value={formData.expediente}
                                onChange={handleFormChange}
                            />
                        </CCol>
                        <CCol xs={6}>
                            <CFormInput
                                label="Curp"
                                type="text"
                                name="curp"
                                value={formData.curp}
                                onChange={handleFormChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={6}>
                            <CFormInput
                                label="INE"
                                type="text"
                                name="ine"
                                value={formData.ine}
                                onChange={handleFormChange}
                            />
                        </CCol>
                        <CCol xs={6}>
                            <CFormInput
                                label="Certificado"
                                type="text"
                                name="certificado"
                                value={formData.certificado}
                                onChange={handleFormChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={6}>
                            <CFormInput
                                label="Comprobante de Domicilio"
                                type="text"
                                name="comDomicilio"
                                value={formData.comDomicilio}
                                onChange={handleFormChange}
                            />
                        </CCol>
                        <CCol xs={6}>
                            <CFormInput
                                label="Cartilla"
                                type="text"
                                name="cartilla"
                                value={formData.cartilla}
                                onChange={handleFormChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={6}>
                            <CFormInput
                                label="NSS"
                                type="text"
                                name="nss"
                                value={formData.nss}
                                onChange={handleFormChange}
                            />
                        </CCol>
                        <CCol xs={6}>
                            <CFormInput
                                label="RFC"
                                type="text"
                                name="rfc"
                                value={formData.rfc}
                                onChange={handleFormChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12}>
                            <CFormInput
                                label="Observaciones"
                                type="text"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleFormChange}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="primary" onClick={handleSaveEdit}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal size="lg" visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader>
                    <h5>Agregar Expediente</h5>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs={12}>
                            <CFormSelect
                                label="Personal"
                                name="id_Personal"
                                value={newExpedienteData.id_Personal}
                                onChange={handleNewExpedienteChange}
                            >
                                <option value={0}>Seleccione un personal</option>
                                {personal.map(persona => (
                                    <option key={persona.idPersonal} value={persona.idPersonal}>
                                        {persona.nombre} {persona.apellido_paterno} {persona.apellido_materno}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={6}>
                            <CFormInput
                                label="Expediente"
                                type="text"
                                name="expediente"
                                value={newExpedienteData.expediente}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                        <CCol xs={6}>
                            <CFormInput
                                label="Curp"
                                type="text"
                                name="curp"
                                value={newExpedienteData.curp}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={6}>
                            <CFormInput
                                label="INE"
                                type="text"
                                name="ine"
                                value={newExpedienteData.ine}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                        <CCol xs={6}>
                            <CFormInput
                                label="Certificado"
                                type="text"
                                name="certificado"
                                value={newExpedienteData.certificado}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={6}>
                            <CFormInput
                                label="Comprobante de Domicilio"
                                type="text"
                                name="comDomicilio"
                                value={newExpedienteData.comDomicilio}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                        <CCol xs={6}>
                            <CFormInput
                                label="Cartilla"
                                type="text"
                                name="cartilla"
                                value={newExpedienteData.cartilla}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={6}>
                            <CFormInput
                                label="NSS"
                                type="text"
                                name="nss"
                                value={newExpedienteData.nss}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                        <CCol xs={6}>
                            <CFormInput
                                label="RFC"
                                type="text"
                                name="rfc"
                                value={newExpedienteData.rfc}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12}>
                            <CFormInput
                                label="Observaciones"
                                type="text"
                                name="observaciones"
                                value={newExpedienteData.observaciones}
                                onChange={handleNewExpedienteChange}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="primary" onClick={handleAddExpediente}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Expedientes;
