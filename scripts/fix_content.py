import os
import re

# Directory to scan
CONTENT_DIR = r"e:\Work\Work\WebSite\健康小贴士\content"

# Mapping for renaming Chinese files to English slugs
RENAME_MAP = {
    "20-20-20护眼.md": "20-20-20-eye-rule.md",
    "久坐放松.md": "sedentary-relaxation-exercises.md",
    "养成喝水习惯.md": "daily-water-intake-habit.md",
    "均衡早餐.md": "balanced-breakfast-tips.md",
    "如何睡得更好.md": "how-to-sleep-better.md",
    "情绪复位练习.md": "emotional-reset-exercises.md",
    "提升膳食纤维.md": "increase-dietary-fiber.md",
    "早晨晒太阳.md": "morning-sunlight-benefits.md",
    "晚间数字减负.md": "evening-digital-detox.md",
    "走路习惯.md": "walking-habit-benefits.md"
}

def clean_and_rename():
    print("Starting content cleanup...")
    
    # Walk through all language directories
    for lang in os.listdir(CONTENT_DIR):
        lang_dir = os.path.join(CONTENT_DIR, lang)
        if not os.path.isdir(lang_dir):
            continue
            
        print(f"Scanning directory: {lang_dir}")
        
        for filename in os.listdir(lang_dir):
            if not filename.endswith(".md"):
                continue
                
            file_path = os.path.join(lang_dir, filename)
            
            # 1. Read content
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # 2. Remove inline gradient images
            # Pattern: ![Alt Text](/images/lang/cover.svg)
            # We look for the specific cover.svg pattern which corresponds to the gradient placeholder
            # The regex matches: ![...](/images/.../cover.svg) optionally followed by newlines
            new_content = re.sub(r'!\[.*?\]\(/images/.*?/cover\.svg\)\s*', '', content)
            
            if new_content != content:
                print(f"  [Fixed] Removed inline cover image from: {filename}")
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
            
            # 3. Rename file if in mapping (Mainly for 'zh' directory but check all)
            if filename in RENAME_MAP:
                new_filename = RENAME_MAP[filename]
                new_path = os.path.join(lang_dir, new_filename)
                
                # Check if target already exists to prevent overwrite
                if os.path.exists(new_path):
                    print(f"  [Skip Rename] Target {new_filename} already exists.")
                else:
                    try:
                        os.rename(file_path, new_path)
                        print(f"  [Renamed] {filename} -> {new_filename}")
                    except Exception as e:
                        print(f"  [Error] Failed to rename {filename}: {e}")

if __name__ == "__main__":
    clean_and_rename()
