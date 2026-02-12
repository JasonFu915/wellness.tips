import os
import re
import requests
import time

# Configuration
CONTENT_DIR = "content"
LANGUAGES = ['en', 'zh', 'es', 'fr', 'de']

def get_unsplash_image(keyword):
    """
    Fetch a relevant image from Unsplash API.
    Requires UNSPLASH_ACCESS_KEY env var.
    """
    access_key = os.environ.get('UNSPLASH_ACCESS_KEY')
    if not access_key:
        print("::error::UNSPLASH_ACCESS_KEY not found. Please set it to run this migration.")
        return None

    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": keyword,
        "per_page": 1,
        "orientation": "landscape",
        "client_id": access_key
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                return data['results'][0]['urls']['regular']
        else:
            print(f"API Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Unsplash API Exception: {e}")
    
    return None

def update_file(file_path, image_url):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if coverImage already exists
    if 'coverImage:' in content:
        print(f"Skipping {file_path} (already has coverImage)")
        return

    # Add coverImage to frontmatter
    # Pattern: Look for the end of the frontmatter block (second ---)
    pattern = r'(^---\s*\n)([\s\S]*?)(\n---)'
    
    def replacement(match):
        frontmatter = match.group(2)
        if not frontmatter.endswith('\n'):
            frontmatter += '\n'
        return f"{match.group(1)}{frontmatter}coverImage: \"{image_url}\"{match.group(3)}"
    
    new_content = re.sub(pattern, replacement, content, count=1)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

def main():
    # Only iterate through English files to get the "source of truth" keywords
    # Then apply the SAME image to all language versions of the same article
    en_dir = os.path.join(CONTENT_DIR, 'en')
    if not os.path.exists(en_dir):
        print(f"Directory not found: {en_dir}")
        return

    files = [f for f in os.listdir(en_dir) if f.endswith('.md')]
    
    print(f"Found {len(files)} articles to process...")

    for filename in files:
        slug = filename.replace('.md', '')
        
        # 1. Read the English file to extract title/keywords
        en_path = os.path.join(en_dir, filename)
        with open(en_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract title using regex
            title_match = re.search(r'title:\s*"(.*?)"', content)
            title = title_match.group(1) if title_match else slug.replace('-', ' ')
        
        print(f"Processing: {slug} (Query: {title})")
        
        # 2. Fetch Image
        image_url = get_unsplash_image(title)
        
        if not image_url:
            print(f"Failed to get image for {slug}, skipping...")
            continue
            
        # 3. Update ALL language versions
        for lang in LANGUAGES:
            lang_path = os.path.join(CONTENT_DIR, lang, filename)
            if os.path.exists(lang_path):
                update_file(lang_path, image_url)
        
        # Sleep to respect API rate limits (50 requests/hour for free tier demo, but usually 5000 for registered apps)
        # Assuming user has a valid key, but let's be safe.
        time.sleep(0.5)

if __name__ == "__main__":
    main()
