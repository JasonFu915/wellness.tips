import os
import re
import requests
import time
import yaml
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
        print("::warning::UNSPLASH_ACCESS_KEY not found. API calls will fail.")
        return None

    # Try different search strategies if the exact title fails
    search_terms = [keyword]
    
    # Add a simplified term (first 3 words) if title is long
    words = keyword.split()
    if len(words) > 3:
        search_terms.append(" ".join(words[:3]))
    
    # Add a very generic fallback term related to health
    search_terms.append("health wellness")

    for term in search_terms:
        # print(f"  Trying search term: {term}") # Debug
        url = "https://api.unsplash.com/search/photos"
        params = {
            "query": term,
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
                print(f"API Error: {response.status_code}")
                # If error is auth related, no point trying other terms
                if response.status_code in [401, 403]:
                    break
        except Exception as e:
            print(f"Unsplash API Exception: {e}")
            
    return None

def update_file(file_path, image_url):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract frontmatter
    match = re.match(r'^---\s*\n([\s\S]*?)\n---\s*\n', content)
    if not match:
        print(f"Skipping {file_path} (no frontmatter found)")
        return

    frontmatter_raw = match.group(1)
    try:
        frontmatter = yaml.safe_load(frontmatter_raw) or {}
    except yaml.YAMLError:
        print(f"Skipping {file_path} (invalid YAML)")
        return

    # Check if coverImage is already valid
    current_cover = frontmatter.get('coverImage')
    if current_cover and current_cover.strip() and 'cover.svg' not in current_cover:
        # It has a valid cover image
        return

    # If we are here, we need to update
    print(f"Updating empty cover for: {file_path}")
    
    # If image_url is provided (from API), use it.
    # If not, use local default.
    final_cover = image_url
    if not final_cover:
        # Determine lang from path
        lang = 'en'
        for l in LANGUAGES:
            if f"/{l}/" in file_path.replace('\\', '/'):
                lang = l
                break
        final_cover = f"/images/{lang}/cover.svg"

    # Use regex to replace or append coverImage line
    # We use regex to preserve comments and formatting of other fields if possible, 
    # rather than dumping the whole YAML back which might change ordering.
    
    if 'coverImage:' in frontmatter_raw:
        # Replace existing empty key
        # Look for coverImage: followed by optional whitespace and end of line OR empty quotes
        new_frontmatter = re.sub(
            r'^coverImage:\s*(""?|\'\'?)?\s*$', 
            f'coverImage: "{final_cover}"', 
            frontmatter_raw, 
            flags=re.MULTILINE
        )
    else:
        # Append to end
        new_frontmatter = frontmatter_raw + f'\ncoverImage: "{final_cover}"'
    
    new_content = content.replace(frontmatter_raw, new_frontmatter, 1)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"-> Saved {file_path}")

def main():
    # Only iterate through English files to get the "source of truth" keywords
    # Then apply the SAME image to all language versions of the same article
    en_dir = os.path.join(CONTENT_DIR, 'en')
    if not os.path.exists(en_dir):
        print(f"Directory not found: {en_dir}")
        return

    files = [f for f in os.listdir(en_dir) if f.endswith('.md')]
    
    print(f"Scanning {len(files)} article groups for missing covers...")

    for filename in files:
        slug = filename.replace('.md', '')
        
        # 1. Read the English file to extract title/keywords
        en_path = os.path.join(en_dir, filename)
        
        # Helper to get title without parsing everything
        title = slug.replace('-', ' ')
        try:
            with open(en_path, 'r', encoding='utf-8') as f:
                header = f.read(1000) # Read first 1000 chars
                title_match = re.search(r'title:\s*"(.*?)"', header)
                if title_match:
                    title = title_match.group(1)
        except:
            pass
        
        # 2. Check all languages for this slug
        # We only fetch the image IF we find at least one missing cover
        image_url = None 
        fetched_tried = False
        
        for lang in LANGUAGES:
            lang_path = os.path.join(CONTENT_DIR, lang, filename)
            if not os.path.exists(lang_path):
                continue
                
            # Check if needs update
            needs_update = False
            try:
                with open(lang_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    fm_match = re.match(r'^---\s*\n([\s\S]*?)\n---\s*\n', content)
                    if fm_match:
                        fm = yaml.safe_load(fm_match.group(1))
                        if not fm.get('coverImage') or \
                           not fm.get('coverImage').strip() or \
                           'cover.svg' in fm.get('coverImage', ''):
                            needs_update = True
            except:
                continue

            if needs_update:
                # Fetch image only once per slug group
                if not image_url and not fetched_tried:
                    print(f"Fetching Unsplash image for query: {title}")
                    image_url = get_unsplash_image(title)
                    fetched_tried = True
                    if image_url:
                        # Sleep only if we actually called the API
                        time.sleep(1) 
                    else:
                        print(f"-> Unsplash returned no image for: {title}")
                
                # Only update if we have a REAL new image (not fallback to svg again if we are trying to replace svg)
                # If image_url is None, update_file would default to svg, which is pointless if we are already svg.
                if image_url:
                     update_file(lang_path, image_url)
                elif 'cover.svg' not in fm.get('coverImage', ''):
                     # If it's empty (not svg), we can at least set it to svg as fallback
                     update_file(lang_path, None)

if __name__ == "__main__":
    main()
