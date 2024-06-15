/* eslint-disable prettier/prettier */
import { v2 } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv'

dotenvConfig({ path: 'development.env' })

export const cloudinaryconfig = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        return v2.config({
            cloud_name: 'ddsxa70kt',
            api_key: '441433898633635',
            api_secret: 'kBhhfb2EXrPPs56kkzS64J4fCfg'


        })
    },
};