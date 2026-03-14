export interface ProposalFreelancer {
  id: number;
  name: string;
  username: string;
}

export interface Proposal {
  id: number;
  price: number;
  cover_letter?: string;
  message?: string;
  status: string;
  freelancer?: ProposalFreelancer;
  job_id?: number;
}