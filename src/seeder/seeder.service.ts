import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async onModuleInit() {
        await this.seedCategories();
    }

    private async seedCategories() {
        const categories = [
            {
                name: 'Safety & Emergency Services',
                subcategories: [
                    'Police assistance',
                    'Fire emergency',
                    'Ambulance',
                    'Private security',
                    'Disaster response',
                ],
            },
            {
                name: 'Infrastructure & Utility Services',
                subcategories: [
                    'Water supply & repair',
                    'Electricity connection & repair',
                    'Gas services',
                    'Sanitation & waste management',
                    'Road & transport services',
                ],
            },
            {
                name: 'Healthcare Services',
                subcategories: [
                    'Doctor appointment',
                    'Hospital services',
                    'Home nursing',
                    'Diagnostic tests',
                    'Pharmacy & medicine delivery',
                ],
            },
            {
                name: 'Education & Training Services',
                subcategories: [
                    'School & college services',
                    'Private tutoring',
                    'Online courses',
                    'Skill training',
                    'Exam preparation',
                ],
            },
            {
                name: 'Home & Public Services',
                subcategories: [
                    'Plumbing',
                    'Electrical work',
                    'Cleaning services',
                    'Internet & cable services',
                    'Maintenance services',
                ],
            },
            {
                name: 'Economic & Social Services',
                subcategories: [
                    'Social welfare programs',
                    'Unemployment support',
                    'Legal aid',
                    'Financial services',
                    'NGO support',
                ],
            },
            {
                name: 'Transportation & Mobility',
                subcategories: [
                    'Public transport booking',
                    'Ride services',
                    'Vehicle repair',
                    'Logistics & delivery',
                ],
            },
            {
                name: 'Digital & Government Services',
                subcategories: [
                    'Online applications',
                    'Certificate services',
                    'Bill payments',
                    'Complaint & support system',
                ],
            },
            {
                name: 'Business & Professional Services',
                subcategories: [
                    'IT & software services',
                    'Marketing services',
                    'Consulting',
                    'Accounting & tax services',
                ],
            },
        ];

        console.log('Seeding categories...');

        for (const catData of categories) {
            // Check if Parent exists
            let parent = await this.categoryRepository.findOne({ where: { name: catData.name } });

            if (!parent) {
                parent = this.categoryRepository.create({
                    name: catData.name,
                    description: catData.name,
                });
                parent = await this.categoryRepository.save(parent);
                console.log(`Created parent category: ${catData.name}`);
            }

            // Create Children
            for (const subName of catData.subcategories) {
                // Check if Child exists under this parent
                const childExists = await this.categoryRepository.findOne({ 
                    where: { 
                        name: subName, 
                        parent: { id: parent.id } 
                    } 
                });

                if (!childExists) {
                    const child = this.categoryRepository.create({
                        name: subName,
                        description: subName,
                        parent: parent,
                    });
                    await this.categoryRepository.save(child);
                    console.log(`Created subcategory: ${subName}`);
                }
            }
        }

        console.log('Categories seeded successfully.');
    }
}
