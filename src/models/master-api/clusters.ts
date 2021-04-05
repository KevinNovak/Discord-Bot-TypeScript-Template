import { Type } from 'class-transformer';
import {
    IsDefined,
    IsInt,
    IsPositive,
    IsString,
    IsUrl,
    MinLength,
    ValidateNested,
} from 'class-validator';

export class Callback {
    @IsDefined()
    @IsUrl()
    url: string;

    @IsDefined()
    @IsString()
    @MinLength(5)
    token: string;
}

export class RegisterClusterRequest {
    @IsDefined()
    @IsInt()
    @IsPositive()
    shardCount: number;

    @IsDefined()
    @ValidateNested()
    @Type(() => Callback)
    callback: Callback;
}

export interface RegisterClusterResponse {
    id: string;
}

export interface LoginClusterResponse {
    shardList: number[];
    totalShards: number;
}
