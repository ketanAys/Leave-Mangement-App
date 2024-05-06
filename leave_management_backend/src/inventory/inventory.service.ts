import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { triggerAsyncId } from 'async_hooks';
// import { CreateInvetoryCategoryDto } from './dto/create-inventoryCategory.dto';
import { CreateInvetoryCategoryDto } from './dto/create-inventoryCategory.dto';
import { Category } from './entities/inventoryCategory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }


  async createInventory(createInventoryDto: CreateInventoryDto, req_mail: any) {
    try {
      const newInventory = this.inventoryRepository.create(createInventoryDto);
      newInventory.created_by = req_mail;
      if (!createInventoryDto.category_id) {
        throw new Error('Category ID is required to create inventory.');
      }

      const category = await this.categoryRepository.findOne({ where: { id: createInventoryDto.category_id } });
      newInventory.category = category;

      const savedInventory = await this.inventoryRepository.save(newInventory);
      return savedInventory;
    } catch (error) {
      throw error;
    }
  }

  async updateInventory(id: number, updatedInventoryDetails: UpdateInventoryDto, req_mail: any): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOneBy({ id });

    if (!inventory) {
      throw new NotFoundException('Inventory not found.');
    }

    for (const key in updatedInventoryDetails) {
      if (updatedInventoryDetails[key] !== undefined) {
        inventory[key] = updatedInventoryDetails[key];
      }
    }

    inventory.updated_by = req_mail;

    return await this.inventoryRepository.save(inventory);
  }


  async showAllInventories() {
    return await this.inventoryRepository.find({ where: { deleted_at: IsNull(), employee: IsNull() }, relations: ['category', 'employee'] });
  }

  async ListOfInventories() {
    const inventories = await this.inventoryRepository.find({ where: { deleted_at: IsNull() }, relations: ['category', 'employee'] });
    // console.log("inventories",inventories)
    return inventories
  }

  async findOneInventory(id: number) {
    const inventory = await this.inventoryRepository.findOne({ where: { id, deleted_at: IsNull() }, relations: ['employee'] });
    // return this.employeeRepository.findOne({ where : { id }, relations: ['manager','department'] });
    if (!inventory) {
      return { message: `Inventory with ID ${id} not found`, inventory };
    }
    return inventory;
  }


  async deleteInventory(id: number, req_mail: any) {
    const inventory = await this.inventoryRepository.findOneBy({ id });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    inventory.deleted_by = req_mail;
    inventory.deleted_at = new Date()

    await this.inventoryRepository.save(inventory)

    return (`Inventory with ID ${id} deleted by ${req_mail}`);
  }

  // async findOneInventoryBySN(serial_number: string): Promise<any> | null {
  //   try {
  //     const inventory = await this.inventoryRepository.findOne({ where: { serial_number } });
  //     return inventory
  //   } catch (error) {
  //     console.log("findOneInventoryBySN Error: ", error)
  //     return null
  //   }
  // }

  // async assignInventory({ inventoryId, employeeId, categoryId }: { inventoryId: number, employeeId: number, categoryId: number }) {
  //   try {
  //     const [inventory, employee, category] = await Promise.all([
  //       this.inventoryRepository.findOne({ where: { id: inventoryId } }),
  //       this.employeeRepository.findOne({ where: { id: employeeId } }),
  //       this.categoryRepository.findOne({ where: { id: categoryId } })
  //     ]);

  //     if (!inventory) {
  //       throw new NotFoundException('Inventory not found');
  //     }

  //     if (!employee) {
  //       throw new NotFoundException('Employee not found');
  //     }

  //     if (!category) {
  //       throw new NotFoundException('Category not found');
  //     }

  //     const existingAssignment = await this.inventoryRepository.findOne({
  //       where: { id: inventoryId }, relations: ['employee', 'category'],
  //     });

  //     if (existingAssignment && existingAssignment.employee) {
  //       throw new HttpException('Inventory already assigned to another employee', HttpStatus.BAD_REQUEST);
  //     }

  //     inventory.employee = employee;
  //     inventory.category = category;
  //     const updatedInventory = await this.inventoryRepository.save(inventory);

  //     return updatedInventory;
  //   } catch (error) {
  //     throw error;
  //   }

  // }



  async getAssignedInventory(employeeId: number): Promise<Inventory[]> {
    try {
      const assignedInventory = await this.inventoryRepository.find({
        where: { employee: { id: employeeId } },
        select: ['id', 'name'],
        relations: ['employee'],
      });
      return assignedInventory;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(createCategoryDto: CreateInvetoryCategoryDto, req_mail: any) {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    newCategory.created_by = req_mail;

    return this.categoryRepository.save(newCategory);
  }


  async showAllCategory() {
    return await this.categoryRepository.find({ where: { deleted_at: IsNull() } });
  }


  async assignInventoryToEmployee(empId: number, inventoryId: number) {
    try {
      const inventory = await this.inventoryRepository.findOne({
        where: { id: inventoryId },
        relations: ['employee'], 
      });
  
      if (!inventory) {      
        throw new Error('No inventory found.');
      }
  
      const employee = await this.employeeRepository.findOne({ where: { id: empId } });
      if (!employee) {
        throw new Error('No employee found.');
      }
  
      inventory.employee = employee; 
      await this.inventoryRepository.save(inventory); 
        } catch (error) {
        console.error('Error assigning inventory to employee:', error);
        }
  }


}
