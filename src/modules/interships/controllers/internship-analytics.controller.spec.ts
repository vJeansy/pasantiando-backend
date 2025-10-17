import { Test, TestingModule } from '@nestjs/testing';
import { IntershipAnalyticsController } from './internship-analytics.controller';
import { InternshipAnalyticsService } from '../services/internship-analytics.service';

describe('IntershipsController', () => {
    let controller: IntershipAnalyticsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IntershipAnalyticsController],
            providers: [InternshipAnalyticsService],
        }).compile();

        controller = module.get<IntershipAnalyticsController>(IntershipAnalyticsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
