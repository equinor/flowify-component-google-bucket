
import { gcpListBlobs, gcpDownloadBlobs, gcpUploadBlobs } from './gcp.js'
import { Storage } from "@google-cloud/storage";
import { parse } from './args.js'
import { writeFileSync} from 'fs'
import * as log from './log.js'

async function main() {
    parse();
    const authMethod = process.env.AUTH_METHOD;
    log.info(`Authenticating using ${authMethod}`)
    let bucket;

    switch (authMethod) {
        case 'app':
            const fileName = '/tmp/credentials/key.json'
            writeFileSync(fileName,process.env.GOOGLE_APPLICATION_CREDENTIALS)
            const gcpClient = new Storage({keyFilename: fileName});
            bucket = gcpClient.bucket(process.env.BUCKET_NAME)
            break;
        default:
            throw new Error(`Invalid authentication method ${authMethod}`);
    }

    const operation = process.env.OPS;

    log.info(`${operation} files`)
    switch (operation) {
        case 'download':
            log.info('listing file to download');
            const dirFilter = process.env.DIR ? process.env.DIR : null;
            const fileFilter = process.env.FILE_FILTER ? process.env.FILE_FILTER : null;
            const filesToDownload = await gcpListBlobs(bucket, fileFilter, dirFilter);

            log.info(`Start downloading ${filesToDownload.length} files`);
            await gcpDownloadBlobs(bucket, filesToDownload, process.env.DOWNLOAD_PATH);
            break;
        case 'upload':
            const uploadPath = process.env.UPLOAD_PATH ? process.env.UPLOAD_PATH : null;
            await gcpUploadBlobs(bucket, process.env.UPLOAD_FILES, uploadPath)
            break;
        default:
            throw new Error(`Invalid operation ${operation}`);
    }
}

await main()










