
export enum UserRole {
  CITIZEN = 'citizen',
  ADMIN = 'admin'
}

export enum ComplaintStatus {
  SUBMITTED = 'submitted',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}

export type IssueType = 'pothole' | 'garbage' | 'water leak' | 'streetlight' | 'drainage' | 'other';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: number;
}

export interface ComplaintUpdate {
  updateId: string;
  complaintId: string;
  updatedBy: string; // admin name/uid
  message: string;
  statusChange?: ComplaintStatus;
  proofImageUrl?: string;
  timestamp: number;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  issueType: IssueType;
  aiDescription: string;
  manualDescription: string;
  severityScore: number;
  latitude: number;
  longitude: number;
  address: string;
  status: ComplaintStatus;
  createdAt: number;
  updatedAt: number;
  duplicateFlag: boolean;
  updates: ComplaintUpdate[];
}
