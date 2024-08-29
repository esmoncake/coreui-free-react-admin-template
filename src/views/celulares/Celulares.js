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

const Celulares = () => {
    const [celulares, setCelulares] = useState([]);
    const [areas, setAreas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [encargados, setEncargados] = useState([]);
    const [selectedCelularId, setSelectedCelularId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newRowData, setNewRowData] = useState({
        marca: '',
        modelo: '',
        noimei: '',
        ubicacion: 0,
        estado: '',
        notelefono: '',
        descripcion: '',
        idPersonal: 0,
        idProveedor: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCelulares = async () => {
            try {
                const response = await axios.get('http://localhost:4000/celulares');
                setCelulares(response.data);
            } catch (error) {
                console.error('Error fetching celulares:', error);
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

        const fetchProveedores = async () => {
            try {
                const response = await axios.get('http://localhost:4000/proveedores');
                setProveedores(response.data);
            } catch (error) {
                console.error('Error fetching proveedores:', error);
            }
        };

        const fetchEncargados = async () => {
            try {
                const response = await axios.get('http://localhost:4000/personal');
                setEncargados(response.data);
            } catch (error) {
                console.error('Error fetching encargados:', error);
            }
        };

        fetchCelulares();
        fetchAreas();
        fetchProveedores();
        fetchEncargados();
    }, []);

    const handleAddCelular = async () => {
        try {
            const response = await axios.post('http://localhost:4000/celulares', newRowData);
            setCelulares([...celulares, response.data]);
            setShowAddModal(false);
            setNewRowData({
                marca: '',
                modelo: '',
                noimei: '',
                ubicacion: 0,
                estado: '',
                notelefono: '',
                descripcion: '',
                idPersonal: 0,
                idProveedor: 0
            });
        } catch (error) {
            console.error('Error adding celular:', error);
        }
    };

    const handleDeleteCelular = async () => {
        try {
            await axios.delete(`http://localhost:4000/celulares/${selectedCelularId}`);
            const newCelulares = celulares.filter(celular => celular.id !== selectedCelularId);
            setCelulares(newCelulares);
            setSelectedCelularId(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting celular:', error);
        }
    };

    const handleEditCelular = (id) => {
        const celularToEdit = celulares.find(celular => celular.id === id);
        setFormData(celularToEdit);
        setSelectedCelularId(id);
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
            const response = await axios.put(`http://localhost:4000/celulares/${selectedCelularId}`, formData);
            const updatedCelulares = celulares.map(celular => celular.id === selectedCelularId ? response.data : celular);
            setCelulares(updatedCelulares);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating celular:', error);
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

            pdf.save('Celulares.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCelulares = celulares.filter(celular =>
        celular.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        celular.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Celulares
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                        <CIcon icon={cilPlus} /> Añadir
                                    </CButton>
                                    <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedCelularId === null} className="me-2">
                                        <CIcon icon={cilTrash} /> Eliminar
                                    </CButton>
                                    <CButton color="info" onClick={() => handleEditCelular(selectedCelularId)} disabled={selectedCelularId === null} className="me-2">
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
                                        <CTableHeaderCell>No. IMEI</CTableHeaderCell>
                                        <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                        <CTableHeaderCell>Estado</CTableHeaderCell>
                                        <CTableHeaderCell>No. Teléfono</CTableHeaderCell>
                                        <CTableHeaderCell>Descripción</CTableHeaderCell>
                                        <CTableHeaderCell>Personal</CTableHeaderCell>
                                        <CTableHeaderCell>Proveedor</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredCelulares.map((celular, index) => (
                                        <CTableRow
                                            key={celular.id}
                                            onClick={() => setSelectedCelularId(celular.id)}
                                            className={celular.id === selectedCelularId ? 'table-active' : ''}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{celular.marca}</CTableDataCell>
                                            <CTableDataCell>{celular.modelo}</CTableDataCell>
                                            <CTableDataCell>{celular.noimei}</CTableDataCell>
                                            <CTableDataCell>{celular.ubicacion}</CTableDataCell>
                                            <CTableDataCell>{celular.estado}</CTableDataCell>
                                            <CTableDataCell>{celular.notelefono}</CTableDataCell>
                                            <CTableDataCell>{celular.descripcion}</CTableDataCell>
                                            <CTableDataCell>{celular.encargado}</CTableDataCell>
                                            <CTableDataCell>{celular.proveedor}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader>
                    <h5 className="modal-title">Añadir Celular</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={newRowData.marca}
                        onChange={handleNewRowChange}
                    />
                    <CFormInput
                        label="Modelo"
                        name="modelo"
                        value={newRowData.modelo}
                        onChange={handleNewRowChange}
                    />
                    <CFormInput
                        label="No. IMEI"
                        name="noimei"
                        value={newRowData.noimei}
                        onChange={handleNewRowChange}
                    />
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={newRowData.ubicacion}
                        onChange={handleNewRowChange}
                    >
                        <option value="">Seleccionar</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>
                                {area.area}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        label="Estado"
                        name="estado"
                        value={newRowData.estado}
                        onChange={handleNewRowChange}
                    />
                    <CFormInput
                        label="No. Teléfono"
                        name="notelefono"
                        value={newRowData.noTelefono}
                        onChange={handleNewRowChange}
                    />
                    <CFormInput
                        label="Descripción"
                        name="descripcion"
                        value={newRowData.descripcion}
                        onChange={handleNewRowChange}
                    />
                    <CFormSelect
                        label="Personal"
                        name="idPersonal"
                        value={newRowData.idPersonal}
                        onChange={handleNewRowChange}
                    >
                        <option value="">Seleccionar</option>
                        {encargados.map(encargado => (
                            <option key={encargado.idPersonal} value={encargado.idPersonal}>
                                {encargado.nombre}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormSelect
                        label="Proveedor"
                        name="idProveedor"
                        value={newRowData.idProveedor}
                        onChange={handleNewRowChange}
                    >
                        <option value="">Seleccionar</option>
                        {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
                            </option>
                        ))}
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="primary" onClick={handleAddCelular}>
                        Añadir
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5 className="modal-title">Editar Celular</h5>
                </CModalHeader>
                <CModalBody>
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
                        label="No. IMEI"
                        name="noimei"
                        value={formData.noimei || ''}
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
                        label="Estado"
                        name="estado"
                        value={formData.estado || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="No. Teléfono"
                        name="notelefono"
                        value={formData.notelefono || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="Descripción"
                        name="descripcion"
                        value={formData.descripcion || ''}
                        onChange={handleFormChange}
                    />
                    <CFormSelect
                        label="Personal"
                        name="idPersonal"
                        value={formData.idPersonal || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar</option>
                        {encargados.map(encargado => (
                            <option key={encargado.idPersonal} value={encargado.idPersonal}>
                                {encargado.nombre}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormSelect
                        label="Proveedor"
                        name="idProveedor"
                        value={formData.idProveedor || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar</option>
                        {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
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

            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <h5 className="modal-title">Eliminar Celular</h5>
                </CModalHeader>
                <CModalBody>
                    ¿Estás seguro de que deseas eliminar este celular?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteCelular}>
                        Eliminar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Celulares;
