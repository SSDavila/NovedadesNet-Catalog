import { IsArray, IsString } from 'class-validator';

export class DeleteManyImagesDto {
  @IsArray()
  @IsString({ each: true })
  imageIds: string[];
}