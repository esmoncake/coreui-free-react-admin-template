import React, { useState } from 'react'
import {
  CAvatar,
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPhone, cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const CelularesTable = () => {
  const [rows, setRows] = useState([
    { id: 1, marca: 'Samsung', modelo: 'Galaxy S21', noImei: '123456789012345', ubicacion: 'Office', estado: 'Nuevo', noTelefono: '555-1234', descripcion: 'Smartphone', personal: 'John Doe', proveedor: 'Proveedor XYZ' }
  ])
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({})

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      marca: 'Nueva Marca',
      modelo: 'Nuevo Modelo',
      noImei: '000000000000000',
      ubicacion: 'Nueva Ubicación',
      estado: 'Nuevo',
      noTelefono: '000-0000',
      descripcion: 'Nueva Descripción',
      personal: 'Nuevo Personal',
      proveedor: 'Nuevo Proveedor'
    }
    setRows([...rows, newRow])
  }

  const handleDeleteRow = (id) => {
    const newRows = rows.filter(row => row.id !== id)
    // Recalcular los IDs
    const updatedRows = newRows.map((row, index) => ({ ...row, id: index + 1 }))
    setRows(updatedRows)
    setSelectedRowId(null)
  }

  const handleEditRow = (id) => {
    const rowToEdit = rows.find(row => row.id === id)
    setFormData(rowToEdit)
    setSelectedRowId(id)
    setShowEditModal(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSaveEdit = () => {
    const updatedRows = rows.map(row => row.id === selectedRowId ? { ...formData, id: selectedRowId } : row)
    setRows(updatedRows)
    setShowEditModal(false)
  }

  const handleGeneratePDF = () => {
    const input = document.getElementById('table-to-pdf')
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = canvas.height * imgWidth / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save('table.pdf')
    });
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              Celulares Table
              <div className="d-flex justify-content-end">
                <CButton color="primary" onClick={handleAddRow} className="me-2">
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
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPhone} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">ID</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Marca</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Modelo</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">No. IMEI</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Ubicación</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Estado</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">No. Teléfono</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Descripción</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiario">Personal</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Proveedor</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {rows.map(row => (
                    <CTableRow
                      key={row.id}
                      onClick={() => setSelectedRowId(row.id)}
                      className={row.id === selectedRowId ? 'table-active' : ''}
                    >
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" />
                      </CTableDataCell>
                      <CTableDataCell>{row.id}</CTableDataCell>
                      <CTableDataCell>{row.marca}</CTableDataCell>
                      <CTableDataCell>{row.modelo}</CTableDataCell>
                      <CTableDataCell>{row.noImei}</CTableDataCell>
                      <CTableDataCell>{row.ubicacion}</CTableDataCell>
                      <CTableDataCell>{row.estado}</CTableDataCell>
                      <CTableDataCell>{row.noTelefono}</CTableDataCell>
                      <CTableDataCell>{row.descripcion}</CTableDataCell>
                      <CTableDataCell>{row.personal}</CTableDataCell>
                      <CTableDataCell>{row.proveedor}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal para editar */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <h5>Editar Celda</h5>
        </CModalHeader>
        <CModalBody>
          {formData && (
            <>
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
                label="No. IMEI"
                name="noImei"
                value={formData.noImei}
                onChange={handleFormChange}
              />
              <CFormInput
                label="Ubicación"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleFormChange}
              />
              <CFormInput
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleFormChange}
              />
              <CFormInput
                label="No. Teléfono"
                name="noTelefono"
                value={formData.noTelefono}
                onChange={handleFormChange}
              />
              <CFormInput
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleFormChange}
              />
              <CFormInput
                label="Personal"
                name="personal"
                value={formData.personal}
                onChange={handleFormChange}
              />
              <CFormInput
                label="Proveedor"
                name="proveedor"
                value={formData.proveedor}
                onChange={handleFormChange}
              />
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
  )
}

export default CelularesTable
