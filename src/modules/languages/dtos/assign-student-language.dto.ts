import { language_proficiency_level } from "@prisma/client";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class AssignStudentLanguageDto {
  @IsUUID()
  languageId: string;

  @IsOptional()
  @IsString()
  proficiencyLevel?: string;
}