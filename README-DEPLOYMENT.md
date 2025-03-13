# GeoBit Deployment Guide

This document provides instructions for deploying the GeoBit newsletter application to Firebase with full functionality.

## Prerequisites

Before you begin, ensure you have the following:

1. **Firebase Account**: You need a Firebase account and a project. If you don't have one, create one at [firebase.google.com](https://firebase.google.com).
2. **OpenRouter API Key**: Sign up at [OpenRouter.ai](https://openrouter.ai) to get an API key for the AI functionality.
3. **SendGrid Account** (optional): For email delivery, you can set up a SendGrid account.
4. **Node.js**: Install Node.js v16 or higher.
5. **Firebase Tools**: Install the Firebase CLI by running `npm install -g firebase-tools`.

## Setup Process

Follow these steps to deploy your GeoBit application:

### 1. Clone the Repository

```bash
git clone https://github.com/szilarddenes/geobit.git
cd geobit
```

### 2. Install Dependencies

```bash
# Install Next.js app dependencies
npm install

# Install Firebase functions dependencies
cd functions
npm install
cd ..
```

### 3. Configure Firebase

```bash
# Login to Firebase
firebase login

# Select your Firebase project
firebase use --add
```

### 4. Set Environment Variables

Set up the necessary environment variables for Firebase Functions:

```bash
# Set OpenRouter API key
firebase functions:config:set openrouter.api_key="YOUR_OPENROUTER_API_KEY"

# Set admin password
firebase functions:config:set app.admin_token="YOUR_ADMIN_PASSWORD"

# Set SendGrid API key (optional)
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"
```

### 5. Deploy with the Script

For convenience, a deployment script is provided:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will guide you through the deployment process, including setting environment variables.

## Manual Deployment

If you prefer to deploy manually:

```bash
# Build Next.js application
npm run build

# Build Firebase functions
cd functions
npm run build
cd ..

# Deploy to Firebase
firebase deploy
```

## Firestore Database Setup

The application requires several collections in Firestore:

- `adminSessions`: Stores admin session tokens
- `content`: Stores content items
- `contentCollections`: Records of content collection jobs
- `contentSources`: Sources for content scraping
- `newsletters`: Newsletter records
- `searchResults`: Results from AI searches
- `subscribers`: Newsletter subscribers
- `systemLogs`: System logs

The Firebase functions will create these collections automatically as needed.

## Post-Deployment Steps

After deployment, follow these steps:

1. **Initialize Your Database**: 
   - Log in to the admin dashboard (https://YOUR-FIREBASE-PROJECT.web.app/admin) using your admin password.
   - Go to Content Sources and add your first sources.

2. **Collect Initial Content**:
   - Use the admin dashboard to collect content from your sources.
   - Alternatively, wait for the daily scheduled task to run.

3. **Test Newsletter Generation**:
   - Generate a newsletter from the dashboard to ensure it works.

## Upgrading Firebase Resources

Depending on usage, you may need to upgrade from the free Spark plan:

1. **Firestore Database**: The free tier includes 1GB storage and 50K reads/20K writes per day. For heavier usage, upgrade to the Blaze plan.

2. **Firebase Functions**: The free tier has limitations on execution time and frequency. For production use, the Blaze plan is recommended.

3. **Firebase Hosting**: Free tier should be sufficient for most use cases (10GB storage, 360MB/day downloads).

## Troubleshooting

### Common Issues

1. **Deployment Fails**: 
   - Check Firebase CLI version (`firebase --version`)
   - Ensure you have the correct permissions for the Firebase project

2. **Functions Not Working**: 
   - Check the Firebase Functions logs in the Firebase Console
   - Verify environment variables are set correctly

3. **OpenRouter API Issues**:
   - Verify your API key in the Firebase Function configuration
   - Check API usage limits in your OpenRouter dashboard

### Getting Help

If you encounter issues, you can:

1. Check Firebase Documentation: [firebase.google.com/docs](https://firebase.google.com/docs)
2. Search for errors in the Firebase community: [firebase.google.com/community](https://firebase.google.com/community)
3. Check the Firebase Functions logs in the Firebase Console for detailed error messages.

## Managing Costs

### OpenRouter API

The OpenRouter API charges based on input and output tokens:

1. **Content Collection**: Each source scraped will use approximately:
   - 15,000 input tokens (for HTML content)
   - 1,000 output tokens (for extracted data)

2. **AI Search**: Each search will use approximately:
   - 500 input tokens (for the query)
   - 2,000 output tokens (for search results)

### Cost Optimization

To minimize costs:

1. **Limit Frequency**: Reduce scheduled collection frequency to once per day or less.

2. **Selective Collection**: Only collect from high-value sources.

3. **Model Selection**: Use cheaper models for routine tasks (Claude Instant, GPT-3.5-Turbo) and reserve more expensive models (GPT-4, Claude 3) for tasks requiring higher quality.

4. **Batch Processing**: Process content in batches to reduce API calls.

## Security Considerations

1. **Admin Access**: Protect your admin token carefully. Consider implementing more robust authentication if needed.

2. **API Keys**: Never expose API keys in client-side code. They are safely stored in Firebase Functions config.

3. **Data Validation**: All user inputs are validated before processing.

## Monitoring and Maintenance

1. **System Logs**: Check the system logs in the admin dashboard regularly to monitor for errors.

2. **Firebase Metrics**: Use Firebase Console to monitor usage, performance, and errors.

3. **Regular Updates**: Keep your dependencies updated for security and performance improvements.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)

## Support

For further assistance, please contact the GeoBit development team.

---

Happy publishing with GeoBit! 🌍📰