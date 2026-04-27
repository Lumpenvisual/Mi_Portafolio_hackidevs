// Solo el ID del video (la parte después de "v=" en la URL de YouTube)
export const videos = [
  {
    id: 'ig_583LphJU',
    titulo: 'Campaña Abuso Infantil',
    descripcion: '',
  },
  {
    id: 'TUKiRpMxpCI',
    titulo: 'Animación Intro',
    descripcion: '',
  },
  {
    id: 'hmnJYny92L8',
    titulo: 'Buda Mecanógrafo y Trompetista',
    descripcion: '',
  },
  {
    id: 'rZus_fWpZf8',
    titulo: 'Reel',
    descripcion: '',
  },
  {
    id: 'LwCcRuVgFV4',
    titulo: 'Programa de Archivos en Peligro — Divulgación científica',
    descripcion: '',
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
