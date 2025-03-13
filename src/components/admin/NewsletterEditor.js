import { useState, useEffect } from 'react';
import { FiEdit2, FiX, FiArrowUp, FiArrowDown, FiCheckCircle, FiAlertCircle, FiSave, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NewsletterEditor = ({ 
  newsletter, 
  onSave, 
  onPublish, 
  isLoading, 
  isReadOnly = false,
  lastSaved
}) => {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState([]);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (newsletter) {
      setTitle(newsletter.title || '');
      setSections(newsletter.sections || []);
      setHasChanges(false);
    }
  }, [newsletter]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleEditSection = (sectionId, content) => {
    setEditingSectionId(sectionId);
    setEditingContent(content);
  };

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setEditingContent('');
  };

  const handleSaveSection = (sectionId) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, content: editingContent };
      }
      return section;
    });
    
    setSections(updatedSections);
    setEditingSectionId(null);
    setEditingContent('');
    setHasChanges(true);
  };

  const handleMoveSection = (sectionId, direction) => {
    const index = sections.findIndex(section => section.id === sectionId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSections = [...sections];
    const [moved] = updatedSections.splice(index, 1);
    updatedSections.splice(newIndex, 0, moved);
    
    setSections(updatedSections);
    setHasChanges(true);
  };

  const handleRemoveSection = (sectionId) => {
    if (confirm('Are you sure you want to remove this section?')) {
      const updatedSections = sections.filter(section => section.id !== sectionId);
      setSections(updatedSections);
      setHasChanges(true);
    }
  };

  const handleSaveNewsletter = () => {
    if (!title.trim()) {
      toast.error('Please enter a newsletter title');
      return;
    }

    onSave({
      ...newsletter,
      title,
      sections
    });
  };

  const handlePublishNewsletter = () => {
    if (!title.trim()) {
      toast.error('Please enter a newsletter title');
      return;
    }

    // First save, then publish
    onSave({
      ...newsletter,
      title,
      sections
    }, () => {
      // Callback after save
      onPublish();
    });
  };

  const renderSectionContent = (section) => {
    if (editingSectionId === section.id) {
      return (
        <div className="mt-2">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter section content..."
            disabled={isLoading}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveSection(section.id)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              disabled={isLoading}
            >
              <FiCheckCircle className="mr-1" />
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-2">
        <div className="prose prose-slate max-w-none">
          {section.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-2">{paragraph}</p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full">
            <label htmlFor="newsletter-title" className="block text-sm font-medium text-gray-700 mb-1">
              Newsletter Title
            </label>
            <input
              id="newsletter-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter newsletter title..."
              disabled={isLoading || isReadOnly}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            {lastSaved ? (
              <span className="flex items-center">
                <FiCheckCircle className="mr-1 text-green-500" />
                Last saved: {new Date(lastSaved).toLocaleString()}
              </span>
            ) : (
              newsletter?.id && (
                <span className="flex items-center">
                  <FiAlertCircle className="mr-1 text-amber-500" />
                  Not saved yet
                </span>
              )
            )}
          </div>
          
          {!isReadOnly && (
            <div className="flex space-x-3">
              <button
                onClick={handleSaveNewsletter}
                disabled={isLoading || !hasChanges}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                Save Draft
              </button>
              
              <button
                onClick={handlePublishNewsletter}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition flex items-center disabled:opacity-50"
              >
                <FiSend className="mr-2" />
                {newsletter?.status === 'published' ? 'Update' : 'Publish'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Newsletter Content</h2>
        
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900">
                  {section.title || `Section ${index + 1}`}
                </h3>
                
                {!isReadOnly && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleMoveSection(section.id, 'up')}
                      disabled={index === 0 || isLoading}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move up"
                    >
                      <FiArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveSection(section.id, 'down')}
                      disabled={index === sections.length - 1 || isLoading}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move down"
                    >
                      <FiArrowDown size={16} />
                    </button>
                    
                    {editingSectionId !== section.id && (
                      <>
                        <button
                          onClick={() => handleEditSection(section.id, section.content)}
                          disabled={isLoading}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="Edit section"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveSection(section.id)}
                          disabled={isLoading}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Remove section"
                        >
                          <FiX size={16} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {renderSectionContent(section)}
            </div>
          ))}
          
          {sections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No content sections available. Add your first section to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterEditor;