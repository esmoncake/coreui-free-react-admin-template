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

const Libros = () => {
    const [Libros, setLibros] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [newBookData, setNewBookData] = useState({
        nombre: '',
        editorial: '',
        ubicacion: 0,
        isbn: '',
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLibros = async () => {
            try {
                const response = await axios.get('http://localhost:4000/Libros');
                setLibros(response.data);
            } catch (error) {
                console.error('Error fetching Libros:', error);
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

        fetchLibros();
        fetchAreas();
    }, []);

    const handleAddBook = async () => {
        try {
            const response = await axios.post('http://localhost:4000/Libros', newBookData);
            setLibros([...Libros, response.data]);
            setShowAddModal(false);
            setNewBookData({
                nombre: '',
                editorial: '',
                ubicacion: 0,
                isbn: '',
            });
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleDeleteBook = async () => {
        try {
            await axios.delete(`http://localhost:4000/Libros/${selectedBookId}`);
            const newLibros = Libros.filter(book => book.id !== selectedBookId);
            setLibros(newLibros);
            setSelectedBookId(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleEditBook = (id) => {
        const bookToEdit = Libros.find(book => book.id === id);
        setFormData(bookToEdit);
        setSelectedBookId(id);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewBookChange = (e) => {
        const { name, value } = e.target;
        setNewBookData({ ...newBookData, [name]: value });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/Libros/${selectedBookId}`, formData);
            const updatedLibros = Libros.map(book => book.id === selectedBookId ? response.data : book);
            setLibros(updatedLibros);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating book:', error);
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

            pdf.save('Libros.pdf');
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBooks = Libros.filter(book =>
        book.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            Tabla Libros
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <CButton color="primary" onClick={() => setShowAddModal(true)} className="me-2">
                                        <CIcon icon={cilPlus} /> Añadir
                                    </CButton>
                                    <CButton color="danger" onClick={() => setShowDeleteModal(true)} disabled={selectedBookId === null} className="me-2">
                                        <CIcon icon={cilTrash} /> Eliminar
                                    </CButton>
                                    <CButton color="info" onClick={() => handleEditBook(selectedBookId)} disabled={selectedBookId === null} className="me-2">
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
                                        <CTableHeaderCell>Nombre</CTableHeaderCell>
                                        <CTableHeaderCell>Editorial</CTableHeaderCell>
                                        <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                        <CTableHeaderCell>ISBN</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredBooks.map((book, index) => (
                                        <CTableRow
                                            key={book.id}
                                            onClick={() => setSelectedBookId(book.id)}
                                            className={book.id === selectedBookId ? 'table-active' : ''}
                                        >
                                            <CTableDataCell>{index + 1}</CTableDataCell> {/* Actualiza el número de fila */}
                                            <CTableDataCell>{book.nombre}</CTableDataCell>
                                            <CTableDataCell>{book.editorial}</CTableDataCell>
                                            <CTableDataCell>{book.ubicacion}</CTableDataCell>
                                            <CTableDataCell>{book.isbn}</CTableDataCell>
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
                    <h5>Añadir Libro</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Nombre"
                        name="nombre"
                        value={newBookData.nombre}
                        onChange={handleNewBookChange}
                    />
                    <CFormInput
                        label="Editorial"
                        name="editorial"
                        value={newBookData.editorial}
                        onChange={handleNewBookChange}
                    />
                    <CFormSelect
                        label="Ubicación"
                        name="ubicacion"
                        value={newBookData.ubicacion}
                        onChange={handleNewBookChange}
                    >
                        <option value="">Seleccionar ubicación</option>
                        {areas.map(area => (
                            <option key={area.idAreas} value={area.idAreas}>{area.area}</option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        label="ISBN"
                        name="isbn"
                        value={newBookData.isbn}
                        onChange={handleNewBookChange}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleAddBook}>
                        Añadir Libro
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para editar */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <h5>Editar Libro</h5>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleFormChange}
                    />
                    <CFormInput
                        label="Editorial"
                        name="editorial"
                        value={formData.editorial}
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
                    <CFormInput
                        label="ISBN"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleFormChange}
                    />
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

            {/* Modal para eliminar */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <h5>Eliminar Libro</h5>
                </CModalHeader>
                <CModalBody>
                    ¿Estás seguro de que deseas eliminar este libro?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteBook}>
                        Eliminar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Libros;
