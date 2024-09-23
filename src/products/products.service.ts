import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}


  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto);
      //Creamos el producto
      await this.productRepository.save( product );
      //Guardamos el producto
      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // todo: paginar
  findAll( paginationDTO: PaginationDto) {
    try {
         
      const {limit= 10 , offset = 0 } = paginationDTO;
      return this.productRepository.find({
        take: limit,
        skip: offset,
      })  
    } catch (error) {
      this.handleDBExceptions(error);
    } 
  }

  async findOne( term: string ) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder(); 
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
    }


    if ( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

 async remove(id: string) {  
     
      const {affected} =  await this.productRepository.delete({id:id});
      
      if(affected === 0){
        throw new BadRequestException(`The id ${id} not existe`)
      }
      return `The id ${id} is delete`;
      
    }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
