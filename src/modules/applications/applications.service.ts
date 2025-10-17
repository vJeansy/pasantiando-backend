import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from '../email-service/email-service.service';
import { NotificationService } from '../notification/notification.service';
import { generateApplicationEmailHTML } from '../email-service/templates/application-response.template';
import capitalize from 'src/utils/selects/capitalize';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationService: NotificationService) { }

  async create(internshipId: string, studentId: any) {
    // 1. Verificar si ya existe una aplicación
    const existingApplication = await this.prisma.applications.findFirst({
      where: {
        internship_id: internshipId,
        student_id: studentId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException("You already applied to this internship.");
    }

    // 2. Validar existencia de entidades relacionadas
    const studentProfile = await this.prisma.students.findUnique({ where: { id: studentId } });
    if (!studentProfile) {
      throw new BadRequestException("Student profile not found.");
    }

    const internship = await this.prisma.internships.findUnique({ where: { id: internshipId } });
    if (!internship) {
      throw new BadRequestException("Internship nor found.");
    }

    try {
      const newApplication = await this.prisma.applications.create({
        data: {
          internships: { connect: { id: internshipId, }, },
          students: { connect: { id: studentId, }, },
          /*business: { connect: { id: internshipId, }, }*/
        },
        include: {
          internships: { include: { business: { include: { users: true }, }, }, },
          students: { include: { users: true, }, }
        },
      });

      await this.notificationService.create({
        userId: newApplication.internships.business.users.id,
        type: 'new_application',
        title: `Nueva aplicación recibida`,
        message: `${capitalize(newApplication.students.users.first_name)} ha aplicado a tu pasantía "${newApplication.internships.title}".`,
      });

      return newApplication;
    } catch (error) {
      const studentProfile = await this.prisma.students.findUnique({ where: { id: studentId }, });
      if (!studentProfile) throw new BadRequestException('Student profile not found. Cannot apply.');
      const internship = await this.prisma.internships.findUnique({ where: { id: internshipId }, });
      if (!internship) throw new BadRequestException('Internship not found.');
      throw new Error(`Failed to create application: ${error.message}`)
    }
  }

  findAll(studentId: string) {
    const application = this.prisma.applications.findMany({
      where: { student_id: studentId, },
      include: {
        internships: { include: { business: true, }, },
        students: { include: { users: true, }, }
      },
    });
    if (!application) throw new BadRequestException('Application not found')
    return application
  }

  findOne(id: string) {
    const application = this.prisma.applications.findUnique({
      where: { id },
      include: {
        internships: true,
        students: { include: { users: true, }, },
      },
    });
    if (!application) throw new BadRequestException('Application not found')
    return application;
  }

  update(id: string) {
    return this.prisma.applications.update({
      where: { id },
      data: {
        // Update fields here
      },
    });
  }

  async respondToApplication(
    applicationId: string,
    businessId: string,
    body: {
      status: 'accepted' | 'rejected';
      sendEmail?: boolean;
      emailSubject?: string;
      emailBody?: string;
    },
  ) {
    const app = await this.prisma.applications.findUnique({
      where: { id: applicationId },
      select: {
        internships: {
          select: {
            id: true,
            title: true,
            business_id: true, // ✅ esto es lo que necesitas
          },
        },
        students: {
          select: {
            id: true,
            users: true,
          },
        },
      },
    });

    if (!app || app.internships.business_id !== businessId) {
      throw new ForbiddenException('No tienes acceso a esta aplicación.');
    }

    await this.prisma.applications.update({
      where: { id: applicationId },
      data: { application_status: body.status },
    });

    // Notificación interna (la crearemos en el paso 6)
    await this.notificationService.create({
      userId: app.students.id,
      type: 'application_response',
      title: `Actualización sobre tu aplicación`,
      message: `Tu aplicación a "${app.internships.title}" ha sido revisada. Tenemos novedades para ti.`,
    });

    // Enviar correo si se desea
    if (body.sendEmail) {
      const defaultSubject = `Actualización sobre tu aplicación a ${app.internships.title}`;
      const defaultBody = `Hola ${capitalize(app.students.users.first_name)},\n\nTu aplicación a "${app.internships.title}" ha sido revisada. Tenemos novedades sobre el proceso de selección.\n\nGracias por tu interés en esta oportunidad.\n\nEl equipo de Pasantiando`;
      const htmlBody = generateApplicationEmailHTML({
        firstName: app.students.users.first_name,
        internshipTitle: app.internships.title,
        status: body.status,
      });
      await this.emailService.sendEmail(
        app.students.users.email_address,
        body.emailSubject || defaultSubject,
        body.emailBody || defaultBody,
        htmlBody
      );
    }
    return { success: true };
  }

  remove(id: string) {
    return this.prisma.applications.delete({
      where: { id },
    });
  }
}
