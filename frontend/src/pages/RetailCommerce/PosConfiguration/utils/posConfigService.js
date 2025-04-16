import axios from 'axios';

// Base URL for API - adjust this to match your backend URL
const API_BASE_URL = '/api/posconfig';

// Get all POS configurations
export const getAllPosConfigs = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching POS configurations:', error);
    throw error;
  }
};

// Create a new POS configuration
export const createPosConfig = async (posConfigData) => {
  try {
    const response = await axios.post(API_BASE_URL, posConfigData);
    return response.data;
  } catch (error) {
    console.error('Error creating POS configuration:', error);
    throw error;
  }
};

// Update a POS configuration
export const updatePosConfig = async (posID, posConfigData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${posID}`, posConfigData);
    return response.data;
  } catch (error) {
    console.error('Error updating POS configuration:', error);
    throw error;
  }
};

// Format frontend data to match backend model
export const formatPosConfigForBackend = (posConfig) => {
  return {
    PosID: posConfig.posId,
    RegistrationNumber: posConfig.id,
    AuthorityType: posConfig.authorityType,
    POSStatus: posConfig.status === 'ONLINE' ? 'Online' : 'Offline',
    Username: posConfig.userName || '',
    Password: posConfig.password || '',
    TimeBound: {
      Start: posConfig.timeBoundStart || new Date(),
      End: posConfig.timeBoundEnd || new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    }
  };
};

// Format backend data to match frontend model
export const formatPosConfigForFrontend = (posConfig) => {
  return {
    id: posConfig.RegistrationNumber,
    posId: posConfig.PosID,
    authorityType: posConfig.AuthorityType,
    token: '', // Not in backend model
    offlineToken: '', // Not in backend model
    userName: posConfig.Username,
    password: posConfig.Password,
    timeBound: formatTimeBoundForDisplay(posConfig.TimeBound),
    timeBoundStart: new Date(posConfig.TimeBound.Start),
    timeBoundEnd: new Date(posConfig.TimeBound.End),
    status: posConfig.POSStatus === 'Online' ? 'ONLINE' : 'OFFLINE'
  };
};

// Format TimeBound for display
const formatTimeBoundForDisplay = (timeBound) => {
  if (!timeBound || !timeBound.Start || !timeBound.End) return '';
  
  const start = new Date(timeBound.Start);
  const end = new Date(timeBound.End);
  
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
};
