import { IsArray, IsNumber } from 'class-validator';

export class DeleteImagesDto {
  @IsArray()
  @IsNumber({}, { each: true })
  imageIds: number[];
}