import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateIntershipDto } from '../dto/create-internship.dto';
import { UpdateIntershipDto } from '../dto/update-internship.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class InternshipsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,) { }

  private normalize(text: unknown): string {
    if (typeof text !== 'string') return '';
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  async create(createIntershipDto: CreateIntershipDto, businessId: string) {
    try {
      const newIntership = await this.prisma.internships.create({
        data: {
          ...createIntershipDto,
          requirements: createIntershipDto.requirements,
          business: {
            connect: {
              id: businessId,
            },
          },
        },
        include: {
          business: {
            select: {
              id: true,
              logo_url: true,
              business_name: true,
              contact_email: true,
              phone: true,
            },
          },
        },
      });
      return newIntership;
    } catch (error) {
      throw new Error(`Failed to create internship: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return this.prisma.internships.findMany({
        include: {
          business: true,
          internship_skills: {
            include: {
              skills: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to find all internships: ${error.message}`);
    }
  }

  async findOpenedStatus() {
    try {
      return this.prisma.internships.findMany({
        where: { job_status: "open" },
        include: {
          business: {
            select: {
              logo_url: true,
              industry: true,
              city: true,
              business_name: true,
              contact_email: true,
              phone: true,
            }
          }
        }
      })
    } catch (error) {
      throw new Error(`Failed to find all internships: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.internships.findUnique({
        where: { id },
        include: {
          business: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to find internship: ${error.message}`);
    }
  }

  async recommendedInternships(studentId: string) {
    try {
      const student = await this.usersService.findOne(studentId);
      const internships = await this.prisma.internships.findMany({
        where: { job_status: "open" },
        include: {
          business: true,
          internship_skills: true,
        },
      });

      const rawKeywords = [
        ...(student.students?.student_skills?.map((ski) => ski.skills.name) || []),
        ...(student.students?.student_experience?.map((exp) => exp.role_title) || []),].filter((kw): kw is string => typeof kw === "string").map(this.normalize);

      const scored = internships.map((intern) => {
        const normalizedRequirements = Array.isArray(intern.requirements) ? intern.requirements.filter((req): req is string => typeof req === "string").map(this.normalize) : [];
        const normalizedTitle = typeof intern.title === "string" ? this.normalize(intern.title) : "";
        const score = rawKeywords.reduce((acc, kw) => {
          if (normalizedRequirements.includes(kw) || normalizedTitle.includes(kw)) {
            return acc + 1;
          }
          return acc;
        }, 0);

        return { intern, score };
      });

      const recommended = scored
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ intern }) => intern)
        .slice(0, 6);

      return recommended;
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to find recommended internships: ${err.message}`
      );
    }
  }

  async update(id: string, updateIntershipDto: UpdateIntershipDto) {
    try {
      return await this.prisma.internships.update({
        where: { id },
        data: updateIntershipDto,
      });
    } catch (error) {
      throw new Error(`Failed to update internship: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const internship = await this.prisma.internships.findUnique({
        where: { id },
      });
      if (!internship) throw new Error('Internship not found');
      return await this.prisma.internships.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to remove internship: ${error.message}`);
    }
  }
}
