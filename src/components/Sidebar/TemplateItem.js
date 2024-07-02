import React, { useState } from 'react';
import { useTemplateStore } from '../../hooks/useTemplateStore';

const TemplateItem = ({ template }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const { addTaskToTemplate } = useTemplateStore();

  const handleAddTask = () => {
    if (newTaskName.trim() && newTaskDuration.trim() && template) {
      const newTask = {
        id: `task-${Date.now()}`,
        name: newTaskName,
        duration: parseInt(newTaskDuration, 10),
        dependencies: [],
      };
      addTaskToTemplate(template.id, newTask);
      setNewTaskName('');
      setNewTaskDuration('');
    }
  };

  if (!template) {
    return <div>No template selected</div>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>{template.name}</h3>
      <div>
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="New task name"
        />
        <input
          type="number"
          value={newTaskDuration}
          onChange={(e) => setNewTaskDuration(e.target.value)}
          placeholder="Duration (in days)"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul>
        {(template.tasks || []).map((task) => (
          <li key={task.id}>
            {task.name} - {task.duration} days
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateItem;