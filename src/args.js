

export function parse() {
  let args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    let arg = args[i].split('=');
    switch (arg[0]) {
      case 'auth_method':
        process.env.AUTH_METHOD = arg[1];
        break;
      case 'bucket_name':
        process.env.BUCKET_NAME = arg[1];
        break;
      case 'ops':
        process.env.OPS = arg[1];
        break;
      case 'download_path':
        process.env.DOWNLOAD_PATH = arg[1];
        break;
      case 'dir':
        process.env.DIR = arg[1];
        break;
      case 'file_filter':
        process.env.FILE_FILTER = arg[1];
        break;
      case 'upload_path':
        process.env.UPLOAD_PATH = arg[1];
        break;
      case 'upload_files':
        process.env.UPLOAD_FILES = arg[1];
        break;
      default:
    }
  }

}