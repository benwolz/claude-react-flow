import React, { useCallback, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { useOnClickOutside } from '../../hooks/onClickOutside';
import { useTemplateStore } from '../../hooks/useTemplateStore';

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  closeContextMenu,
  ...props
}) {
  const { getNode } = useReactFlow();
  const { addTaskToTemplate, selectedTemplate } = useTemplateStore();
  const contextMenuRef = useRef(null);

  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    console.log(node);
    const newTask = {
      id: `${node.id}-copy-${Date.now()}`, // Ensure unique ID
      name: `${node.data.name || 'Node'}-copy`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      duration: node.data.duration,
      dependencies: [],
      templateId: selectedTemplate.id,
    };
    addTaskToTemplate(selectedTemplate.id, newTask);
  }, [id, getNode, addTaskToTemplate, selectedTemplate]);

  const deleteNode = useCallback(() => {
    // Implement delete logic if needed
  }, [id]);

  useOnClickOutside(contextMenuRef, closeContextMenu);

  return (
    <div
      style={{ position: 'absolute', top, left, right, bottom, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 1000 }}
      className="context-menu"
      {...props}
      onClick={closeContextMenu}
    >
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <button onClick={duplicateNode}>duplicate</button>
      <button onClick={deleteNode}>delete</button>
    </div>
  );
}
