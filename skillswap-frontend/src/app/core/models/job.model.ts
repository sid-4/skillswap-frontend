export interface JobOwner {
  id: number;
  name: string;
  username: string;
}

export interface JobFreelancer {
  id: number;
  name: string;
  username: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'in_progress' | 'completed';
  owner?: JobOwner;
  freelancer?: JobFreelancer | null;
}