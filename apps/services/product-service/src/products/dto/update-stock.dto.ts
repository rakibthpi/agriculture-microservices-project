import {IsNotEmpty, IsNumber, IsString, IsIn, Min} from "class-validator";

export class UpdateStockDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(["add", "subtract", "set"])
  operation!: "add" | "subtract" | "set";
}
