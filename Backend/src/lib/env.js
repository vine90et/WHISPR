import "dotenv/config";
export const ENV = {
    PORT:process.env.PORT || 3000,
    NODE_ENV:process.env.NODE_ENV,
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    RESEND_API_KEY:process.env.RESEND_API_KEY,
    EMAIL_FROM:process.env.EMAIL_FROM,
    EMAIL_FROM_NAME:process.env.EMAIL_FROM,
    CLIENT_URL:process.env.CLIENT_URL,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET
}
// PORT=3000
// NODE_ENV=development
// MONGO_URL=mongodb+srv://vine90et_db_user:YedutAuJBh33LlYp@cluster0.7awvdi1.mongodb.net/WISHPR_DB?appName=Cluster0
// JWT_SECRET=mySECRET
// RESEND_API_KEY=re_cieTAHGy_MY6fnAYRWwEcLx74pfQcQNQ1
// EMAIL_FROM="onboarding@resend.dev"
// EMAIL_FROM_NAME="WISHPR"
// CLIENT_URL="http://localhost:5173"