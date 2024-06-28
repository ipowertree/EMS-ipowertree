import { google } from 'googleapis';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs/promises';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = './credentials.json'; // Adjust path as per your project structure

const __dirname = path.resolve();

async function authorize() {
  const credentialsRaw = await fs.readFile(path.resolve(__dirname, CREDENTIALS_PATH));
  const credentials = JSON.parse(credentialsRaw);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = await fs.readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (error) {
    return getAccessToken(oAuth2Client);
  }
}

async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
}

async function uploadFileToDrive(file) {
  try {
    if (!file || !file.buffer) {
      throw new Error('Invalid file buffer');
    }

    const auth = await authorize();
    const drive = google.drive({ version: 'v3', auth });

    // Generate a unique filename (you can adjust this logic as needed)
    const uniqueFileName = `${file.originalname}-${Date.now()}`;
    
    const fileMetadata = {
      name: uniqueFileName,
      parents: ['1WWIwRV9RqwOoBBYTveTvZHm1TuJz8WmA'], // Replace with the ID of the folder where you want to upload the file
    };

    // Create a readable stream from file buffer
    const readableFile = Readable.from([file.buffer]);

    const media = {
      mimeType: file.mimetype,
      body: readableFile,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;
    const webViewLink = response.data.webViewLink;

    // Optionally, set permissions for the file
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return webViewLink;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Error uploading files to Google Drive');
  }
}

export { uploadFileToDrive, authorize };
