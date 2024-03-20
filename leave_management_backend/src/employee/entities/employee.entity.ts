import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Department } from './Department.entity';
import { LeaveRequest } from '../../leave_types_and_requests/entities/LeaveRequest.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  e_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  mobile_number: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP'})
  updated_at: Date;

  @Column({ nullable: false })
  manager_id: number;

  @ManyToOne(() => Employee, (employee) => employee.directReports)
  @JoinColumn({ name: 'manager_id' })
  manager: Employee | null;

  @Column({ nullable: false })
  department_id: number;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  // @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  // @JoinColumn({ name: 'emp_id' })
  // leaveRequests: LeaveRequest[];
  

  @Column({
    type: 'enum',
    enum: ['Employee', 'Manager', 'Admin'],
  })
  role: string;

  directReports: Employee[];
}