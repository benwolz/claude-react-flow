import React, { useState } from 'react';
import { Button, InputGroup, Icon } from "@blueprintjs/core";
import { useTemplateStore } from '../../hooks/useTemplateStore';

const Sidebar = () => {
  const { 
    templates, 
    selectedTemplate, 
    selectTemplate, 
    addTemplate, 
    addTaskToTemplate,
    addGroupToTemplate,
    addTaskToGroup,
    removeTaskFromGroup,
  } = useTemplateStore();

  const [newTemplateName, setNewTemplateName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({});

  const handleAddTemplate = () => {
    if (newTemplateName.trim()) {
      addTemplate(newTemplateName.trim());
      setNewTemplateName('');
    }
  };

  const handleAddGroup = () => {
    if (newGroupName.trim() && selectedTemplate) {
      const newGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName.trim(),
        taskIds: [],
        color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color
      };
      addGroupToTemplate(selectedTemplate.id, newGroup);
      setNewGroupName('');
    }
  };

  const handleAddTask = () => {
    if (newTaskName.trim() && newTaskDuration.trim() && selectedTemplate) {
      const newTask = {
        id: `task-${Date.now()}`,
        name: newTaskName.trim(),
        duration: parseInt(newTaskDuration, 10),
        dependencies: [],
      };
      addTaskToTemplate(selectedTemplate.id, newTask);
      setNewTaskName('');
      setNewTaskDuration('');
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, groupId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text');
    if (selectedTemplate) {
      // Remove from current group
      selectedTemplate.groups.forEach(group => {
        if (group.taskIds.includes(taskId)) {
          removeTaskFromGroup(selectedTemplate.id, taskId, group.id);
        }
      });
      // Add to new group
      if (groupId !== 'ungrouped') {
        addTaskToGroup(selectedTemplate.id, taskId, groupId);
      }
    }
  };

  const toggleExpand = (nodeId) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const renderTask = (task) => (
    <div 
      key={task.id} 
      draggable 
      onDragStart={(e) => handleDragStart(e, task.id)}
      style={{ marginLeft: '20px', cursor: 'move' }}
    >
      <Icon icon="drag-handle-vertical" style={{ marginRight: '5px' }} />
      {task.name}
    </div>
  );

  const renderGroup = (group, tasks) => (
    <div key={group.id}>
      <div 
        onClick={() => toggleExpand(group.id)} 
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, group.id)}
        style={{ cursor: 'pointer' }}
      >
        <Icon icon={expandedNodes[group.id] ? "folder-open" : "folder-close"} />
        {group.name}
      </div>
      {expandedNodes[group.id] && (
        <div style={{ marginLeft: '20px' }}>
          {tasks.filter(task => group.taskIds.includes(task.id)).map(renderTask)}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '10px' }}>
      <h3>Templates</h3>
      <InputGroup
        value={newTemplateName}
        onChange={(e) => setNewTemplateName(e.target.value)}
        placeholder="New template name"
        rightElement={<Button onClick={handleAddTemplate} text="Add" />}
      />
      
      {templates.map(template => (
        <div key={template.id}>
          <h4 onClick={() => selectTemplate(template.id)} style={{ cursor: 'pointer' }}>
            {template.name}
          </h4>
          {template.id === selectedTemplate?.id && (
            <>
              <div>
                <h5 onClick={() => toggleExpand(`${template.id}-groups`)}>Groups</h5>
                {expandedNodes[`${template.id}-groups`] && template.groups.map(group => renderGroup(group, template.tasks))}
              </div>
              <div>
                <h5 
                  onClick={() => toggleExpand(`${template.id}-ungrouped`)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'ungrouped')}
                >
                  Ungrouped Tasks
                </h5>
                {expandedNodes[`${template.id}-ungrouped`] && (
                  <div>
                    {template.tasks
                      .filter(task => !template.groups.some(group => group.taskIds.includes(task.id)))
                      .map(renderTask)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {selectedTemplate && (
        <>
          <h4>Add Group to {selectedTemplate.name}</h4>
          <InputGroup
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="New group name"
            rightElement={<Button onClick={handleAddGroup} text="Add" />}
          />

          <h4>Add Task to {selectedTemplate.name}</h4>
          <InputGroup
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="New task name"
          />
          <InputGroup
            value={newTaskDuration}
            onChange={(e) => setNewTaskDuration(e.target.value)}
            placeholder="Duration (days)"
            type="number"
            rightElement={<Button onClick={handleAddTask} text="Add" />}
          />
        </>
      )}
    </div>
  );
};

export default Sidebar;