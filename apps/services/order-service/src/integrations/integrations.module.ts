import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderIntegrationsService } from './order-integrations.service';

@Module({
  imports: [HttpModule],
  providers: [OrderIntegrationsService],
  exports: [OrderIntegrationsService],
})
export class IntegrationsModule {}
