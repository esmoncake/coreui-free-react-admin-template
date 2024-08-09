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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPhone, cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons';


const Automoviles = () => {

    return (

        <>
            <row>
                <CCardHeader>
                    Tabla Llantas
                    <div className="d-flex justify-content-end">
                        <CButton color="primary"  className="me-2">
                            <CIcon icon={cilPlus} /> Añadir
                        </CButton>
                        <CButton color="danger"  className="me-2">
                            <CIcon icon={cilTrash} /> Eliminar
                        </CButton>
                        <CButton color="info"className="me-2">
                            <CIcon icon={cilPen} /> Editar
                        </CButton>
                        <CButton color="success" >
                            <CIcon icon={cilPrint} /> Generar PDF
                        </CButton>
                    </div>
                </CCardHeader>
                <CTable hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Marca</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Medida</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow>
                            <CTableHeaderCell scope="row">1</CTableHeaderCell>
                            <CTableDataCell>Michelin</CTableDataCell>
                            <CTableDataCell>Grandota</CTableDataCell>
                            <CTableDataCell>Bien puteada</CTableDataCell>
                        </CTableRow>                        
                    </CTableBody>
                </CTable>
            </row>
        </>

    );

}

export default Automoviles;