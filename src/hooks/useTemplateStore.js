import { create } from 'zustand';

const calculateStartTimes = (tasks) => {
  const taskMap = new Map(tasks.map(task => [task.id, { ...task, startTime: 0, level: undefined }]));

  const calculateTaskStartTime = (taskId) => {
    const task = taskMap.get(taskId);
    if (task.startTime !== undefined && task.startTime > 0) return task.startTime;

    const dependencyEndTimes = (task.dependencies || []).map(depId => {
      const depTask = taskMap.get(depId);
      const depStartTime = calculateTaskStartTime(depId);
      return depStartTime + depTask.duration;
    });

    const startTime = dependencyEndTimes.length > 0 ? Math.max(...dependencyEndTimes) : 0;
    task.startTime = startTime;
    return startTime;
  };

  tasks.forEach(task => calculateTaskStartTime(task.id));

  const calculateTaskLevel = (taskId) => {
    const task = taskMap.get(taskId);
    if (task.level !== undefined) return task.level;
  
    const dependencyLevels = (task.dependencies || []).map(depId => {
      const depLevel = calculateTaskLevel(depId);
      return depLevel + 1;
    });
  
    const level = dependencyLevels.length > 0 ? Math.max(...dependencyLevels) : 0;
    task.level = level;
    return level;
  };
  
  tasks.forEach(task => calculateTaskLevel(task.id));

  return Array.from(taskMap.values());
};

export const useTemplateStore = create((set, get) => ({
  templates: [],
  selectedTemplate: null,

  addTemplate: (templateName) => set((state) => {
    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      tasks: [],
      groups: []
    };
    return { 
      templates: [...state.templates, newTemplate],
      selectedTemplate: newTemplate
    };
  }),

  selectTemplate: (templateId) => set((state) => ({
    selectedTemplate: state.templates.find(t => t.id === templateId)
  })),

  updateTemplate: (updatedTemplate) => set((state) => {
    const templatesWithUpdatedTasks = state.templates.map(t => 
      t.id === updatedTemplate.id ? { ...updatedTemplate, tasks: calculateStartTimes(updatedTemplate.tasks) } : t
    );
    return {
      templates: templatesWithUpdatedTasks,
      selectedTemplate: templatesWithUpdatedTasks.find(t => t.id === updatedTemplate.id)
    };
  }),

  addTaskToTemplate: (templateId, task) => set((state) => {
    const updatedTemplates = state.templates.map(t => {
      if (t.id === templateId) {
        const updatedTasks = calculateStartTimes([...t.tasks, { ...task, dependencies: [] }]);
        return { ...t, tasks: updatedTasks };
      }
      return t;
    });
    const updatedSelectedTemplate = updatedTemplates.find(t => t.id === templateId);
    return {
      templates: updatedTemplates,
      selectedTemplate: updatedSelectedTemplate
    };
  }),

  removeTaskFromTemplate: (templateId, taskId) => set((state) => {
    const updatedTemplates = state.templates.map(t => {
      if (t.id === templateId) {
        const updatedTasks = t.tasks.filter(task => task.id !== taskId);
        const recalculatedTasks = calculateStartTimes(updatedTasks);
        return { ...t, tasks: recalculatedTasks };
      }
      return t;
    });
    return {
      templates: updatedTemplates,
      selectedTemplate: updatedTemplates.find(t => t.id === templateId)
    };
  }),

  addDependency: (templateId, sourceTaskId, targetTaskId) => set((state) => {
    const updatedTemplates = state.templates.map(t => {
      if (t.id === templateId) {
        const updatedTasks = t.tasks.map(task => 
          task.id === targetTaskId 
            ? { ...task, dependencies: [...(task.dependencies || []), sourceTaskId] }
            : task
        );
        console.log(calculateStartTimes(updatedTasks));
        return { ...t, tasks: calculateStartTimes(updatedTasks) };
      }
      return t;
    });
    return {
      templates: updatedTemplates,
      selectedTemplate: updatedTemplates.find(t => t.id === templateId)
    };
  }),

  removeDependency: (templateId, sourceTaskId, targetTaskId) => set((state) => {
    const updatedTemplates = state.templates.map(t => {
      if (t.id === templateId) {
        const updatedTasks = t.tasks.map(task => 
          task.id === targetTaskId 
            ? { ...task, dependencies: (task.dependencies || []).filter(id => id !== sourceTaskId) }
            : task
        );
        return { ...t, tasks: calculateStartTimes(updatedTasks) };
      }
      return t;
    });
    return {
      templates: updatedTemplates,
      selectedTemplate: updatedTemplates.find(t => t.id === templateId)
    };
  }),

  addGroupToTemplate: (templateId, group) => set((state) => {
    const updatedTemplates = state.templates.map(t => {
      if (t.id === templateId) {
        return { ...t, groups: [...t.groups, { ...group, taskIds: [] }] };
      }
      return t;
    });
    return {
      templates: updatedTemplates,
      selectedTemplate: updatedTemplates.find(t => t.id === templateId)
    };
  }),

  addTaskToGroup: (templateId, taskId, groupId) => set((state) => {
    const updatedTemplates = state.templates.map(template => {
      if (template.id === templateId) {
        const updatedGroups = template.groups.map(group => {
          if (group.id === groupId) {
            return { ...group, taskIds: [...group.taskIds, taskId] };
          }
          return group;
        });
        return { ...template, groups: updatedGroups };
      }
      return template;
    });
    return { 
      templates: updatedTemplates,
      selectedTemplate: updatedTemplates.find(t => t.id === templateId)
    };
  }),

  removeTaskFromGroup: (templateId, taskId, groupId) => set((state) => {
    const updatedTemplates = state.templates.map(template => {
      if (template.id === templateId) {
        const updatedGroups = template.groups.map(group => {
          if (group.id === groupId) {
            return { ...group, taskIds: group.taskIds.filter(id => id !== taskId) };
          }
          return group;
        });
        return { ...template, groups: updatedGroups };
      }
      return template;
    });
    return { 
      templates: updatedTemplates,
      selectedTemplate: updatedTemplates.find(t => t.id === templateId)
    };
  }),

  updateTask: (templateId, updatedTask) => set((state) => {
    const updatedTemplates = state.templates.map(t => {
      if (t.id === templateId) {
        const updatedTasks = t.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
        return { ...t, tasks: calculateStartTimes(updatedTasks) };
      }
      return t;
    });
    return {
      templates: updatedTemplates,
      selectedTemplate: updatedTemplates.find(t => t.id === templateId)
    };
  })
}));