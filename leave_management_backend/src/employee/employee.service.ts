import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/Employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentials } from 'src/auth/entities/UserCredentials.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    // @InjectRepository(Department)
    // private readonly departmentRepository: Repository<Department>,
    @InjectRepository(UserCredentials)
    private readonly userCredentialRepository: Repository<UserCredentials>,
    private readonly authService: AuthService,
  ) {}

  //Create employee
  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    req_email: any,
  ): Promise<Employee> {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);
    console.log('Request ... ', req_email);
    // const created_by = req.user.email;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(createEmployeeDto.email)) {
      throw new Error(
        'Invalid email format. Please enter a valid email address.',
      );
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(createEmployeeDto.mobile_number)) {
      throw new Error(
        'Invalid mobile number format. Please enter a valid phone number.',
      );
    }

    const generatedPassword = this.authService.generateRandomPassword(10);
    console.log('Original Password:', generatedPassword);

    const encryptedPassword = this.authService.encrypt(generatedPassword);

    const newUserCredential = this.userCredentialRepository.create({
      email: createEmployeeDto.email,
      password: encryptedPassword,
    });

    await this.userCredentialRepository.save(newUserCredential);

    const originalPassword = this.authService.decrypt(encryptedPassword);

    console.log('Original Password:', originalPassword);

    if (createEmployeeDto.role === 'Admin') {
      newEmployee.manager_id = null;
    } else {
      newEmployee.manager_id = createEmployeeDto.manager_id;
    }

    newEmployee.created_by = req_email;
    return await this.employeeRepository.save(newEmployee);
  }

  //Update employee using id
  async updateEmployee(
    id: number,
    updatedEmployeeDetails: UpdateEmployeeDto,
    req_email: any,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }

    for (const key in updatedEmployeeDetails) {
      if (updatedEmployeeDetails[key] !== undefined) {
        employee[key] = updatedEmployeeDetails[key];
      }
    }
    employee.updated_by = req_email;
    return await this.employeeRepository.save(employee);
  }

  //Delete employee using id
  async deleteEmployee(id: number, req_email: any) {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }
    employee.deleted = true;
    employee.deleted_by = req_email;
    // return await this.employeeRepository.remove(employee);
    await this.employeeRepository.save(employee);
  }

  //Show Employe Profile
  async showProfile(id: number) {
    return this.employeeRepository.findOneBy({ id });
  }

  //Show Employee List
  async findEmployees() {
    try {
      return await this.employeeRepository.find({ where: { deleted: false } });
    } catch (error) {
      throw new HttpException(
        'Unable to find employee.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // async findEmployees(){
    //     // try
    //     // {
    //     //     return await this.employeeRepository.find()
    //     // }
    //     // catch(error){
    //     //     throw new HttpException('Unable to find employee.',HttpStatus.BAD_REQUEST)
    //     // }
    //     return await this.employeeRepository.find()
    // }
  }
}
