import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';
import { mapColor, mapIcon } from 'src/utils/activities-section/maps';
import { formatTimeAgo } from 'src/utils/TimeFormats/FormatTimeAgo';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationGateway,
  ) { }

  // ✅ Crear notificación y emitir por WebSocket
  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notifications.create({
      data: {
        user_id: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
      },
    });

    this.gateway.sendToUser(dto.userId, notification);
    return notification;
  }

  // ✅ Listar notificaciones del usuario
  async findAllForUser(userId: string) {
    return this.prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  // ✅ Marcar como leída con validación de propiedad
  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notifications.findUnique({
      where: { id },
    });

    if (!notification || notification.user_id !== userId) {
      throw new ForbiddenException('No tienes acceso a esta notificación.');
    }

    return this.prisma.notifications.update({
      where: { id },
      data: { is_read: true },
    });
  }

  async findRecentActivity(userId: string, userType: 'student' | 'business') {
    const raw = await this.prisma.notifications.findMany({
      where: {
        user_id: userId,
        type: userType === 'student'
          ? { in: ['application_submitted', 'interview_scheduled', 'profile_viewed'] }
          : { in: ['application_received', 'profile_viewed_by_business'] },
      },
      orderBy: { created_at: 'desc' },
      take: 6,
    });

    return raw.map((n) => ({
      icon: mapIcon(n.type ?? ""),
      color: mapColor(n.type ?? ""),
      title: n.title,
      description: n.message,
      time: n.created_at ? formatTimeAgo(new Date(n.created_at)) : "Fecha desconocida",
    }));
  }
}