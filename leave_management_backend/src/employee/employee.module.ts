import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/Employee.entity';
import { Department } from './entities/Department.entity';
// import { UserCredentials } from '../auth/entities/UserCredentials.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Employee,Department])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
