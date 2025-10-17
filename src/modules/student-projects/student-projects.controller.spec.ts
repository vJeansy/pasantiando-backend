import { Test, TestingModule } from '@nestjs/testing';
import { StudentProjectsController } from './student-projects.controller';
import { StudentProjectsService } from './student-projects.service';

describe('StudentProjectsController', () => {
  let controller: StudentProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentProjectsController],
      providers: [StudentProjectsService],
    }).compile();

    controller = module.get<StudentProjectsController>(StudentProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
