export class CreateEmployeeDto {
    e_id : number;
    name : string;
    email : string;
    mobile_number : string;
    created_at : Date;
    updated_at : Date;
    manager_id : number;
    department_id : number;
    role : string;
}