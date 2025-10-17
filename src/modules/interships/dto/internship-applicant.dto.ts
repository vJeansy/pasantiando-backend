export class InternshipApplicantDto {
  internshipId: string;
  internshipTitle: string;
  appliedAt: Date | null;
  status: string;

  studentId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean | null;
  createdAt: Date | null;

  middleName?: string | null;
  maidenName?: string | null;
  profileUrl?: string | null;
  headline?: string | null;
  summaryTitle?: string | null;
  summary?: string | null;
  linkedinUrl?: string | null;
  resumeUrl?: string | null;
  country?: string | null;
  postalCode?: string | null;
  province?: string | null;
  city?: string | null;
  streetAddress?: string | null;
  phone?: string | null;
  dateOfBirth?: Date | null;

  education?: any[];
  experience?: any[];
  projects?: any[];
  skills?: any[];
  languages?: any[];
}