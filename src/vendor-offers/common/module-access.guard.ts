import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_KEY } from './module-access.decorator';
import { Repository } from 'typeorm';
import { MerchantPermission } from '../entities/merchant-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(MerchantPermission)
    private readonly permissionRepo: Repository<MerchantPermission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const module = this.reflector.get<string>(MODULE_KEY, context.getHandler());
    if (!module) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.merchantId) throw new ForbiddenException('No merchant context');
    const perm = await this.permissionRepo.findOneBy({ merchantId: user.merchantId, module, canAccess: true });
    if (!perm) throw new ForbiddenException('No access to this module');
    return true;
  }
}
