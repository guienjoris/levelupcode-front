export interface Supporter {
  id?: string;
  name: string;
  amount?: number;
  message?: string;
  createdAt: string;
}

export interface UserDonationStatus {
  isSupporter: boolean;
  supporterSince?: string;
  totalDonations?: number;
}
