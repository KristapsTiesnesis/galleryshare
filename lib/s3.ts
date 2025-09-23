import AWS from 'aws-sdk'

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
})

export const uploadToS3 = async (
  file: Buffer,
  fileName: string,
  contentType: string,
  bucketName: string = process.env.AWS_S3_BUCKET || 'gallery-share-uploads'
): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: `uploads/${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Make files publicly accessible
  }

  try {
    const result = await s3.upload(params).promise()
    return result.Location
  } catch (error) {
    console.error('S3 upload error:', error)
    throw new Error('Failed to upload file to S3')
  }
}

export const deleteFromS3 = async (
  fileUrl: string,
  bucketName: string = process.env.AWS_S3_BUCKET || 'gallery-share-uploads'
): Promise<void> => {
  try {
    // Extract key from URL
    const url = new URL(fileUrl)
    const key = url.pathname.substring(1) // Remove leading slash
    
    const params = {
      Bucket: bucketName,
      Key: key,
    }

    await s3.deleteObject(params).promise()
  } catch (error) {
    console.error('S3 delete error:', error)
    throw new Error('Failed to delete file from S3')
  }
}

export default s3
