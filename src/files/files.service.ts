import { BadRequestException, Injectable } from '@nestjs/common';
import { error } from 'console';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {
    
    getstaticProductImage(imageName:string){
        const path = join(__dirname, '../../static/products', imageName);

        if(!existsSync(path)){
            throw new BadRequestException(`not found product ${imageName}`)
        }
        
        return path;
    }
}
