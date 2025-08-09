# Martha - Art & Poetry Display

A React-based art gallery application that displays Martha's artwork alongside complementary poetry. Designed to work beautifully on both large TV screens and mobile devices.

## Features

- Responsive design optimized for TV displays and iPhones
- Automatic slideshow with 30-second intervals
- Manual navigation with "Next" button
- Landscape and portrait artwork support
- Clean, minimalist design with bold typography

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Add your art images to `public/img/` directory (art1.jpg through art8.jpg)

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view in browser

## Deployment to AWS

### Prerequisites

- AWS CLI configured with appropriate credentials
- SAM CLI installed
- Route 53 hosted zone for seibtribe.us domain

### Deploy

1. Set the Hosted Zone ID:
```bash
export HOSTED_ZONE_ID=your-hosted-zone-id
```

2. Run the deployment script:
```bash
npm run deploy
```

This will:
- Build the React application
- Create/update AWS infrastructure (S3, CloudFront, ACM Certificate, Route 53)
- Upload files to S3
- Invalidate CloudFront cache
- Make the site available at https://itsmartha.seibtribe.us

## Adding Art

1. Place images in `public/img/` directory
2. Update `src/data/artData.js` with image paths, orientation, poetry, and author
3. Redeploy using `npm run deploy`

## Architecture

- **Frontend**: React with responsive CSS
- **Hosting**: AWS S3 (private bucket)
- **CDN**: AWS CloudFront
- **SSL**: AWS Certificate Manager
- **DNS**: Route 53
- **Infrastructure**: AWS SAM/CloudFormation

## Notes

- Images auto-advance every 30 seconds
- CloudFront caching optimized for performance
- S3 bucket is private (only accessible via CloudFront)
- DNS propagation may take up to 48 hours after initial deployment