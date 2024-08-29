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

const Radios = () => {
    const [radios, setRadios] = useState([]);
    const [areas, setAreas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [encargados, setEncargados] = useState([]);
    const [selectedRadioId, setSelectedRadioId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newRadioData, setNewRadioData] = useState({
        marca: '',
        modelo: '',
        noSerie: '',
        ubicacion: 0,
        encargado: 0,
        estado: '',
        idProveedor: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRadios = async () => {
            try {
                const response = await axios.get('http://localhost:4000/radios');
                setRadios(response.data);
            } catch (error) {
                console.error('Error fetching Radios:', error);
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
                console.error('Error fetching provedores:', error);
            }
        };

        const fetchEncargados = async () => {
            try{
                const response = await axios.get('http://localhost:4000/personal');
                setEncargados(response.data);
            } catch (error) {
                console.error('Error fetching encargados:', error);
            }

        }

        fetchRadios();
        fetchAreas();
        fetchProveedores();
        fetchEncargados();
    }, []);

    const handleAddRadio = async () => {
        try {
            const response = await axios.post('http://localhost:4000/radios', newRadioData);
            setRadios([...radios, response.data]);
            setShowAddModal(false);
            setNewRadioData({
                marca: '',
                modelo: '',
                noSerie: '',
                ubicacion: 0,
                encargado: 0,
                estado: '',
                idProveedor: 0,
            });
        } catch (error) {
            console.error('Error adding radio:', error);
        }
    };

    const handleDeleteRadio = async () => {
        try {
            await axios.delete(`http://localhost:4000/radios/${selectedRadioId}`);
            const newRadios = radios.filter(radio => radio.id !== selectedRadioId);
            setRadios(newRadios);
            setSelectedRadioId(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting radio:', error);
        }
    };

    const handleEditRadio = (id) => {
        const radioToEdit = radios.find(radio => radio.id === id);
        setFormData(radioToEdit);
        setSelectedRadioId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewRadioChange = (e) => {
        const { name, value } = e.target;
        setNewRadioData({ ...newRadioData, [name]: value });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/radios/${selectedRadioId}`, formData);
            const updatedRadios = radios.map(radio => radio.id === selectedRadioId ? response.data : radio);
            setRadios(updatedRadios);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating radio:', error);
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

            pdf.save('Radios.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRadios = radios.filter(radio =>
        radio.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        radio.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Radios
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                        <CIcon icon={cilPlus} /> Añadir
                                    </CButton>
                                    <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedRadioId === null} className="me-2">
                                        <CIcon icon={cilTrash} /> Eliminar
                                    </CButton>
                                    <CButton color="info" onClick={() => handleEditRadio(selectedRadioId)} disabled={selectedRadioId === null} className="me-2">
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
                                        <CTableHeaderCell>No. Serie</CTableHeaderCell>
                                        <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                        <CTableHeaderCell>Encargado</CTableHeaderCell>
                                        <CTableHeaderCell>Estado</CTableHeaderCell>
                                        <CTableHeaderCell>Proveedor</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredRadios.map((radio, index) => (
                                        <CTableRow
                                            key={radio.id}
                                            onClick={() => setSelectedRadioId(radio.id)}
                                            className={radio.id === selectedRadioId ? 'table-active' : ''}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{radio.marca}</CTableDataCell>
                                            <CTableDataCell>{radio.modelo}</CTableDataCell>
                                            <CTableDataCell>{radio.noSerie}</CTableDataCell>
                                            <CTableDataCell>{radio.ubicacion}</CTableDataCell>
                                            <CTableDataCell>{radio.encargado}</CTableDataCell>
                                            <CTableDataCell>{radio.estado}</CTableDataCell>
                                            <CTableDataCell>{radio.idProveedor}</CTableDataCell>
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
                    <h5>Añadir Radio</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={newRadioData.marca}
                        onChange={handleNewRadioChange}
                    />
                    <CFormInput
                        label="Modelo"
                        name="modelo"
                        value={newRadioData.modelo}
                        onChange={handleNewRadioChange}
                    />
                    <CFormInput
                        label="No. Serie"
                        name="noSerie"
                        value={newRadioData.noSerie}
                        onChange={handleNewRadioChange}
                    />
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={newRadioData.ubicacion}
                        onChange={handleNewRadioChange}
                    >
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>
                                {area.area}
                            </option>
                        ))}
                    </CFormSelect>

                    <CFormSelect
                        label="Encargado"
                        name="encargado"
                        value={newRadioData.encargado || ''}
                        onChange={handleNewRadioChange}                        
                    >
                        <option value="">Seleccione un Encargado Valido</option>  
                        {encargados.map(encargado => (
                            <option key={encargado.idPersonal} value={encargado.idPersonal}>
                                {encargado.nombre}
                            </option>
                        ))}

                    </CFormSelect>

                    <CFormSelect
                        label="Estado"
                        name="estado"
                        value={newRadioData.estado || ''}
                        onChange={handleNewRadioChange}
                    >
                        <option value="">Seleccione un estado</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="En buenas condiciones">En buenas condiciones</option>
                        <option value="Necesita reparacion">Necesita Reparación</option>
                    </CFormSelect>

                    <CFormSelect
                        label="Proveedor"
                        name="idProveedor"
                        value={newRadioData.idProveedor}
                        onChange={handleNewRadioChange}
                    >
                        <option value="">Seleccione un Provedor</option>                        
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
                    <CButton color="primary" onClick={handleAddRadio}>
                        Añadir
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para editar */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Radio</h5>
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
                        label="No. Serie"
                        name="noSerie"
                        value={formData.noSerie}
                        onChange={handleFormChange}
                    />
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
                    
                    <CFormSelect
                        label="Encargado"
                        name="encargado"
                        value={newRadioData.encargado || ''}
                        onChange={handleNewRadioChange}                        
                    >
                        <option value="">Seleccione un Encargado Valido</option>
                        {encargados.map(encargado => (
                            <option key={encargado.idPersonal} value={encargado.idPersonal}>
                                {encargado.nombre}
                            </option>
                        ))}

                    </CFormSelect>

                    <CFormSelect
                        label="Estado"
                        name="estado"
                        value={formData.estado || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccione un estado</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="En buenas condiciones">En buenas condiciones</option>
                        <option value="Necesita reparacion">Necesita Reparación</option>
                    </CFormSelect>
                    
                    <CFormSelect
                        label="Proveedor"
                        name="idProveedor"
                        value={formData.idProveedor}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccione un Provedor</option>
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
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para eliminar */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <h5>Eliminar Radio</h5>
                </CModalHeader>
                <CModalBody>
                    <p>¿Estás seguro de que quieres eliminar este radio?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteRadio}>
                        Eliminar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Radios;
