import { IsUUID, IsOptional, IsString } from "class-validator";
export class AssignStudentSkillDto {
  @IsUUID()
  skillId: string;

  @IsOptional()
  @IsString()
  proficiencyLevel?: string;
}