// types/index.ts

export type DisplayType = "emergency" | "highlight" | "normal";
export type Status = "active" | "inactive";

export interface Contact {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  category: string;
  categoryDesc?: string; // Có thể có hoặc không
  avatarUrl: string;
  displayType: DisplayType;
  order: number;
  status: Status;
}
