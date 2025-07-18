import api from './api';
import { InventoryEvent, InventoryTransaction } from '../types';

export const sendInventoryEvent = async (event: InventoryEvent): Promise<any> => {
  const response = await api.post('/inventory-events/send-event', event);
  return response.data;
};

export const getInventoryTransactions = async (): Promise<InventoryTransaction[]> => {
  const response = await api.get('/inventory-events/transactions');
  return response.data;
};