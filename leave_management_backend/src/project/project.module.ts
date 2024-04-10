import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project,Employee]),
    // EmployeeModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}