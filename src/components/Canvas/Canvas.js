import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  Background, 
  Controls,
  MarkerType,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Dagre from '@dagrejs/dagre';

import ContextMenu from './ContextMenu';
import CustomNode from './CustomNode';
import { useTemplateStore } from '../../hooks/useTemplateStore';

const nodeTypes = {
  customNode: CustomNode,
};

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0
}

const NODE_WIDTH = 150;
const NODE_HEIGHT = 100;

// Dagre
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.target, edge.source));
  nodes.forEach(node => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      if (position) {
        const x = position.x - NODE_WIDTH / 2;
        const y = position.y - NODE_HEIGHT / 2;
        return { ...node, position: { x, y } };
      }
      return node;
    }),
    edges,
  };
};

const Canvas = ({ selectedTemplate }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { addDependency, removeDependency } = useTemplateStore();
  const { fitView } = useReactFlow();
  const [menu, setMenu] = useState(initialContextMenu);
  const contextMenuClose = () => setMenu(initialContextMenu);
  const ref = useRef(null);

  const onPaneClick = useCallback(() => setMenu(null), []);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu
      const pane = ref.current.getBoundingClientRect();
      const top = event.clientY;
      const left = event.clientX-215;
      const menuHeight = 100; // approximate height of the menu
      const menuWidth = 150; // approximate width of the menu

      setMenu({
        id: node.id,
        top: top,
        left: left,
        closeContextMenu: contextMenuClose
      });
    },
    [setMenu],
  );

  useEffect(() => {
    if (selectedTemplate && selectedTemplate.tasks) {
      const newEdges = selectedTemplate.tasks.flatMap(task =>
        (task.dependencies || []).map(depId => ({
          id: `${depId}-${task.id}`,
          source: depId,
          target: task.id,
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }))
      );

      const newNodes = selectedTemplate.tasks.map(task => ({
        id: task.id,
        type: 'customNode',
        data: { 
          ...task,
          group: selectedTemplate.groups.find(g => g.taskIds.includes(task.id))
        },
        position: { x: 0, y: 0 }, // Initial dummy position
      }));

      const layoutedElements = getLayoutedElements(newNodes, newEdges, { direction: "RL" });

      setNodes(layoutedElements.nodes);
      setEdges(newEdges);

      setTimeout(() => fitView({ padding: 0.2 }), 0);
    }
  }, [selectedTemplate, setNodes, setEdges, fitView]);

  const onConnect = useCallback((params) => {
    addDependency(selectedTemplate.id, params.source, params.target);
  }, [addDependency, selectedTemplate]);

  const onEdgesDelete = useCallback((edgesToDelete) => {
    edgesToDelete.forEach(edge => {
      removeDependency(selectedTemplate.id, edge.source, edge.target);
    });
  }, [removeDependency, selectedTemplate]);

  if (!selectedTemplate || !selectedTemplate.tasks) {
    return <div>No template or tasks to display</div>;
  }

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        style={{ width: '100%', height: '100%' }}
      >
        <Background />
        <Controls />
      </ReactFlow>
      {menu && <ContextMenu {...menu} />}
    </div>
  );
};

export default Canvas;
