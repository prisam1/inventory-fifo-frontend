import api from './api';
import { Product, ProductStockOverview } from '../types';

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductStockOverview = async (): Promise<ProductStockOverview[]> => {
  const response = await api.get('/products/stock-overview');
  return response.data;
};