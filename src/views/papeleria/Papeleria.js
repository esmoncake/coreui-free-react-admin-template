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

const Papeleria = () => {
    const [papeleria, setPapeleria] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newItemData, setNewItemData] = useState({
        marca: '',
        color: '',
        proveedor: 0,
        tipo: 'Lapiz',
        cantidad: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPapeleria = async () => {
            try {
                const response = await axios.get('http://localhost:4000/Papeleria');
                setPapeleria(response.data);
            } catch (error) {
                console.error('Error fetching Papeleria:', error);
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

        fetchPapeleria();
        fetchProveedores();
    }, []);

    const handleAddItem = async () => {
        try {
            const response = await axios.post('http://localhost:4000/Papeleria', newItemData);
            setPapeleria([...papeleria, response.data]);
            setShowAddModal(false);
            setNewItemData({
                marca: '',
                color: '',
                proveedor: 0,
                tipo: 'Lapiz',
                cantidad: 0,
            });
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDeleteItem = async () => {
        try {
            await axios.delete(`http://localhost:4000/Papeleria/${selectedItemId}`);
            const newPapeleria = papeleria.filter(item => item.id !== selectedItemId);
            setPapeleria(newPapeleria);
            setSelectedItemId(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEditItem = (id) => {
        const itemToEdit = papeleria.find(item => item.id === id);
        setFormData(itemToEdit);
        setSelectedItemId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItemData({ ...newItemData, [name]: value });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/Papeleria/${selectedItemId}`, formData);
            const updatedPapeleria = papeleria.map(item => item.id === selectedItemId ? response.data : item);
            setPapeleria(updatedPapeleria);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating item:', error);
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

            pdf.save('Papeleria.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredItems = papeleria.filter(item =>
        item.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Papelería
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                        <CIcon icon={cilPlus} /> Añadir
                                    </CButton>
                                    <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedItemId === null} className="me-2">
                                        <CIcon icon={cilTrash} /> Eliminar
                                    </CButton>
                                    <CButton color="info" onClick={() => handleEditItem(selectedItemId)} disabled={selectedItemId === null} className="me-2">
                                        <CIcon icon={cilPen} /> Editar
                                    </CButton>
                                    <CButton color="success" onClick={handleGeneratePDF}>
                                        <CIcon icon={cilPrint} /> Generar PDF
                                    </CButton>
                                </div>
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar por marca"
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
                                        <CTableHeaderCell>Color</CTableHeaderCell>
                                        <CTableHeaderCell>Proveedor</CTableHeaderCell>
                                        <CTableHeaderCell>Tipo</CTableHeaderCell>
                                        <CTableHeaderCell>Cantidad</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredItems.map((item, index) => (
                                        <CTableRow
                                            key={item.id}
                                            onClick={() => setSelectedItemId(item.id)}
                                            className={item.id === selectedItemId ? 'table-active' : ''}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{item.marca}</CTableDataCell>
                                            <CTableDataCell>{item.color}</CTableDataCell>
                                            <CTableDataCell>{item.proveedor}</CTableDataCell>
                                            <CTableDataCell>{item.tipo}</CTableDataCell>
                                            <CTableDataCell>{item.cantidad}</CTableDataCell>
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
                    <h5>Añadir Papelería</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={newItemData.marca}
                        onChange={handleNewItemChange}
                    />
                    <CFormInput
                        label="Color"
                        name="color"
                        value={newItemData.color}
                        onChange={handleNewItemChange}
                    />
                    <CFormSelect
                        label="Proveedor"
                        name="proveedor"
                        value={newItemData.proveedor}
                        onChange={handleNewItemChange}
                    >
                        <option value="">Seleccionar proveedor</option>
                        {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={newItemData.tipo}
                        onChange={handleNewItemChange}
                    >
                        <option value="">Seleccionar tipo</option>
                        <option value="Lapiz">Lapiz</option>
                        <option value="Goma">Goma</option>
                        <option value="Sacapunta">Sacapunta</option>
                        <option value="Enmicadora">Enmicadora</option>
                        <option value="Guillotina">Guillotina</option>
                        <option value="Tijera">Tijera</option>
                        <option value="Perforadora">Perforadora</option>
                        <option value="Engrapadora">Engrapadora</option>
                        <option value="Lapicero">Lapicero</option>
                        <option value="Hojas">Hojas</option>
                        <option value="Folders">Folders</option>
                        <option value="Formato de Accesos">Formato de Accesos</option>
                    </CFormSelect>
                    <CFormInput
                        label="Cantidad"
                        name="cantidad"
                        type="number"
                        value={newItemData.cantidad}
                        onChange={handleNewItemChange}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="primary" onClick={handleAddItem}>
                        Añadir
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para editar */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Papelería</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="Color"
                        name="color"
                        value={formData.color}
                        onChange={handleFormChange}
                    />
                    <CFormSelect
                        label="Proveedor"
                        name="proveedor"
                        value={formData.proveedor}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar proveedor</option>
                        {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar tipo</option>
                        <option value="Lapiz">Lapiz</option>
                        <option value="Goma">Goma</option>
                        <option value="Sacapunta">Sacapunta</option>
                        <option value="Enmicadora">Enmicadora</option>
                        <option value="Guillotina">Guillotina</option>
                        <option value="Tijera">Tijera</option>
                        <option value="Perforadora">Perforadora</option>
                        <option value="Engrapadora">Engrapadora</option>
                        <option value="Lapicero">Lapicero</option>
                        <option value="Hojas">Hojas</option>
                        <option value="Folders">Folders</option>
                        <option value="Formato de Accesos">Formato de Accesos</option>
                    </CFormSelect>
                    <CFormInput
                        label="Cantidad"
                        name="cantidad"
                        type="number"
                        value={formData.cantidad}
                        onChange={handleFormChange}
                    />
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
                    <h5>Eliminar Papelería</h5>
                </CModalHeader>
                <CModalBody>
                    <p>¿Estás seguro de que deseas eliminar este ítem?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteItem}>
                        Eliminar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Papeleria;
