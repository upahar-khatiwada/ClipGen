# ClipGen

ClipGen is an AI-powered shorts video generator that lets users create engaging short videos effortlessly. Users can choose from a variety of pre-designed templates or generate videos from scratch, making content creation faster and more intuitive.

---

## Features

### Authentication & Security
- **Session Authentication & OAuth** implemented from scratch without using any external library.
- **Email Verification** for session authentication: Users receive a verification link via email using a **SendGrid-powered mail server**, ensuring account authenticity and enhanced security.

### Technology Stack
- **Frontend & Backend**: Built with **Next.js** using **tRPC** for end-to-end type safety.
- **Caching**: Requests are cached for faster performance and reduced load.
- **Database**: **Neon** is used for consistent storage.
- **Rate Limiting**: Implemented via **Redis** to limit requests per IP address.

### Payment Integration
- **Stripe Webhooks**: Handle both **one-time payments** and **subscriptions** efficiently.

### Media Management
- **Cloudinary**: Used to store and manage generated short videos.
- **AI Video Generation**: Attempted integration with **Gemini Veo model**. Currently simulated due to paid API restrictions.

---

## Screenshots
### Login Page
<img width="1907" height="910" alt="1" src="https://github.com/user-attachments/assets/bc84cb34-d928-4bf2-95ae-d16ab010f543" />

### Signup Page
<img width="1906" height="909" alt="2" src="https://github.com/user-attachments/assets/600824f0-5d17-4851-9232-f732a3a2d7d7" />

### Dashboard Page
<img width="1894" height="908" alt="3" src="https://github.com/user-attachments/assets/54cee4eb-c056-46cc-a018-75e1b57bff52" />

### Templates Page
<img width="1887" height="909" alt="4" src="https://github.com/user-attachments/assets/487b3f12-4e67-421d-ba5c-19fb4ccea685" />

### Generating Shorts
<img width="1889" height="908" alt="8" src="https://github.com/user-attachments/assets/4ea9ec91-c86f-4801-b7d9-0b414bc0756d" />

### Short Generated
<img width="1887" height="914" alt="9" src="https://github.com/user-attachments/assets/097a8dab-0940-4b62-80e3-bb4b549267b0" />


### Upgrade Page
<img width="1896" height="910" alt="5" src="https://github.com/user-attachments/assets/913846d6-ca0c-498e-a7cf-4531d51919c0" />

### Stripe Redirect
<img width="1907" height="909" alt="7" src="https://github.com/user-attachments/assets/438d5e47-8a1c-44ec-8162-459504ab2a6a" />

### Account Page
<img width="1891" height="905" alt="6" src="https://github.com/user-attachments/assets/82bce20a-fa91-4207-97e5-658d9522da55" />
<img width="1872" height="906" alt="10" src="https://github.com/user-attachments/assets/84f065eb-76df-42da-98bc-c63e544cc68e" />

---

## Getting Started

### Prerequisites
- Bun/Node
- Redis
- Database
- Cloudinary account
- Sendgrid account
- Stripe account

### Installation
```bash
git clone https://github.com/upahar-khatiwada/ClipGen.git
cd ClipGen
bun install
```

### Environment Variables
Create a .env file with the following variables:
```
DATABASE_URL=<your_neon_database_url>
REDIS_URL=<your_redis_url>
JWT_ACCESS_SECRET=<your_jwt_secret_for_session_auth>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
SENDGRID_USER=<your_sendgrid_user>
SENDGRID_PASSWORD=<your_sendgrid_password>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI=<your_google_redirect_uri>
```

### Run the App
```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to see ClipGen in action.

---

## Future Improvements

- Full integration of Gemini Veo AI model for automated video generation.
- Enhanced analytics dashboard for monitoring usage and subscriptions.
