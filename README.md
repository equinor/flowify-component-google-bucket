# flowify-component-azure-blob

[Flowify](https://flowify-docs.equinor.com/) componenet for downloading files from Google Bucket

Set the following environmental variables

Variables denoted with * can be set by run arguments by setting them as lowercase
## Common settings
```
# Operation: upload or download *
export OPS

# Google Application Credentials. String
export GOOGLE_APPLICATION_CREDENTIALS

# Googel bucket name *
export BUCKET_NAME
```
## Download
```
# File path to store the downloaded files *
export DOWNLOAD_PATH

# Only files under this directory in the Blob container (Optional) *
# If downloading one specific file, set it to the file path. Leave FILE_FILTER empty.
export DIR 

# Only files containing this string (Optional) *
export FILE_FILTER 
```
## Upload

```
# Path inside the Blob container to upload to *
export UPLOAD_PATH

# Local directory of the files to upload *
# If uploading one specific file, set it to the file path
export UPLOAD_FILES
```

## Log level
```
export LOG_LEVEL=4
```


