import { Test, TestingModule } from '@nestjs/testing';
import { InternshipAnalyticsService } from './internship-analytics.service';

describe('IntershipsService', () => {
    let service: InternshipAnalyticsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InternshipAnalyticsService],
        }).compile();

        service = module.get<InternshipAnalyticsService>(InternshipAnalyticsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
