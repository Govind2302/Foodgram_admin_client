import React, { useState, useEffect } from 'react';
import { Save, Edit2, Trash2 } from 'lucide-react';
import './DailyNotes.css';

function DailyNotes() {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savedTime, setSavedTime] = useState(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('adminDailyNotes');
    const savedTimestamp = localStorage.getItem('adminNotesTimestamp');
    if (savedNotes) {
      setNotes(savedNotes);
      setSavedTime(savedTimestamp);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('adminDailyNotes', notes);
    const timestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    localStorage.setItem('adminNotesTimestamp', timestamp);
    setSavedTime(timestamp);
    setIsEditing(false);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all notes?')) {
      setNotes('');
      localStorage.removeItem('adminDailyNotes');
      localStorage.removeItem('adminNotesTimestamp');
      setSavedTime(null);
    }
  };

  return (
    <div className="daily-notes-card">
      <div className="notes-header">
        <h5 className="notes-title">📝 Daily Notes</h5>
        <div className="notes-actions">
          {!isEditing ? (
            <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} className="me-1" />
              Edit
            </button>
          ) : (
            <>
              <button className="btn btn-sm btn-success me-2" onClick={handleSave}>
                <Save size={16} className="me-1" />
                Save
              </button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          )}
          {notes && (
            <button className="btn btn-sm btn-outline-danger ms-2" onClick={handleClear}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <textarea
        className="notes-textarea form-control"
        placeholder="Write your tasks and notes for today...
- Task 1
- Task 2
- Important reminders"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={!isEditing}
        rows={10}
      />

      {savedTime && (
        <div className="notes-footer">
          <small className="text-muted">Last saved: {savedTime}</small>
        </div>
      )}
    </div>
  );
}

export default DailyNotes;