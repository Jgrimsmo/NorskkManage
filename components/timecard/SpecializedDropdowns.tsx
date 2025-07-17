import React from 'react';
import { CustomDropdown } from './CustomDropdown';

interface Project {
  id: string;
  name: string;
  costCodes: string[];
}

interface Equipment {
  id: string;
  name: string;
  type: string;
}

// Project Dropdown Component
export const ProjectDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  projects: Project[];
}> = ({ value, onChange, projects }) => {
  const options = projects.map(project => ({
    label: project.name,
    value: project.name
  }));

  return (
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select project"
    />
  );
};

// Equipment Dropdown Component
export const EquipmentDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  equipment: Equipment[];
}> = ({ value, onChange, equipment }) => {
  const options = equipment.map(eq => ({
    label: `${eq.name} (${eq.type})`,
    value: eq.name
  }));

  return (
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select equipment"
    />
  );
};

// Cost Code Dropdown Component
export const CostCodeDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  costCodes: string[];
}> = ({ value, onChange, costCodes }) => {
  const options = costCodes.map(code => ({
    label: code,
    value: code
  }));

  return (
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select cost code"
    />
  );
};

// Work Type Dropdown Component
export const WorkTypeDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  workTypes: string[];
}> = ({ value, onChange, workTypes }) => {
  const options = workTypes.map(type => ({
    label: type,
    value: type
  }));

  return (
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select work type"
    />
  );
};
