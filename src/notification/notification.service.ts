import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  findAll() {
    // Return all notifications
    return [];
  }

  findOne(id: number) {
    // Return a single notification
    return { id };
  }

  create(dto: any) {
    // Create a new notification
    return { ...dto, id: Date.now() };
  }

  update(id: number, dto: any) {
    // Update notification
    return { id, ...dto };
  }

  remove(id: number) {
    // Delete notification
    return { deleted: true, id };
  }
}
