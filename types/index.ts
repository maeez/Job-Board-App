export type UserRole = "seeker" | "poster";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

export type SeekerProfile = {
  id: string;
  userId: string;
  country: string;
  jobPreference: "in-office" | "remote" | "hybrid";
  compensationCurrency: string;
  expectedCompensation: number;
  languages: string[];
  skills: string[];
};

export type Job = {
  id: string;
  posterId: string;
  title: string;
  description: string | null;
  requiredSkills: string[];
  requiredLanguages: string[];
  country: string;
  compensationCurrency: string;
  compensationAmount: number;
  jobType: "in-office" | "remote" | "hybrid";
  createdAt: Date;
  updatedAt: Date;
};