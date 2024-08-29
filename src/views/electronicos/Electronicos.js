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
    CFormFeedback
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons';

const Electronicos = () => {
    const [electronicos, setElectronicos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedElectronicoId, setSelectedElectronicoId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newElectronicoData, setNewElectronicoData] = useState({
        estado: '',
        ubicacion: 0,
        color: '',
        tamano: '',
        tipo: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchElectronicos = async () => {
            try {
                const response = await axios.get('http://localhost:4000/electronicos');
                setElectronicos(response.data);
            } catch (error) {
                console.error('Error fetching Electronicos:', error);
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

        fetchElectronicos();
        fetchAreas();
    }, []);

    const validateForm = (data) => {
        const errors = {};
        if (!data.estado) errors.estado = 'El estado es obligatorio';
        if (!data.ubicacion) errors.ubicacion = 'La ubicación es obligatoria';
        if (!data.color) errors.color = 'El color es obligatorio';
        if (!data.tamano) errors.tamano = 'El tamaño es obligatorio';
        if (!data.tipo) errors.tipo = 'El tipo es obligatorio';
        return errors;
    };

    const handleAddElectronico = async () => {
        const errors = validateForm(newElectronicoData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        try {
            const response = await axios.post('http://localhost:4000/electronicos', newElectronicoData);
            setElectronicos([...electronicos, response.data]);
            setShowAddModal(false);
            setNewElectronicoData({
                estado: '',
                ubicacion: 0,
                color: '',
                tamano: '',
                tipo: '',
            });
            setFormErrors({});
        } catch (error) {
            console.error('Error adding electronico:', error);
        }
    };

    const handleDeleteElectronico = async () => {
        try {
            await axios.delete(`http://localhost:4000/electronicos/${selectedElectronicoId}`);
            const newElectronicos = electronicos.filter(electronico => electronico.id !== selectedElectronicoId);
            setElectronicos(newElectronicos);
            setSelectedElectronicoId(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting electronico:', error);
        }
    };

    const handleEditElectronico = (id) => {
        const electronicoToEdit = electronicos.find(electronico => electronico.id === id);
        setFormData(electronicoToEdit);
        setSelectedElectronicoId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewElectronicoChange = (e) => {
        const { name, value } = e.target;
        setNewElectronicoData({ ...newElectronicoData, [name]: value });
    };

    const handleSaveEdit = async () => {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        try {
            const response = await axios.put(`http://localhost:4000/electronicos/${selectedElectronicoId}`, formData);
            const updatedElectronicos = electronicos.map(electronico => electronico.id === selectedElectronicoId ? response.data : electronico);
            setElectronicos(updatedElectronicos);
            setShowEditModal(false);
            setFormErrors({});
        } catch (error) {
            console.error('Error updating electronico:', error);
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

            pdf.save('Electronicos.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredElectronicos = electronicos.filter(electronico =>
        electronico.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        electronico.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Electronicos
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                        <CIcon icon={cilPlus} /> Añadir
                                    </CButton>
                                    <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedElectronicoId === null} className="me-2">
                                        <CIcon icon={cilTrash} /> Eliminar
                                    </CButton>
                                    <CButton color="info" onClick={() => handleEditElectronico(selectedElectronicoId)} disabled={selectedElectronicoId === null} className="me-2">
                                        <CIcon icon={cilPen} /> Editar
                                    </CButton>
                                    <CButton color="success" onClick={handleGeneratePDF}>
                                        <CIcon icon={cilPrint} /> Generar PDF
                                    </CButton>
                                </div>
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar por color o tipo"
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
                                        <CTableHeaderCell>Estado</CTableHeaderCell>
                                        <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                        <CTableHeaderCell>Color</CTableHeaderCell>
                                        <CTableHeaderCell>Tamaño</CTableHeaderCell>
                                        <CTableHeaderCell>Tipo</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredElectronicos.map((electronico, index) => (
                                        <CTableRow
                                            key={electronico.id}
                                            onClick={() => setSelectedElectronicoId(electronico.id)}
                                            className={electronico.id === selectedElectronicoId ? 'table-active' : ''}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{electronico.estado}</CTableDataCell>
                                            <CTableDataCell>{electronico.ubicacion}</CTableDataCell>
                                            <CTableDataCell>{electronico.color}</CTableDataCell>
                                            <CTableDataCell>{electronico.tamano}</CTableDataCell>
                                            <CTableDataCell>{electronico.tipo}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Modal Añadir */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader onClose={() => setShowAddModal(false)}>
                    Añadir Electrónico
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        type="text"
                        label="Estado"
                        name="estado"
                        value={newElectronicoData.estado}
                        onChange={handleNewElectronicoChange}
                        invalid={formErrors.estado ? true : false}
                    />
                    <CFormFeedback>{formErrors.estado}</CFormFeedback>
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={newElectronicoData.ubicacion}
                        onChange={handleNewElectronicoChange}
                        invalid={formErrors.ubicacion ? true : false}
                    >
                        <option value={0}>Selecciona una ubicación</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
                        ))}
                    </CFormSelect>
                    <CFormFeedback>{formErrors.ubicacion}</CFormFeedback>
                    <CFormInput
                        type="text"
                        label="Color"
                        name="color"
                        value={newElectronicoData.color}
                        onChange={handleNewElectronicoChange}
                        invalid={formErrors.color ? true : false}
                    />
                    <CFormFeedback>{formErrors.color}</CFormFeedback>
                    <CFormInput
                        type="text"
                        label="Tamaño"
                        name="tamano"
                        value={newElectronicoData.tamano}
                        onChange={handleNewElectronicoChange}
                        invalid={formErrors.tamano ? true : false}
                    />
                    <CFormFeedback>{formErrors.tamano}</CFormFeedback>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={newElectronicoData.tipo}
                        onChange={handleNewElectronicoChange}
                        invalid={formErrors.tipo ? true : false}
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="Cafeteras">Cafeteras</option>
                        <option value="Microondas">Microondas</option>
                        <option value="Refrigerador">Refrigerador</option>
                        <option value="Dispensador">Dispensador</option>
                        <option value="Microscopio">Microscopio</option>
                        <option value="Telescopio">Telescopio</option>
                    </CFormSelect>
                    <CFormFeedback>{formErrors.tipo}</CFormFeedback>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancelar</CButton>
                    <CButton color="primary" onClick={handleAddElectronico}>Añadir</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Editar */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader onClose={() => setShowEditModal(false)}>
                    Editar Electrónico
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        type="text"
                        label="Estado"
                        name="estado"
                        value={formData.estado || ''}
                        onChange={handleFormChange}
                        invalid={formErrors.estado ? true : false}
                    />
                    <CFormFeedback>{formErrors.estado}</CFormFeedback>
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={formData.ubicacion || 0}
                        onChange={handleFormChange}
                        invalid={formErrors.ubicacion ? true : false}
                    >
                        <option value={0}>Selecciona una ubicación</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
                        ))}
                    </CFormSelect>
                    <CFormFeedback>{formErrors.ubicacion}</CFormFeedback>
                    <CFormInput
                        type="text"
                        label="Color"
                        name="color"
                        value={formData.color || ''}
                        onChange={handleFormChange}
                        invalid={formErrors.color ? true : false}
                    />
                    <CFormFeedback>{formErrors.color}</CFormFeedback>
                    <CFormInput
                        type="text"
                        label="Tamaño"
                        name="tamano"
                        value={formData.tamano || ''}
                        onChange={handleFormChange}
                        invalid={formErrors.tamano ? true : false}
                    />
                    <CFormFeedback>{formErrors.tamano}</CFormFeedback>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo || ''}
                        onChange={handleFormChange}
                        invalid={formErrors.tipo ? true : false}
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="Cafeteras">Cafeteras</option>
                        <option value="Microondas">Microondas</option>
                        <option value="Refrigerador">Refrigerador</option>
                        <option value="Dispensador">Dispensador</option>
                        <option value="Microscopio">Microscopio</option>
                        <option value="Telescopio">Telescopio</option>
                    </CFormSelect>
                    <CFormFeedback>{formErrors.tipo}</CFormFeedback>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancelar</CButton>
                    <CButton color="primary" onClick={handleSaveEdit}>Guardar Cambios</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Eliminar */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader onClose={() => setShowDeleteModal(false)}>
                    Eliminar Electrónico
                </CModalHeader>
                <CModalBody>
                    ¿Estás seguro que deseas eliminar este electrónico?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</CButton>
                    <CButton color="danger" onClick={handleDeleteElectronico}>Eliminar</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Electronicos;
