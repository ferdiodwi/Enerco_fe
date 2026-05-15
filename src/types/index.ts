export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: "active" | "pending" | "suspended";
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
}

export interface Business {
  id: number;
  user_id: number;
  region_id: number | null;
  name: string;
  sector: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  employee_count: number;
  production_capacity: number;
  monthly_energy_need: number;
  current_energy_cost: number;
  clean_energy_access: boolean;
  photo: string | null;
  verification_status: "pending" | "verified" | "rejected";
  created_at: string;
  updated_at: string;
  user?: User;
  region?: Region;
}

export interface EnergySource {
  id: number;
  user_id: number;
  region_id: number | null;
  name: string;
  type: "solar" | "wind" | "hydro" | "biomass" | "geothermal" | "other";
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  total_capacity_kwh: number;
  available_capacity_kwh: number;
  status: "active" | "inactive" | "maintenance";
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: number;
  name: string;
  province: string;
  city: string;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  priority_level: "low" | "medium" | "high" | null;
}

export interface Product {
  id: number;
  business_id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string | null;
  is_clean_energy_powered: boolean;
  status: "pending" | "active" | "rejected" | "archived";
  business?: { id: number; name: string; sector: string };
}

export interface Recommendation {
  id: number;
  business_id: number;
  energy_source_id: number;
  priority_score_id: number;
  recommended_energy_kwh: number;
  distance_km: number;
  estimated_cost_saving: number;
  estimated_emission_reduction: number;
  ai_summary: string | null;
  ai_reasoning: string | null;
  action_plan: string | null;
  confidence_score: number | null;
  status: "draft" | "reviewed" | "approved" | "rejected";
  business?: Business;
  energy_source?: EnergySource;
}

export interface MapMarker {
  id: number;
  type: "business" | "energy_source";
  name: string;
  latitude: number;
  longitude: number;
  sector?: string;
  energy_need?: number;
  priority_score?: number;
  priority_category?: string;
  energy_type?: string;
  total_capacity?: number;
  available_capacity?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}
