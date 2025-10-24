import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { X, Plus } from "lucide-react";

interface Sentence {
  id: number;
  english: string;
  turkish: string;
}

interface SentenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sentences: Sentence[]) => void;
  existingSentences?: Sentence[];
}

export function SentenceModal({ isOpen, onClose, onSave, existingSentences = [] }: SentenceModalProps) {
  const [sentences, setSentences] = useState<Sentence[]>(existingSentences);
  const [newEnglish, setNewEnglish] = useState("");
  const [newTurkish, setNewTurkish] = useState("");

  const handleAddSentence = () => {
    if (newEnglish.trim()) {
      const newSentence: Sentence = {
        id: Date.now(), // Simple ID generation
        english: newEnglish.trim(),
        turkish: newTurkish.trim() || "" // Türkçe çeviri opsiyonel
      };
      setSentences(prev => [...prev, newSentence]);
      setNewEnglish("");
      setNewTurkish("");
    }
  };

  const handleRemoveSentence = (id: number) => {
    setSentences(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = () => {
    onSave(sentences);
    onClose();
  };

  const handleClose = () => {
    setSentences(existingSentences);
    setNewEnglish("");
    setNewTurkish("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleClose}
    >
      <div 
        style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb',
          maxWidth: '28rem',
          width: '90%',
          maxHeight: '80vh',
          margin: '1rem',
          zIndex: 10000,
          animation: 'fade-in-zoom-in 0.2s ease-out',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
            Cümle Ekle
          </h3>
          <button
            onClick={handleClose}
            style={{ padding: '0.25rem', borderRadius: '9999px', transitionProperty: 'background-color', transitionDuration: '200ms', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
          </button>
        </div>
        
        {/* Content */}
        <div style={{ padding: '1rem', flex: 1, overflow: 'auto' }}>
          {/* Add New Sentence Form */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
              Yeni Cümle Ekle
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Input
                value={newEnglish}
                onChange={(e) => setNewEnglish(e.target.value)}
                placeholder="İngilizce cümle..."
                className="w-full"
              />
              <Input
                value={newTurkish}
                onChange={(e) => setNewTurkish(e.target.value)}
                placeholder="Türkçe çeviri (opsiyonel)..."
                className="w-full"
              />
              <Button
                onClick={handleAddSentence}
                disabled={!newEnglish.trim()}
                className="flex items-center gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Cümle Ekle
              </Button>
            </div>
          </div>

          {/* Existing Sentences */}
          {sentences.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                Eklenen Cümleler ({sentences.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', maxHeight: '150px', overflowY: 'auto' }}>
                {sentences.map((sentence, index) => (
                  <div
                    key={sentence.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.25rem',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#1f2937' }}>
                        {index + 1}. {sentence.english}
                      </div>
                      <div style={{ fontSize: '0.625rem', color: '#6b7280', marginTop: '0.125rem' }}>
                        {sentence.turkish}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSentence(sentence.id)}
                      style={{
                        padding: '0.125rem',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        color: '#ef4444',
                        transition: 'background-color 200ms'
                      }}
                    >
                      <X style={{ width: '0.875rem', height: '0.875rem' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <Button
            variant="outline"
            onClick={handleClose}
            size="sm"
            className="px-3 py-1"
          >
            İptal
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="px-3 py-1"
          >
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
}
