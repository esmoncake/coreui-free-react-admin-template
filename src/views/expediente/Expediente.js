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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newExpedienteData, setNewExpedienteData] = useState({
        expediente: 'No hay',
        curp: 'No hay',
        ine: 'No hay',
        certificado: 'No hay',
        comDomicilio: 'No hay',
        cartilla: 'No hay',
        nss: 'No hay',
        rfc: 'No hay',
        observaciones: '',
        acta: 'No hay',
        id_Personal: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

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
                acta: 'No hay',
                id_Personal: 0,
            });
        } catch (error) {
            console.error('Error adding expediente:', error);
        }
    };

    const handleDeleteExpediente = async () => {
        try {
            await axios.delete(`http://localhost:4000/expedientes/${selectedExpedienteId}`);
            const newExpedientes = expedientes.filter(expediente => expediente.idExpediente !== selectedExpedienteId);
            setExpedientes(newExpedientes);
            setShowDeleteModal(false);
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
        try {
            const response = await axios.put(`http://localhost:4000/expedientes/${selectedExpedienteId}`, formData);
            const updatedExpedientes = expedientes.map(expediente =>
                expediente.idExpediente === selectedExpedienteId ? response.data : expediente
            );
            setExpedientes(updatedExpedientes);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating expediente:', error);
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

            pdf.save('expedientes.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredExpedientes = expedientes.filter(expediente =>
        expediente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Expedientes
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                        <CIcon icon={cilPlus} /> Añadir
                                    </CButton>
                                    <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedExpedienteId === null} className="me-2">
                                        <CIcon icon={cilTrash} /> Eliminar
                                    </CButton>
                                    <CButton color="info" onClick={() => handleEditExpediente(selectedExpedienteId)} disabled={selectedExpedienteId === null} className="me-2">
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
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Personal</CTableHeaderCell>
                                        <CTableHeaderCell>Expediente</CTableHeaderCell>
                                        <CTableHeaderCell>Acta</CTableHeaderCell>
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
                                    {filteredExpedientes.map((expediente, index) => (
                                        <CTableRow
                                            key={expediente.idExpediente}
                                            onClick={() => setSelectedExpedienteId(expediente.idExpediente)}
                                            className={expediente.idExpediente === selectedExpedienteId ? 'table-active' : ''}>
                                            <CTableDataCell>{index + 1}</CTableDataCell> {/* Número consecutivo */}
                                            <CTableDataCell>{expediente.nombre}</CTableDataCell>
                                            <CTableDataCell>{expediente.expediente}</CTableDataCell>
                                            <CTableDataCell>{expediente.acta}</CTableDataCell>
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

            {/* Modal de edición */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Expediente</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        label="Expediente"
                        name="expediente"
                        value={formData.expediente || ''}
                        onChange={handleFormChange}
                    >
                        <option value="No hay">No hay</option>
                        <option value="Si hay">Sí hay</option>
                    </CFormSelect>

                    <CFormSelect
                        label="Curp"
                        name="curp"
                        value={formData.curp || ''}
                        onChange={handleFormChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>

                    <CFormSelect
                        label="INE"
                        name="ine"
                        value={formData.ine || ''}
                        onChange={handleFormChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>

                    <CFormSelect
                        label="Certificado"
                        name="certificado"
                        value={formData.certificado || ''}
                        onChange={handleFormChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>

                    <CFormSelect
                        label="Comprobante de Domicilio"
                        name="comDomicilio"
                        value={formData.comDomicilio || ''}
                        onChange={handleFormChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>


                    <CFormSelect
                        label="Cartilla"
                        name="cartilla"
                        value={formData.cartilla || ''}
                        onChange={handleFormChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>

                    <CFormSelect
                        label="NSS"
                        name="nss"
                        value={formData.nss || ''}
                        onChange={handleFormChange}

                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>

                    <CFormSelect
                        label="RFC"
                        name="rfc"
                        value={formData.rfc || ''}
                        onChange={handleFormChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>

                    <CFormInput
                        label="Observaciones"
                        name="observaciones"
                        value={newExpedienteData.observaciones}
                        onChange={handleNewExpedienteChange}
                    />

                    <CFormSelect
                        label="Acta"
                        name="acta"
                        value={formData.acta || ''}
                        onChange={handleFormChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>

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

            {/* Modal de adición */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader>
                    <h5>Agregar Expediente</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        label="Expediente"
                        name="expediente"
                        value={newExpedienteData.expediente}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="No hay">No hay</option>
                        <option value="Si hay">Sí hay</option>
                    </CFormSelect>

                    <CFormSelect
                        label="Curp"
                        name="curp"
                        value={newExpedienteData.curp}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>
                    <CFormSelect
                        label="INE"
                        name="ine"
                        value={newExpedienteData.ine}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>
                    <CFormSelect
                        label="Certificado"
                        name="certificado"
                        value={newExpedienteData.certificado}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>
                    <CFormSelect
                        label="Comprobante de Domicilio"
                        name="comDomicilio"
                        value={newExpedienteData.comDomicilio}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>
                    <CFormSelect
                        label="Cartilla"
                        name="cartilla"
                        value={newExpedienteData.cartilla}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>
                    <CFormSelect
                        label="NSS"
                        name="nss"
                        value={newExpedienteData.nss}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>
                    <CFormSelect
                        label="RFC"
                        name="rfc"
                        value={newExpedienteData.rfc}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>
                    <CFormInput
                        label="Observaciones"
                        name="observaciones"
                        value={newExpedienteData.observaciones}
                        onChange={handleNewExpedienteChange}
                    />
                    <CFormSelect
                        label="Acta"
                        name="acta"
                        value={newExpedienteData.acta}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value="Original">Original</option>
                        <option value="Copia">Copia</option>
                        <option value="Ambas">Ambas</option>
                        <option value="No hay">No hay</option>
                    </CFormSelect>
                    <CFormSelect
                        label="Personal"
                        name="id_Personal"
                        value={newExpedienteData.id_Personal}
                        onChange={handleNewExpedienteChange}
                    >
                        <option value={0}>Selecciona Personal</option>
                        {personal.map(persona => (
                            <option key={persona.id_Personal} value={persona.id_Personal}>
                                {persona.nombre}
                            </option>
                        ))}
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="primary" onClick={handleAddExpediente}>
                        Agregar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal de confirmación de eliminación */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <h5>Eliminar Expediente</h5>
                </CModalHeader>
                <CModalBody>
                    <p>¿Estás seguro de que deseas eliminar este expediente?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteExpediente}>
                        Eliminar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Expedientes;
