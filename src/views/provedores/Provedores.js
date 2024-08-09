import React, { useState } from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash, cilPen, cilPrint } from '@coreui/icons'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const ProveedoresTable = () => {
  const [rows, setRows] = useState([
    { id: 1, nombre: 'Proveedor A', contacto: 'Juan Pérez', correo: 'juan@example.com' },
  ])
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showInsertModal, setShowInsertModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({})
  const [newRowData, setNewRowData] = useState({
    nombre: '',
    contacto: '',
    correo: ''
  })

  const handleAddRow = () => {
    setNewRowData({
      nombre: '',
      contacto: '',
      correo: ''
    })
    setShowInsertModal(true)
  }

  const handleDeleteRow = () => {
    const newRows = rows.filter(row => row.id !== selectedRowId)
    const updatedRows = newRows.map((row, index) => ({ ...row, id: index + 1 }))
    setRows(updatedRows)
    setSelectedRowId(null)
    setShowDeleteModal(false)
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

  const handleNewRowChange = (e) => {
    const { name, value } = e.target
    setNewRowData({ ...newRowData, [name]: value })
  }

  const handleSaveEdit = () => {
    const updatedRows = rows.map(row => row.id === selectedRowId ? { ...formData, id: selectedRowId } : row)
    setRows(updatedRows)
    setShowEditModal(false)
  }

  const handleInsertRow = () => {
    const newRow = {
      id: rows.length + 1,
      ...newRowData
    }
    setRows([...rows, newRow])
    setShowInsertModal(false)
    setNewRowData({
      nombre: '',
      contacto: '',
      correo: ''
    })
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

      pdf.save('proveedores.pdf')
    })
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              Proveedores Table
              <div className="d-flex justify-content-end">
                <CButton color="primary" onClick={handleAddRow} className="me-2">
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
            </CCardHeader>
            <CCardBody>
              <CTable id="table-to-pdf" align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      #
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Nombre</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Contacto</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Correo</CTableHeaderCell>
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
                        {row.id}
                      </CTableDataCell>
                      <CTableDataCell>{row.nombre}</CTableDataCell>
                      <CTableDataCell>{row.contacto}</CTableDataCell>
                      <CTableDataCell>{row.correo}</CTableDataCell>
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
          <h5>Editar Proveedor</h5>
        </CModalHeader>
        <CModalBody>
          {formData && (
            <>
              <CFormInput
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleFormChange}
                className="mb-2"
              />
              <CFormInput
                label="Contacto"
                name="contacto"
                value={formData.contacto}
                onChange={handleFormChange}
                className="mb-2"
              />
              <CFormInput
                label="Correo"
                name="correo"
                value={formData.correo}
                onChange={handleFormChange}
                className="mb-2"
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

      {/* Modal para añadir */}
      <CModal visible={showInsertModal} onClose={() => setShowInsertModal(false)}>
        <CModalHeader>
          <h5>Añadir Proveedor</h5>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Nombre"
            name="nombre"
            value={newRowData.nombre}
            onChange={handleNewRowChange}
            className="mb-2"
          />
          <CFormInput
            label="Contacto"
            name="contacto"
            value={newRowData.contacto}
            onChange={handleNewRowChange}
            className="mb-2"
          />
          <CFormInput
            label="Correo"
            name="correo"
            value={newRowData.correo}
            onChange={handleNewRowChange}
            className="mb-2"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowInsertModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleInsertRow}>
            Añadir
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para eliminar */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <h5>Confirmar Eliminación</h5>
        </CModalHeader>
        <CModalBody>
          <p>¿Estás seguro de que deseas eliminar este proveedor?</p>
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
    </>
  )
}

export default ProveedoresTable
