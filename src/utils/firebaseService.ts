import axios from 'axios';
import { Coordinate } from '../utils/types';

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/interactivemapapp-d84cc/databases/(default)/documents`;

/**
 * Prepares the URL for saving markers
 * @param userId - The user's ID
 * @returns The URL for saving markers
 */
const prepareSaveUrl = (userId: string): string => {
  return `${FIRESTORE_URL}/users/${userId}/markers`;
};

/**
 * Prepares the URL for deleting a marker
 * @param userId - The user's ID
 * @param markerId - The marker's ID
 * @returns The URL for deleting a marker
 */
const prepareDeleteUrl = (userId: string, markerId: string): string => {
  return `${FIRESTORE_URL}/users/${userId}/markers/${markerId}`;
};

/**
 * Prepares the request body for saving markers
 * @param markers - The markers to be saved
 * @returns The request body
 */
const prepareRequestBody = (markers: Coordinate[]) => {
  return markers.map(marker => ({
    fields: {
      latitude: { doubleValue: marker.latitude },
      longitude: { doubleValue: marker.longitude },
    },
  }));
};

/**
 * Sends the save request to Firestore
 * @param url - The URL for saving markers
 * @param token - The user's authentication token
 * @param requestBody - The request body
 * @throws An error if the save request fails
 */
const sendSaveRequest = async (url: string, token: string, requestBody: any): Promise<void> => {
  try {
    await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Error saving markers:', error.response ? error.response.data : error.message);
      throw new Error('Failed to save markers');
    } else {
      console.error('Unknown error saving markers:', error);
      throw new Error('Failed to save markers');
    }
  }
};

/**
 * Saves the markers to Firestore
 * @param token - The user's authentication token
 * @param userId - The user's ID
 * @param markers - The markers to be saved
 * @throws An error if the save request fails
 */
export const saveMarkers = async (token: string, userId: string, markers: Coordinate[]): Promise<void> => {
  const url = prepareSaveUrl(userId);
  const requestBody = prepareRequestBody(markers);
  for (const marker of requestBody) {
    await sendSaveRequest(url, token, marker);
  }
};

/**
 * Sends the delete request to Firestore
 * @param url - The URL for deleting a marker
 * @param token - The user's authentication token
 * @throws An error if the delete request fails
 */
const sendDeleteRequest = async (url: string, token: string): Promise<void> => {
  try {
    await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting marker:', error.response ? error.response.data : error.message);
      throw new Error('Failed to delete marker');
    } else {
      console.error('Unknown error deleting marker:', error);
      throw new Error('Failed to delete marker');
    }
  }
};

/**
 * Deletes all markers for the user
 * @param token - The user's authentication token
 * @param userId - The user's ID
 * @throws An error if the delete request fails
 */
export const deleteMarkers = async (token: string, userId: string): Promise<void> => {
  const url = prepareSaveUrl(userId);
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const markerIds = response.data.documents.map((doc: any) => doc.name.split('/').pop());

    for (const markerId of markerIds) {
      const deleteUrl = prepareDeleteUrl(userId, markerId);
      await sendDeleteRequest(deleteUrl, token);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting markers:', error.response ? error.response.data : error.message);
      throw new Error('Failed to delete markers');
    } else {
      console.error('Unknown error deleting markers:', error);
      throw new Error('Failed to delete markers');
    }
  }
};

/**
 * Fetches markers from Firestore
 * @param token - The user's authentication token
 * @param userId - The user's ID
 * @returns A promise that resolves to an array of coordinates
 * @throws An error if the fetch request fails
 */
export const fetchMarkers = async (token: string, userId: string): Promise<Coordinate[]> => {
  const url = prepareSaveUrl(userId);

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.data.documents) {
      return [];
    }

    const markers: Coordinate[] = response.data.documents.map((doc: any) => ({
      latitude: doc.fields.latitude.doubleValue,
      longitude: doc.fields.longitude.doubleValue,
      id: doc.name.split('/').pop(), 
    }));

    return markers;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Error loading markers:', error.response ? error.response.data : error.message);
      throw new Error('Failed to load markers');
    } else {
      console.error('Unknown error loading markers:', error);
      throw new Error('Failed to load markers');
    }
  }
};
