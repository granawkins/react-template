interface NoteProps {
  id: number;
  content: string;
  timestamp: string;
  onDelete: (id: number) => void;
}

const Note = ({ id, content, timestamp, onDelete }: NoteProps) => {
  return (
    <div
      style={{
        padding: '1rem',
        marginBottom: '1rem',
        border: '1px solid rgba(255, 105, 180, 0.2)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 2px 4px rgba(255, 105, 180, 0.1)',
      }}
    >
      <div>
        <p style={{ color: '#2C3E50' }}>{content}</p>
        <small style={{ color: 'rgba(255, 105, 180, 0.7)' }}>{new Date(timestamp).toLocaleString()}</small>
      </div>
      <button
        onClick={() => onDelete(id)}
        style={{
          background: '#FF69B4',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          ':hover': {
            backgroundColor: '#FF1493',
          },
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default Note;
