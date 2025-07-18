export interface User {
    id: string;
    username: string; 
  }
  
  export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
  }
  
  export interface Product {
    product_id: string;
    product_name: string;
    created_at: string;  
  }
  
  export interface ProductStockOverview {
    product_id: string;
    product_name: string;
    current_quantity: number;
    total_inventory_cost: number;
    average_cost_per_unit: number;
  }
  
  export type InventoryEventType = 'purchase' | 'sale';
  
  export interface InventoryEvent {
    product_id: string;
    event_type: InventoryEventType;
    quantity: number;
    unit_price?: number;  
    timestamp: string; 
  }
  
  export interface InventoryTransaction {
    event_type: InventoryEventType;
    product_id: string;
    product_name: string;
    quantity: number;
    cost_or_price: number;  
    timestamp: string;  
  }

  export interface ApiErrorResponse {
    message: string;
    
  }