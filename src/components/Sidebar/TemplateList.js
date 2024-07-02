import React from 'react';

const TemplateList = ({ templates, selectedTemplate, onSelectTemplate }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#333', marginBottom: '10px' }}>Templates</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {templates.map((template) => (
          <li
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            style={{
              padding: '10px',
              backgroundColor: selectedTemplate?.id === template.id ? '#e0e0e0' : 'transparent',
              marginBottom: '5px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {template.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateList;