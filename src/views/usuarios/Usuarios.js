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

const Usuarios = () => {
    const [rows, setRows] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newUserData, setNewUserData] = useState({ usuario: '', password: '', tipo: '' });

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:4000/usuarios');
                setRows(response.data);
            } catch (error) {
                console.error('Error fetching usuarios:', error);
            }
        };

        fetchUsuarios();
    }, []);

    const handleAddRow = async () => {
        try {
            const response = await axios.post('http://localhost:4000/usuarios', newUserData);
            setRows([...rows, response.data]);
            setShowAddModal(false);
            setNewUserData({ usuario: '', password: '', tipo: '' });
        } catch (error) {
            console.error('Error adding usuario:', error);
        }
    };

    const handleDeleteRow = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/usuarios/${id}`);
            const newRows = rows.filter(row => row.idUsuario !== id);
            setRows(newRows);
            setSelectedRowId(null);
        } catch (error) {
            console.error('Error deleting usuario:', error);
        }
    };

    const handleEditRow = (id) => {
        const rowToEdit = rows.find(row => row.idUsuario === id);
        setFormData(rowToEdit);
        setSelectedRowId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUserData({ ...newUserData, [name]: value });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/usuarios/${selectedRowId}`, formData);
            const updatedRows = rows.map(row => row.idUsuario === selectedRowId ? response.data : row);
            setRows(updatedRows);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating usuario:', error);
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

            pdf.save('table.pdf');
        });
    };

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Usuarios
                            <div className="d-flex justify-content-end">
                                <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                    <CIcon icon={cilPlus} /> Añadir
                                </CButton>
                                <CButton color="danger" onClick={() => handleDeleteRow(selectedRowId)} disabled={selectedRowId === null} className="me-2">
                                    <CIcon icon={cilTrash} /> Eliminar
                                </CButton>
                                <CButton color="info" onClick={() => handleEditRow(selectedRowId)} disabled={selectedRowId === null} className="me-2">
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
                                        <CTableHeaderCell className="bg-body-tertiary">Usuario</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Tipo</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {rows.map(row => (
                                        <CTableRow
                                            key={row.idUsuario}
                                            onClick={() => setSelectedRowId(row.idUsuario)}
                                            className={row.idUsuario === selectedRowId ? 'table-active' : ''}
                                        >
                                            <CTableDataCell>{row.usuario}</CTableDataCell>
                                            <CTableDataCell>{row.tipo}</CTableDataCell>
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
                    <h5>Añadir Usuario</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Nombre de Usuario"
                        name="usuario"
                        value={newUserData.usuario}
                        onChange={handleNewUserChange}
                    />
                    <CFormInput
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={newUserData.password}
                        onChange={handleNewUserChange}
                    />
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={newUserData.tipo}
                        onChange={handleNewUserChange}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Editor">Editor</option>
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleAddRow}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para editar */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Usuario</h5>
                </CModalHeader>
                <CModalBody>
                    {formData && (
                        <>
                            <CFormInput
                                label="Nombre de Usuario"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleFormChange}
                            />
                            <CFormInput
                                label="Contraseña"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleFormChange}
                            />
                            <CFormSelect
                                label="Tipo"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleFormChange}
                            >
                                <option value="Administrador">Administrador</option>
                                <option value="Editor">Editor</option>
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
}

export default Usuarios;
