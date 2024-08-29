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
    CAlert,
    CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons';

const Accesorios = () => {
    const [rows, setRows] = useState([]);
    const [Computadoras, setComputadoras] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newAccesorioData, setNewAccesorioData] = useState({
        tipo: '',
        marca: '',
        descripcion: '',
        computadora: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAccesorios = async () => {
            try {
                const response = await axios.get('http://localhost:4000/accesorios');
                setRows(response.data);
            } catch (error) {
                console.error('Error fetching accesorios:', error);
            }
        };

        const fetchComputadoras = async () => {
            try {
                const response = await axios.get('http://localhost:4000/computo');
                setComputadoras(response.data);
            } catch (error) {
                console.error('Error fetching accesorios:', error);
            }
        };

        fetchComputadoras();
        fetchAccesorios();
    }, []);

    const addAlert = (message) => {
        setAlerts([...alerts, { message }]);
        setTimeout(() => {
            setAlerts((prevAlerts) => prevAlerts.slice(1));
        }, 5000); // Elimina el alert después de 5 segundos
    };

    const handleAddRow = async () => {
        if (!newAccesorioData.tipo.trim() || !newAccesorioData.marca.trim()) {
            addAlert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/accesorios', newAccesorioData);
            setRows([...rows, response.data]);
            setShowAddModal(false);
            setNewAccesorioData({
                tipo: '',
                marca: '',
                descripcion: '',
                computadora: ''
            });
        } catch (error) {
            console.error('Error adding accesorio:', error);
        }
    };

    const handleDeleteRow = async () => {
        try {
            await axios.delete(`http://localhost:4000/accesorios/${selectedRowId}`);
            const newRows = rows.filter(row => row.id !== selectedRowId);
            setRows(newRows);
            setSelectedRowId(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting accesorio:', error);
        }
    };

    const handleEditRow = (id) => {
        const rowToEdit = rows.find(row => row.id === id);
        setFormData(rowToEdit);
        setSelectedRowId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewAccesorioChange = (e) => {
        const { name, value } = e.target;
        setNewAccesorioData({ ...newAccesorioData, [name]: value });
    };

    const handleSaveEdit = async () => {
        if (!formData.tipo.trim() || !formData.marca.trim()) {
            addAlert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/accesorios/${selectedRowId}`, formData);
            const updatedRows = rows.map(row => row.id === selectedRowId ? response.data : row);
            setRows(updatedRows);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating accesorio:', error);
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

            pdf.save('accesorios.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRows = rows.filter(row =>
        row.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Accesorios
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
                                    placeholder="Buscar por Tipo, Marca o Descripción"
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
                                        <CTableHeaderCell className="bg-body-tertiary">#</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Tipo</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Marca</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Descripción</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Computadora</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredRows.map((row, index) => (
                                        <CTableRow
                                            key={row.id}
                                            onClick={() => setSelectedRowId(row.id)}
                                            className={row.id === selectedRowId ? 'table-active' : ''}
                                            data-id={row.id}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{row.tipo}</CTableDataCell>
                                            <CTableDataCell>{row.marca}</CTableDataCell>
                                            <CTableDataCell>{row.descripcion}</CTableDataCell>
                                            <CTableDataCell>{row.computadora}</CTableDataCell>
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
                    <h5>Añadir Accesorio</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={newAccesorioData.tipo}
                        onChange={handleNewAccesorioChange}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Raton">Raton</option>
                        <option value="Teclado">Teclado</option>
                        <option value="Cargador">Cargador</option>
                    </CFormSelect>

                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={newAccesorioData.marca}
                        onChange={handleNewAccesorioChange}
                    />
                    <CFormInput
                        label="Descripción"
                        name="descripcion"
                        value={newAccesorioData.descripcion}
                        onChange={handleNewAccesorioChange}
                    />
                    <CFormSelect
                        label="Computadora"
                        name="computadora"
                        value={newAccesorioData.computadora}
                        onChange={handleNewAccesorioChange}
                    >
                        <option value="">Selecciona una computadora</option>
                        {Computadoras.map(computadora => (
                            <option key={computadora.id} value={computadora.id}>
                                {computadora.noSerie}
                            </option>
                        ))}
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
                    <h5>Editar Accesorio</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Raton">Raton</option>
                        <option value="Teclado">Teclado</option>
                        <option value="Cargador">Cargador</option>
                    </CFormSelect>
                    <CFormInput
                        label="Marca"
                        name="marca"
                        value={formData.marca || ''}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="Descripción"
                        name="descripcion"
                        value={formData.descripcion || ''}
                        onChange={handleFormChange}
                    />
                    <CFormSelect
                        label="Computadora"
                        name="computadora"
                        value={formData.computadora || ''}
                        onChange={handleFormChange}
                    >
                        <option value="">Selecciona una computadora</option>
                        {Computadoras.map(computadora => (
                            <option key={computadora.id} value={computadora.id}>
                                {computadora.noSerie}
                            </option>
                        ))}
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleSaveEdit}>
                        Guardar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para eliminar */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <h5>Confirmar eliminación</h5>
                </CModalHeader>
                <CModalBody>
                    ¿Estás seguro de que quieres eliminar este accesorio?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteRow}>
                        Eliminar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Alertas */}
            <div className="position-fixed bottom-0 start-0 p-3" style={{ zIndex: 1550 }}>
                {alerts.map((alert, index) => (
                    <CAlert key={index} color="danger" className="mb-2" style={{ zIndex: 1560 }}>
                        {alert.message}
                    </CAlert>
                ))}
            </div>
        </>
    );
};

export default Accesorios;
