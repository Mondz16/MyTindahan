export interface Category {
  id: string;
  label: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  swatch: string;
  variants?: string[];
  modifiers?: string[];
  forecast?: number;
}

export interface HourlyBar {
  h: string;
  v: number;
  projected?: boolean;
}

export interface RestockAlert {
  sku: string;
  name: string;
  stock: number;
  daysLeft: number;
  reorder: number;
  confidence: number;
  severity: "critical" | "high" | "medium";
  reason: string;
}

export interface Sale {
  id: string;
  time: string;
  items: number;
  total: number;
  method: string;
}

export interface Insight {
  kind: string;
  title: string;
  body: string;
  confidence: number;
}

export declare const categories: Category[];
export declare const products: Product[];
export declare const revenue: number[];
export declare const forecastRevenue: number[];
export declare const hourly: HourlyBar[];
export declare const restockAlerts: RestockAlert[];
export declare const recentSales: Sale[];
export declare const insights: Insight[];
