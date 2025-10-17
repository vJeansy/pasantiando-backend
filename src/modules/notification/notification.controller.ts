import { Controller, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllForUser(@Req() req: any) {
    const userId = req.user.sub;
    return this.notificationService.findAllForUser(userId);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.notificationService.markAsRead(id, userId);
  }

  @Get('activity')
  @UseGuards(JwtAuthGuard)
  async getRecentActivity(@Req() req: any) {
    const userId = req.user.sub;
    const userType = req.user.user_type; // asegúrate de incluir esto en el JWT
    return this.notificationService.findRecentActivity(userId, userType);
  }
}