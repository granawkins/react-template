import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 105, 180, 0.9)', // Hot Pink background
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(255, 105, 180, 0.3)',
      }}
    >
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        <Link to="/" style={{ color: 'white' }}>Bulletin Board</Link>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '2rem',
        }}
      >
        <Link to="/contact" style={{ color: 'white', ':hover': { color: '#FFE4E1' } }}>Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
