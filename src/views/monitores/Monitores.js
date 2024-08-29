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

const Monitores = () => {
    const [monitores, setMonitores] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedMonitorId, setSelectedMonitorId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newMonitorData, setNewMonitorData] = useState({
        marca: '',
        modelo: '',
        pulgadas: 0,
        estado: '',
        ubicacion: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMonitores = async () => {
            try {
                const response = await axios.get('http://localhost:4000/monitores');
                setMonitores(response.data);
            } catch (error) {
                console.error('Error fetching Monitores:', error);
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

        fetchMonitores();
        fetchAreas();
    }, []);

    const handleAddMonitor = async () => {
        try {
            const response = await axios.post('http://localhost:4000/monitores', newMonitorData);
            setMonitores([...monitores, response.data]);
            setShowAddModal(false);
            setNewMonitorData({
                marca: '',
                modelo: '',
                pulgadas: 0,
                estado: '',
                ubicacion: 0,
            });
        } catch (error) {
            console.error('Error adding monitor:', error);
        }
    };

    const handleDeleteMonitor = async () => {
        try {
            await axios.delete(`http://localhost:4000/Monitores/${selectedMonitorId}`);
            const newMonitores = monitores.filter(monitor => monitor.id !== selectedMonitorId);
            setMonitores(newMonitores);
            setSelectedMonitorId(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting monitor:', error);
        }
    };

    const handleEditMonitor = (id) => {
        const monitorToEdit = monitores.find(monitor => monitor.id === id);
        setFormData(monitorToEdit);
        setSelectedMonitorId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewMonitorChange = (e) => {
        const { name, value } = e.target;
        setNewMonitorData({ ...newMonitorData, [name]: value });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/Monitores/${selectedMonitorId}`, formData);
            const updatedMonitores = monitores.map(monitor => monitor.id === selectedMonitorId ? response.data : monitor);
            setMonitores(updatedMonitores);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating monitor:', error);
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

            pdf.save('Monitores.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMonitores = monitores.filter(monitor =>
        monitor.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monitor.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Monitores
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                        <CIcon icon={cilPlus} /> Añadir
                                    </CButton>
                                    <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedMonitorId === null} className="me-2">
                                        <CIcon icon={cilTrash} /> Eliminar
                                    </CButton>
                                    <CButton color="info" onClick={() => handleEditMonitor(selectedMonitorId)} disabled={selectedMonitorId === null} className="me-2">
                                        <CIcon icon={cilPen} /> Editar
                                    </CButton>
                                    <CButton color="success" onClick={handleGeneratePDF}>
                                        <CIcon icon={cilPrint} /> Generar PDF
                                    </CButton>
                                </div>
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar por marca o modelo"
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
                                        <CTableHeaderCell>Marca</CTableHeaderCell>
                                        <CTableHeaderCell>Modelo</CTableHeaderCell>
                                        <CTableHeaderCell>Pulgadas</CTableHeaderCell>
                                        <CTableHeaderCell>Estado</CTableHeaderCell>
                                        <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredMonitores.map((monitor, index) => (
                                        <CTableRow
                                            key={monitor.id}
                                            onClick={() => setSelectedMonitorId(monitor.id)}
                                            className={monitor.id === selectedMonitorId ? 'table-active' : ''}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{monitor.marca}</CTableDataCell>
                                            <CTableDataCell>{monitor.modelo}</CTableDataCell>
                                            <CTableDataCell>{monitor.pulgadas}</CTableDataCell>
                                            <CTableDataCell>{monitor.estado}</CTableDataCell>
                                            <CTableDataCell>{monitor.ubicacion}</CTableDataCell>
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
                    <h5>Añadir Monitor</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={newMonitorData.marca}
                        onChange={handleNewMonitorChange}
                    />
                    <CFormInput
                        label="Modelo"
                        name="modelo"
                        value={newMonitorData.modelo}
                        onChange={handleNewMonitorChange}
                    />
                    <CFormInput
                        label="Pulgadas"
                        name="pulgadas"
                        type="number"
                        value={newMonitorData.pulgadas}
                        onChange={handleNewMonitorChange}
                    />
                    <CFormSelect
                        label="Estado"
                        name="estado"
                        value={newMonitorData.estado}
                        onChange={handleNewMonitorChange}
                    >
                        <option value="seleccione">Seleccione un estado</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="En buenascondiciones">En buenas condiciones</option>
                        <option value="Necesita reparacion">Necesita reparacion</option>
                    </CFormSelect>
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={newMonitorData.ubicacion}
                        onChange={handleNewMonitorChange}
                    >
                        <option value="">Seleccionar ubicación</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
                        ))}
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="primary" onClick={handleAddMonitor}>
                        Añadir
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para editar */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Monitor</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="Modelo"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="Pulgadas"
                        name="pulgadas"
                        type="number"
                        value={formData.pulgadas}
                        onChange={handleFormChange}
                    />
                    <CFormSelect
                        label="Estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleFormChange}
                    >
                        <option value="seleccione">Seleccione un estado</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="En buenas condiciones">En buenas condiciones</option>
                        <option value="Necesita reparacion">Necesita reparacion</option>
                    </CFormSelect>
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
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para eliminar */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <h5>Eliminar Monitor</h5>
                </CModalHeader>
                <CModalBody>
                    <p>¿Está seguro de que desea eliminar el monitor seleccionado?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteMonitor}>
                        Eliminar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Monitores;
