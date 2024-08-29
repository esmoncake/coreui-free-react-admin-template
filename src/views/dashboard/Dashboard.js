import React from 'react';
import { CCardGroup } from '@coreui/react';
import Cards from '../base/cards/Cards';

// Importa las imágenes
import image1 from '../../assets/images/areas.png';
import image2 from '../../assets/images/provedores.jpg';
import image3 from '../../assets/images/elementos.png';

const Dashboard = () => {

  const cards = [
    { c_tittle: "Areas", c_text: "Agrega nuevas areas", c_image: image1, c_url: '/views/areas' },
    { c_tittle: "Proveedores", c_text: "Agrega nuevos proveedores", c_image: image2, c_url: '/views/provedores' },
    { c_tittle: "Elementos", c_text: "Agrega nuevos elementos", c_image: image3, c_url: '/views/personal' },
  ];

  return (
    <>
      <CCardGroup className='d-flex align-items-center'>
        {cards.map((card, index) => (
          <Cards key={index} c_tittle={card.c_tittle} c_text={card.c_text} c_image={card.c_image} c_url={card.c_url} />
        ))}
      </CCardGroup>
    </>
  );
};

export default Dashboard;
