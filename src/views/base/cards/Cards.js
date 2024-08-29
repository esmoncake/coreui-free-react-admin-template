import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react'

const Cards = ({c_tittle, c_text, c_image, c_url}) => {
  return (
    <CRow>
      <CCol xs={1}>
        <CCard className="m-4" style={{ width: '16rem'}}>
        <CCardImage orientation="top" src={c_image} />
        <CCardBody>
          <CCardTitle>
            {c_tittle}
          </CCardTitle>
          <CCardText>
            {c_text}
          </CCardText>
          <Link to={c_url}>
              <CButton color="primary">
                Ir
              </CButton>
          </Link>
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
  )
}

export default Cards
