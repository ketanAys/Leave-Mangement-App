import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
  @ApiProperty({
    description:'name of the project'
  })
    name: string;

    @ApiProperty({
      description:'manager name of the project'
    })
    manager_id:number;

    @ApiProperty({
      description:'description of the project'
    })
    description: string;

    @ApiProperty({
      description:'start date of the project',
      example:'2024-03-01'
    })
    startDate: Date;

    @ApiProperty({
      description:'end date of the project',
      example:'2024-05-01'
    })
    endDate?: Date;

    @ApiProperty({
      description:'status of the project'
    })
    status: 'active' | 'inactive';
    // manager_name?: string; 
  }