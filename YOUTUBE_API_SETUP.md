# YouTube API Setup Instructions

To enable YouTube video fetching in this application, you need to obtain a YouTube Data API v3 key and configure it in your environment variables.

## Steps to Get a YouTube API Key:

1. **Go to the Google Cloud Console**: Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)

2. **Create a New Project** (or select an existing one):
   - Click on the project dropdown at the top
   - Click "New Project"
   - Give it a name like "Islam VN Dashboard"
   - Click "Create"

3. **Enable the YouTube Data API v3**:
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and then click "Enable"

4. **Create Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API key"
   - Copy the generated API key

5. **Configure Environment Variables**:
   - Open the `.env.local` file in your project root
   - Replace `your_youtube_api_key_here` with your actual API key:
     ```
     YOUTUBE_API_KEY=AIzaSyD_your_actual_api_key_here
     ```

6. **Restrict the API Key** (Recommended for security):
   - In the Google Cloud Console, go to "APIs & Services" > "Credentials"
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:3000/*` for development)
   - Under "API restrictions", select "Restrict key" and check "YouTube Data API v3"

## Important Notes:

- The YouTube Data API has daily quotas. The free tier allows 10,000 units per day.
- Each video fetch operation consumes quota units.
- If you exceed the quota, the API will return errors until the quota resets.
- Keep your API key secure and never commit it to version control.

## Testing:

After setting up the API key, restart your development server and visit the `/videos` page to see the fetched videos from the configured channels and playlist.