import { PartialType } from '@nestjs/mapped-types';
import { CreateIntershipDto } from './create-internship.dto';

export class UpdateIntershipDto extends PartialType(CreateIntershipDto) { }
