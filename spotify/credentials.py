from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from the .env file

# Retrieve credentials
SPOTIFY_CLIENT_ID = os.getenv("CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv('REDIRECT_URI')