import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  async getAvailableTransfers() {
    return this.marketService.getAvailableTransfers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async registerTransfer(@Request() req, @Body() dto: CreateTransferDto) {
    return this.marketService.registerTransfer(
      req.user.id,
      dto.reservationId,
      dto.price,
      dto.description
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('claim/:transferId')
  async claimTransfer(
    @Request() req,
    @Param('transferId') transferId: string
  ) {
    return this.marketService.claimTransfer(req.user.id, transferId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('transfer/:transferId')
  async cancelTransfer(
    @Request() req,
    @Param('transferId') transferId: string
  ) {
    return this.marketService.cancelTransfer(req.user.id, transferId);
  }
}