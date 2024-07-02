import React from 'react';
import ReactFlow, { ReactFlowProvider, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar/Sidebar';
import Canvas from './Canvas/Canvas';
import GanttChart from './GanttChart';
import { useTemplateStore } from '../hooks/useTemplateStore';
import './globalStyles.css';

const App = () => {
  const { templates, selectedTemplate, selectTemplate } = useTemplateStore();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={selectTemplate}
        />
        <ReactFlowProvider>
          <div style={{ flex: 1, position: 'relative' }}>
            {selectedTemplate && <Canvas selectedTemplate={selectedTemplate} />}
          </div>
        </ReactFlowProvider>
      </div>
      <div style={{ height: '300px', borderTop: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
        {selectedTemplate && selectedTemplate.tasks && (
          <GanttChart 
            tasks={selectedTemplate.tasks} 
            groups={selectedTemplate.groups || []}
          />
        )}
      </div>
    </div>
  );
};

export default App;