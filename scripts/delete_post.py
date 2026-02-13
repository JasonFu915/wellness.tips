import os
import shutil
import argparse

LANGUAGES = ['en', 'zh', 'es', 'fr', 'de']
CONTENT_BASE = 'content'

def delete_post(slug):
    """
    Deletes a post by slug across all languages.
    """
    print(f"Starting deletion for slug: {slug}")
    deleted_count = 0
    
    for lang in LANGUAGES:
        file_path = os.path.join(CONTENT_BASE, lang, f"{slug}.md")
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"Deleted: {file_path}")
                deleted_count += 1
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")
        else:
            print(f"Not found: {file_path}")
            
    # Check for legacy image folder (if any)
    # Modern implementation uses Unsplash URLs, but check just in case
    legacy_image_path = os.path.join('public', 'images', slug)
    if os.path.exists(legacy_image_path):
        try:
            shutil.rmtree(legacy_image_path)
            print(f"Deleted legacy images: {legacy_image_path}")
        except Exception as e:
            print(f"Error deleting images {legacy_image_path}: {e}")

    if deleted_count > 0:
        print(f"Successfully deleted {deleted_count} files for '{slug}'.")
    else:
        print(f"No files found for slug '{slug}'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Delete a post across all languages.")
    parser.add_argument("slug", help="The slug of the article to delete (filename without .md)")
    args = parser.parse_args()
    
    delete_post(args.slug)
