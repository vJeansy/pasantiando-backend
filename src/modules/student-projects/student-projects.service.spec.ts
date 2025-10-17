import { Test, TestingModule } from '@nestjs/testing';
import { StudentProjectsService } from './student-projects.service';

describe('StudentProjectsService', () => {
  let service: StudentProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentProjectsService],
    }).compile();

    service = module.get<StudentProjectsService>(StudentProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
