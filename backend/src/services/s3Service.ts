import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler';

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();

// S3 bucket configuration
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'ecommerce-app-avatars';
const AVATAR_FOLDER = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Generate unique file key
const generateFileKey = (originalName: string, userId: string): string => {
    const fileExtension = originalName.split('.').pop();
    const uniqueId = uuidv4();
    return `${AVATAR_FOLDER}/${userId}/${uniqueId}.${fileExtension}`;
};

// Validate file type and size
const validateFile = (file: Express.Multer.File): void => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new AppError('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new AppError('File size too large. Maximum size is 5MB.', 400);
    }
};

// Upload file to S3
export const uploadFileToS3 = async (file: Express.Multer.File, userId: string): Promise<string> => {
    try {
        validateFile(file);

        const fileKey = generateFileKey(file.originalname, userId);

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read', // Make the file publicly readable
            Metadata: {
                userId: userId,
                originalName: file.originalname,
                uploadedAt: new Date().toISOString(),
            },
        };

        const result = await s3.upload(uploadParams).promise();
        return result.Location;
    } catch (error: any) {
        console.error('S3 upload error:', error);
        throw new AppError('Failed to upload file to S3', 500);
    }
};

// Generate presigned URL for direct upload
export const generatePresignedUploadUrl = async (
    fileName: string,
    fileType: string,
    userId: string
): Promise<{ uploadUrl: string; key: string; expiresIn: number }> => {
    try {
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
            throw new AppError('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.', 400);
        }

        const fileKey = generateFileKey(fileName, userId);
        const expiresIn = 300; // 5 minutes

        const presignedUrl = s3.getSignedUrl('putObject', {
            Bucket: BUCKET_NAME,
            Key: fileKey,
            ContentType: fileType,
            ACL: 'public-read',
            Expires: expiresIn,
            Metadata: {
                userId: userId,
                originalName: fileName,
                uploadedAt: new Date().toISOString(),
            },
        });

        return {
            uploadUrl: presignedUrl,
            key: fileKey,
            expiresIn,
        };
    } catch (error: any) {
        console.error('S3 presigned URL generation error:', error);
        throw new AppError('Failed to generate upload URL', 500);
    }
};

// Confirm file upload and get public URL
export const confirmFileUpload = async (key: string): Promise<string> => {
    try {
        // Check if file exists in S3
        const headParams = {
            Bucket: BUCKET_NAME,
            Key: key,
        };

        await s3.headObject(headParams).promise();

        // Return the public URL
        return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    } catch (error: any) {
        if (error.statusCode === 404) {
            throw new AppError('File not found in S3', 404);
        }
        console.error('S3 file confirmation error:', error);
        throw new AppError('Failed to confirm file upload', 500);
    }
};

// Generate signed URL for private file access
export const generateSignedUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
    try {
        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: BUCKET_NAME,
            Key: key,
            Expires: expiresIn,
        });

        return signedUrl;
    } catch (error: any) {
        console.error('S3 signed URL generation error:', error);
        throw new AppError('Failed to generate signed URL', 500);
    }
};

// Delete file from S3
export const deleteFileFromS3 = async (key: string): Promise<void> => {
    try {
        const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: key,
        };

        await s3.deleteObject(deleteParams).promise();
    } catch (error: any) {
        console.error('S3 file deletion error:', error);
        throw new AppError('Failed to delete file from S3', 500);
    }
};

// Extract S3 key from URL
export const extractS3KeyFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');

        // Remove empty first element and bucket name
        const keyParts = pathParts.slice(2);
        return keyParts.join('/');
    } catch (error) {
        console.error('Error extracting S3 key from URL:', error);
        return null;
    }
};

// Check if URL is from our S3 bucket
export const isS3Url = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.includes(BUCKET_NAME) || urlObj.hostname.includes('s3.amazonaws.com');
    } catch (error) {
        return false;
    }
};

// Get file metadata from S3
export const getFileMetadata = async (key: string): Promise<any> => {
    try {
        const headParams = {
            Bucket: BUCKET_NAME,
            Key: key,
        };

        const result = await s3.headObject(headParams).promise();
        return {
            size: result.ContentLength,
            lastModified: result.LastModified,
            contentType: result.ContentType,
            metadata: result.Metadata,
        };
    } catch (error: any) {
        if (error.statusCode === 404) {
            throw new AppError('File not found', 404);
        }
        console.error('S3 metadata retrieval error:', error);
        throw new AppError('Failed to get file metadata', 500);
    }
};

export default {
    uploadFileToS3,
    generatePresignedUploadUrl,
    confirmFileUpload,
    generateSignedUrl,
    deleteFileFromS3,
    extractS3KeyFromUrl,
    isS3Url,
    getFileMetadata,
};
