import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(30, 144, 255, 0.9)', // Blue background
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(30, 144, 255, 0.3)',
      }}
    >
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        <Link to="/" style={{ color: '#FF8C00' }}>Bulletin Board</Link>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '2rem',
        }}
      >
        <Link to="/contact" style={{ color: '#FF8C00', ':hover': { color: '#FFA500' } }}>Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
