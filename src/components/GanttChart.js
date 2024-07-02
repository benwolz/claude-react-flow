import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const GanttChart = ({ tasks = [], groups = [] }) => {
  if (!tasks.length) {
    return <div>No tasks to display</div>;
  }

  const chartData = tasks.map((task) => ({
    name: task.name,
    start: task.startTime || 0,
    duration: task.duration,
    group: groups.find(g => g.taskIds && g.taskIds.includes(task.id))
  }));

  const totalDuration = Math.max(...chartData.map(task => task.start + task.duration), 1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Task: ${data.name}`}</p>
        <p>{`Start: ${data.start} days`}</p>
        <p>{`Duration: ${data.duration} days`}</p>
        {data.group && <p>{`Group: ${data.group.name}`}</p>}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          barSize={20}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" domain={[0, totalDuration]} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="start" stackId="a" fill="transparent" name="Start Time" />
          <Bar dataKey="duration" stackId="a" name="Duration">
            {
              chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.group && entry.group.color ? entry.group.color : '#82ca9d'} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GanttChart;