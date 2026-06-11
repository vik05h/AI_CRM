export interface Customer {
  id: string;
  name: string;
  email: string;
  created_at: string;
  metadata_json: Record<string, any>;
}

export interface OrderItem {
  product: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: {
    line_items: OrderItem[];
  };
}
