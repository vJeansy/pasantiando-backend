import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InternshipApplicantDto } from '../dto/internship-applicant.dto';

@Injectable()
export class InternshipAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,) { }

  async getApplicantsByInternship(businessId: string, internshipId: string): Promise<InternshipApplicantDto[]> { //Return all applicants from an internship's business account.
    const internship = await this.prisma.internships.findUnique({
      where: { id: internshipId },
      include: {
        applications: {
          include: {
            students: {
              include: {
                users: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email_address: true,
                    is_active: true,
                    created_at: true,
                  },
                },
                student_education: true,
                student_experience: true,
                student_projects: true,
                student_languages: { include: { languages: true } },
                student_skills: { include: { skills: true } },
              },
            },
          },
        },
      },
    });

    if (!internship) throw new NotFoundException('La pasantía no existe.');
    if (internship.business_id !== businessId) throw new ForbiddenException('No tienes acceso a esta pasantía.');

    return internship.applications.map((app: any) => {
      const student = app.students;
      const user = student.users;

      return {
        applicationId: app.id,
        internshipId: internship.id,
        internshipTitle: internship.title,
        appliedAt: app.updated_at,
        status: app.application_status,
        studentId: student.id,
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email_address,
        isActive: user.is_active,
        createdAt: user.created_at,
        middleName: student.middle_name ?? null,
        maidenName: student.maiden_name ?? null,
        profileUrl: student.profile_picture_url ?? null,
        headline: student.headline ?? null,
        summaryTitle: student.summary_title ?? null,
        summary: student.summary ?? null,
        linkedinUrl: student.linkedin_url ?? null,
        resumeUrl: student.resume_url ?? null,
        country: student.country ?? null,
        municipio: student.municipio ?? null,
        postalCode: student.postal_code ?? null,
        province: student.state_province ?? null,
        city: student.city ?? null,
        streetAddress: student.street_address ?? null,
        willing_to_travel: student.willing_to_travel,
        has_vehicle: student.has_vehicle,
        phone: student.phone ?? null,
        dateOfBirth: student.birth_date ?? null,
        education: student.student_education,
        experience: student.student_experience,
        projects: student.student_projects,
        skills: student.student_skills.map((s: any) => s.skills),
        languages: student.student_languages.map((l: any) => ({
          language_name: l.languages.language_name,
          iso_code: l.languages.iso_code,
          proficiency_level: l.proficiency_level,
        })),
      };
    });
  }

  async getAll(businessId: string): Promise<InternshipApplicantDto[]> {
    const internships = await this.prisma.internships.findMany({
      where: { business_id: businessId },
      include: {
        applications: {
          include: {
            students: {
              include: {
                users: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email_address: true,
                    is_active: true,
                    created_at: true,
                  },
                },
                student_education: true,
                student_experience: true,
                student_projects: true,
                student_languages: { include: { languages: true } },
                student_skills: { include: { skills: true } },
              },
            },
          },
        },
      },
    });

    const allApplicants: InternshipApplicantDto[] = [];

    for (const internship of internships) {
      for (const app of internship.applications) {
        const student = app.students;
        const user = student.users;

        allApplicants.push({
          internshipId: internship.id,
          internshipTitle: internship.title,
          appliedAt: app.updated_at,
          status: app.application_status,
          studentId: student.id,
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email_address,
          isActive: user.is_active,
          createdAt: user.created_at,
          middleName: student.middle_name ?? null,
          maidenName: student.maiden_name ?? null,
          profileUrl: student.profile_picture_url ?? null,
          headline: student.headline ?? null,
          summaryTitle: student.summary_title ?? null,
          summary: student.summary ?? null,
          linkedinUrl: student.linkedin_url ?? null,
          resumeUrl: student.resume_url ?? null,
          country: student.country ?? null,
          postalCode: student.postal_code ?? null,
          province: student.state_province ?? null,
          municipio: student.municipio ?? null,
          city: student.city ?? null,
          streetAddress: student.street_address ?? null,
          phone: student.phone ?? null,
          dateOfBirth: student.birth_date ?? null,
          education: student.student_education,
          experience: student.student_experience,
          projects: student.student_projects,
          skills: student.student_skills.map((s: any) => s.skills),
          languages: student.student_languages.map((l: any) => l.languages),
        });
      }
    }
    return allApplicants;
  }
  /*

   // Devuelve métricas por pasantía: cantidad de postulantes y tasa de aceptación.

  async getApplicationMetrics(businessId: string) {
    const internships = await this.prisma.internships.findMany({
      where: { business_id: businessId },
      select: {
        id: true,
        title: true,
        applications: {
          select: { application_status: true },
        },
      },
    });

    return internships.map((internship) => {
      const total = internship.applications.length;
      const accepted = internship.applications.filter((a) => a.application_status === 'accepted').length;
      const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;

      return {
        internshipId: internship.id,
        internshipTitle: internship.title,
        totalApplicants: total,
        acceptedApplicants: accepted,
        acceptanceRate: rate,
      };
    });
  }*/
}