import {IsString, IsArray, IsNumber, IsOptional, IsUUID, ValidateNested, Min} from "class-validator";
import {Type} from "class-transformer";

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  productImage?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class ShippingAddressDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsString()
  postalCode: string;

  @IsOptional()
  @IsString()
  country?: string;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsOptional()
  @IsString()
  notes?: string;
}
