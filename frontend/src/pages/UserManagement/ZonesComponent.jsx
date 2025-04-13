import { useState } from 'react';

const initialZones = {
  'Zone A': ['Cheezious Headquarters', 'Cheezious I-8', 'Cheezious F-7/1', 'Cheezious F-7/2', 'Cheezious G-9'],
  'Zone B': ['Cheezious F-10', 'Cheezious F-11','Cheezious E-11','Cheezious WAH CANTT','Cheezious G-13','Cheezious GOLRA'],
  'Zone C': ['Cheezious SADDAR', 'Cheezious Commercial 1 & 2','Cheezious OLD WORKSHOP','Cheezious Support Center'],
  'Zone D': ['Cheezious GHAURI TOWN', 'Cheezious TRAMRI','Cheezious PWD','Cheezious SCHEME 3'],
  'Zone E': ['Cheezious ADYALA', 'Cheezious KALMA','Cheezious BAHRIA','Cheezious ZARAJ GT ROAD','Cheezious GIGA','Cheezious Warehouse HUMAK'],
  'Zone F': ['Cheezious PESHAWAR', 'Cheezious MARDAN'],
};

export const useZones = () => {
  const [zones, setZones] = useState(initialZones);

  const addBranch = (zone, branchName) => {
    setZones({
      ...zones,
      [zone]: [...zones[zone], branchName],
    });
  };

  return { zones, addBranch };
};
