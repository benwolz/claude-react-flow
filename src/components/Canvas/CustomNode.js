import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

import tinycolor from 'tinycolor2';

const CustomNode = ({ data }) => {
  const nodeColor = data.group ? data.group.color : '#4a90e2';
  const handleColor = tinycolor(nodeColor).lighten(20).toString()

  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: nodeColor,
      color: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      width: '150px', // Fixed width
      minHeight: '80px', // Minimum height
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: handleColor, width: "14px", height: "30px", borderRadius: "3px" }}
      />
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '5px',
        wordWrap: 'break-word', // Allow long words to break
        overflowWrap: 'break-word', // Ensure long words don't overflow
      }}>
        {data.name}
      </div>
      <div style={{
        fontSize: '12px',
        opacity: 0.8,
        marginTop: 'auto', // Push to bottom
      }}>
        Duration: {data.duration} days
      </div>
      {data.group && (
        <div style={{
          fontSize: '10px',
          opacity: 0.7,
          marginTop: '5px',
        }}>
          Group: {data.group.name}
        </div>
      )}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: handleColor, width: "14px", height: "30px", borderRadius: "3px" }}
      />
    </div>
  );
};

export default memo(CustomNode);