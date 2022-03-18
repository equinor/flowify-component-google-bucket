import readdirp from 'readdirp';
import { mkdirSync ,existsSync, statSync} from 'fs'
import * as path from 'path';
import * as log from './log.js'

async function gcpListBlobs(bucket, fileFilter, dirFilter) {

    let [blobList, queryForPage2] =await bucket.getFiles();

    if (blobList.length === 0) {
        throw new Error(`Bucket ${bucket.name} has no file`);
    } else {
        if (typeof(dirFilter)==='string') {
            log.info(`Filter files under directory ${dirFilter}`);
            dirFilter = dirFilter.replace(path.win32.sep,path.posix.sep);
            dirFilter = dirFilter.endsWith(path.posix.sep) ? dirFilter.slice(0,-1) : dirFilter;
            blobList = blobList.filter(blobName => blobName.startsWith(dirFilter));
        };
        if (typeof(fileFilter)==='string') {
            log.info(`Filter files containing ${fileFilter}`)
            let dirLength = dirFilter ? dirFilter.length : 0;
            blobList = blobList.filter(blob => blob.slice(dirLength).includes(fileFilter));
        };
        log.info(`Number of files to download ${blobList.length}`);
    }
    if (blobList.length === 0) {
        throw new Error('No file to download');
    }
    return blobList;
}

async function gcpDownloadBlobs(bucket, downloadList, downloadPath) {

    downloadPath = path.normalize(downloadPath);
    const downloadPathSep = downloadPath.endsWith(path.sep) ? downloadPath : `${downloadPath}${path.sep}`;
    await Promise.all(downloadList.map(async (file) => {
        if (file.includes(path.posix.sep)){
            //create dir to keep dir structure
            let lastSep = file.lastIndexOf(path.posix.sep);
            let dir = file.slice(0,lastSep);
            dir = `${downloadPathSep}${dir}`
     
            if(!existsSync(dir)){
                mkdirSync(dir, { recursive: true });
            }            
        }
        const downloadFilePath = path.normalize(`${downloadPathSep}${file}`);
        await bucket.file(file).download({
            destination: downloadFilePath,
          });
        log.info(`Downloaded ${file} to ${downloadPathSep}`);
    }));
    return
}
async function listFiles(path, fileFilters) {
    const isFile = statSync(path).isFile();
    let filesToUpload
    if (!isFile){
        const config = fileFilters ? { type: 'files', fileFilter: fileFilters } : { type: 'files' };
        filesToUpload = await readdirp.promise(path, config);
    } else {
        filesToUpload = [path]
    }
    return filesToUpload
}

async function gcpUploadBlobs(bucket, filesPath, uploadPath) {
    const dirToUploadPosix = filesPath.replace(path.win32.sep,path.posix.sep);
    //const dirToUpload = dirToUploadPosix.endsWith(path.posix.sep) ? dirToUploadPosix.slice(0,-1) : dirToUploadPosix;
    const filesToUpload = await listFiles(dirToUploadPosix, null);
    console.log(filesToUpload.map(file => file.fullPath))
    if (filesToUpload.length === 0) {
        log.warning('No files to upload')
    } else {
        log.info(`Uploading ${filesToUpload.length} files`)
        await Promise.all(filesToUpload.map(async (file) => {
            const uploadPathPosix = uploadPath ? uploadPath.split(path.sep).join(path.posix.sep) : null;
            let fullUploadFilePath = file.path;
            if (uploadPathPosix) {
                fullUploadFilePath = uploadPathPosix.endsWith(path.posix.sep) ? `${uploadPathPosix}${fullUploadFilePath}` : `${uploadPathPosix}${path.posix.sep}${fullUploadFilePath}`;
            };
            await bucket.upload(file.fullPath, {
                destination: fullUploadFilePath,
              });
            log.info(`Uploaded ${file.basename} >>> ${fullUploadFilePath}`);
        }));
    }
    return
}


// glob(dirToUpload + '/**/*', (res)=>{console.log(res)})

// function getDirectories(src, callback) {
//     glob(src + '/**/*', callback);
//   };
//   getDirectories('test', function (err, res) {
//     if (err) {
//       console.log('Error', err);
//     } else {
//       console.log(res);
//     }
//   });

export { gcpListBlobs, gcpDownloadBlobs, gcpUploadBlobs }