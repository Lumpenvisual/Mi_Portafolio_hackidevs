// Solo el ID del video (la parte después de "v=" en la URL de YouTube)
export const videos = [
  {
    id: 'ULrllSX12UQ',
    titulo: 'COMER — Rigoberto, agricultor de San Sebastián de Palmitas',
    descripcion: 'Documental sobre soberanía alimentaria y vida campesina.',
  },
  {
    id: '_-7ZI3wq4Q0',
    titulo: 'Café Luthier',
    descripcion: 'Retrato de un lugar donde la música y el café se encuentran.',
  },
  {
    id: 'LwCcRuVgFV4',
    titulo: 'Archivos en Peligro',
    descripcion: 'Divulgación científica sobre patrimonio documental en riesgo.',
  },
  {
    id: 'iI-uxTikYIY',
    titulo: 'Zenzual',
    descripcion: 'Pieza audiovisual de exploración sensorial y movimiento.',
  },
  {
    id: 'ig_583LphJU',
    titulo: 'Campaña social',
    descripcion: 'Comunicación de impacto para una causa de interés público.',
  },
  {
    id: 'hmnJYny92L8',
    titulo: 'Mandrágora',
    descripcion: 'Cortometraje de atmósfera y narrativa visual experimental.',
  },
];

// Genera la URL del thumbnail a partir del ID de YouTube
export function thumbnail(id) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

// Genera el enlace al video
export function urlVideo(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}
