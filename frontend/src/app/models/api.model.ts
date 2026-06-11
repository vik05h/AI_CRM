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

export interface Segment {
  id: string;
  name: string;
  description?: string;
  criteria: string;
  size: number;
  created_at: string;
}

export interface CustomerPreview {
  id: string;
  name: string;
  email: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
}

export interface SegmentPreviewData {
  customers: CustomerPreview[];
  total_count: number;
  truncated: boolean;
}
