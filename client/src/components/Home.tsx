import { useState, useEffect } from 'react';

interface Note {
  id: number;
  content: string;
  timestamp: string;
}

const Note = ({ note, onDelete }: { note: Note; onDelete: (id: number) => void }) => (
  <div key={note.id} className="card">
    <div style={{ flex: '1', marginRight: '1rem' }}>
      <p>{note.content}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className="info">{new Date(note.timestamp).toLocaleString()}</p>
        <a onClick={() => onDelete(note.id)} className="info" style={{ cursor: 'pointer' }}>
          Delete
        </a>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNote }),
      });

      if (response.ok) {
        setNewNote('');
        fetchNotes();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="page" style={{ alignItems: 'center' }}>
      <div style={{ maxWidth: '400px' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: '100%',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '1rem',
            borderRadius: '0.75rem',
            boxShadow: '0 2px 8px rgba(255, 105, 180, 0.1)',
          }}
        >
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="What's on your mind?"
            style={{
              fontSize: '1rem',
              lineHeight: '1.5',
              fontFamily: 'inherit',
              color: '#1a1a1a',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              overflow: 'auto',
              minHeight: '100px',
              width: '100%',
              '::placeholder': {
                color: 'rgba(255, 105, 180, 0.6)',
              },
            }}
          />
          <button
            type="submit"
            style={{
              width: '90px',
              backgroundColor: '#FF69B4',
              borderRadius: '0.75rem',
              border: 'none',
              outline: 'none',
              padding: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: 'white',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#FF1493',
              },
            }}
          >
            Send
          </button>
        </form>

        <div style={{ width: '100%' }}>
          {notes.map(note => (
            <Note key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
