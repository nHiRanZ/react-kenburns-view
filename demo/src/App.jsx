import { useState, useEffect } from 'react';
import KenBurnsView from 'react-kenburns-view';

const IMAGES = [
  { src: 'https://i.ibb.co/pjVgZTnf/image1.jpg', alt: 'Landscape 1' },
  { src: 'https://i.ibb.co/39n0tghZ/image2.jpg', alt: 'Landscape 2' },
  { src: 'https://i.ibb.co/YBcr2vHf/image3.jpg', alt: 'Landscape 3' },
];

const CARD_HEIGHT = 280;
const MAX_WIDTH = 800;

export default function App() {
  const [width, setWidth] = useState(MAX_WIDTH);

  useEffect(() => {
    const update = () => setWidth(Math.min(MAX_WIDTH, window.innerWidth - 32));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Ken Burns Effect</h1>
      <p style={styles.subtitle}>Zoom + pan</p>
      <div style={styles.grid}>
        {IMAGES.map((img, index) => (
          <div key={index} style={styles.card}>
            <KenBurnsView
              width={width}
              height={CARD_HEIGHT}
              src={img.src}
              alt={img.alt}
              duration={15000}
              zoomStart={1}
              zoomEnd={1.2}
              panX={0.08}
              panY={0.08}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    padding: '48px 16px 64px',
    color: '#fff',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '4px',
  },
  subtitle: {
    margin: '0 0 32px',
    fontSize: '1rem',
    color: '#888',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    maxWidth: 800,
    margin: '0 auto',
  },
  card: {
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
};
