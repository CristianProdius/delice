module.exports = ({ env }) => ({
email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        secure: false,
        requireTLS: true,
        connectionTimeout: 10000,
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO'),
      },
    },
  },


  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        // Production: Use custom CDN domain if available
        // Development: Fall back to r2.dev URL (not for production!)
        baseUrl: env('CDN_URL') // Prefer custom domain for production
          || env('PUBLIC_R2_DEV_URL'), // Optional fallback for dev only
        // Use rootPath for organizing uploads by project within the bucket
        rootPath: env('UPLOADS_FOLDER_PREFIX') ? `${env('UPLOADS_FOLDER_PREFIX')}/` : undefined,
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          },
          endpoint: env('AWS_ENDPOINT'), // https://[account-id].r2.cloudflarestorage.com
          region: env('AWS_REGION', 'auto'),
          forcePathStyle: env.bool('AWS_S3_FORCE_PATH_STYLE', true), // Safe default for R2
          params: {
            Bucket: env('AWS_S3_BUCKET') || env('AWS_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {
          maxFileSize: 100 * 1024 * 1024, // 100MB max file size
        },
      },
    },
  },
});
