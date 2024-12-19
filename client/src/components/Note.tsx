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
        border: '1px solid rgba(64, 224, 208, 0.2)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 2px 4px rgba(64, 224, 208, 0.1)',
      }}
    >
      <div>
        <p style={{ color: '#2F4F4F' }}>{content}</p>
        <small style={{ color: 'rgba(64, 224, 208, 0.8)' }}>{new Date(timestamp).toLocaleString()}</small>
      </div>
      <button
        onClick={() => onDelete(id)}
        style={{
          background: '#20B2AA',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          ':hover': {
            backgroundColor: '#008B8B',
          },
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default Note;
