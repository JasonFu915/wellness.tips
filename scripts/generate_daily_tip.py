import os
import random
import datetime
import dashscope
from slugify import slugify
import re
import requests
import json
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize DashScope
api_key = os.getenv('DASHSCOPE_API_KEY')
if not api_key:
    print("::error::DASHSCOPE_API_KEY environment variable is not set. Please check your GitHub Repository Secrets.")
    exit(1)

dashscope.api_key = api_key
print(f"DashScope API Key found (starts with: {api_key[:4]}***)")

# Categories for rotating topics - Expanded to 35+ categories for long-term variety
CATEGORIES = [
    # === Physical Health & Fitness ===
    "Sleep Science", "Morning Routines", "Walking & Steps", "Home Workouts",
    "Stretching & Flexibility", "Posture Correction", "Joint Health",
    "Cardiovascular Health", "Strength Training Basics", "Recovery & Rest",

    # === Nutrition & Diet ===
    "Gut Health & Probiotics", "Hydration Science", "Sugar Reduction",
    "Plant-Based Nutrition", "Healthy Snacking", "Meal Prep & Planning",
    "Superfoods & Nutrients", "Digestion Optimization", "Mindful Eating",
    "Caffeine & Energy",

    # === Mental & Emotional Well-being ===
    "Stress Management", "Mindfulness & Meditation", "Anxiety Reduction",
    "Focus & Productivity", "Digital Detox", "Emotional Resilience",
    "Gratitude Practices", "Social Connection", "Brain Health",
    "Mood Boosting Habits",

    # === Lifestyle & Environment ===
    "Eye Health & Screen Time", "Ergonomics (Work from Home)", "Circadian Rhythms",
    "Healthy Aging", "Skin Health", "Immune System Support",
    "Cold/Heat Therapy", "Breathing Techniques", "Nature Therapy",
    "Family Health Habits"
]

LANGUAGES = ['en', 'zh', 'es', 'fr', 'de']

def get_existing_slugs():
    """
    Scan content/en directory to find all existing article slugs.
    """
    existing_slugs = []
    content_dir = os.path.join('content', 'en')
    if os.path.exists(content_dir):
        for filename in os.listdir(content_dir):
            if filename.endswith('.md'):
                existing_slugs.append(filename.replace('.md', ''))
    return existing_slugs

def brainstorm_topic(category, existing_slugs):
    """
    Use AI to generate a unique, specific topic based on category,
    avoiding existing slugs.
    """
    # Take a sample of existing slugs to show the model what NOT to generate
    # We can't pass all if there are too many, but for now 50 is fine.
    sample_slugs = random.sample(existing_slugs, min(len(existing_slugs), 50))
    
    prompt = f"""
    You are a professional health editor. 
    Your task: Propose 1 UNIQUE, SPECIFIC, and SCIENTIFICALLY ACCURATE health article title about "{category}".
    
    Constraints:
    1. The title must be catchy, SEO-friendly, and include a primary keyword.
    2. It must be distinct from these existing articles: {', '.join(sample_slugs)}
    3. Focus on a specific angle (e.g., instead of "Drink Water", suggest "7 Surprising Benefits of Warm Water for Digestion").
    4. Return ONLY the English title string. No quotes, no explanations.
    """
    
    try:
        response = dashscope.Generation.call(
            model=dashscope.Generation.Models.qwen_turbo,
            messages=[{'role': 'user', 'content': prompt}],
            result_format='message'
        )
        if response.status_code == 200:
            return response.output.choices[0].message.content.strip()
        else:
            print(f"Brainstorming Error: {response.code} - {response.message}")
            return None
    except Exception as e:
        print(f"Brainstorming Exception: {e}")
        return None

def get_unsplash_image(keyword):
    """
    Fetch a relevant image from Unsplash API.
    Requires UNSPLASH_ACCESS_KEY env var.
    Fallback to empty string if failed (handled by caller).
    """
    access_key = os.environ.get('UNSPLASH_ACCESS_KEY')
    if not access_key:
        print("::warning::UNSPLASH_ACCESS_KEY not found.")
        return ""

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
                    # Return the regular size URL
                    return data['results'][0]['urls']['regular']
            else:
                print(f"API Error: {response.status_code}")
                # If error is auth related, no point trying other terms
                if response.status_code in [401, 403]:
                    break
        except Exception as e:
            print(f"Unsplash API Error: {e}")
            
    return ""

def generate_content(topic):
    prompt = f"""
    You are a health communication expert and viral content strategist. 
    Your goal is to create a health tip article about "{topic}" that gets high clicks BUT delivers high value (The "Hook + Value" strategy).

    Output Format: JSON with the following structure for 5 languages (en, zh, es, fr, de):
    {{
      "slug": "english-slug-based-on-title",
      "image_search_query": "short english keyword for unsplash (max 3 words)",
      "en": {{ "title": "...", "description": "...", "content": "Markdown content...", "tags": ["Tag1", "Tag2"] }},
      "zh": {{ "title": "...", "description": "...", "content": "Markdown content...", "tags": ["Tag1", "Tag2"] }},
      "es": {{ "title": "...", "description": "...", "content": "Markdown content...", "tags": ["Tag1", "Tag2"] }},
      "fr": {{ "title": "...", "description": "...", "content": "Markdown content...", "tags": ["Tag1", "Tag2"] }},
      "de": {{ "title": "...", "description": "...", "content": "Markdown content...", "tags": ["Tag1", "Tag2"] }}
    }}

    Requirements:
    1. **HEADLINE STRATEGY (Controlled Clickbait)**:
       - DO NOT use boring academic titles (e.g., "Benefits of Water").
       - DO use "Hook" formulas:
         - **The Question**: "Are You Sleeping Wrong?"
         - **The Mistake**: "Stop Eating Apples Like This"
         - **The Counter-Intuitive**: "Why You Should Skip Breakfast (Sometimes)"
       - **The Promise**: The content MUST strictly back up the title with science. No deception.

    2. **Tone & Style**:
       - Professional yet conversational (Healthline style).
       - Scientific but accessible.
       - Direct address ("you").
       - **Cite 2-3 specific studies** (e.g., "A 2023 Nature study...") to prove the controversial/hooky title is real.

    3. **Content Structure**:
       - **Introduction**: Hook the reader immediately.
       - **The Science**: Explain the "why" behind the hook.
       - **Actionable Steps**: 3-5 bullet points.
       - **FAQ**: 2-3 questions.
       - **Conclusion**: Empowering takeaway.

    4. **Technical**:
       - Length: 800-1200 words per language.
       - `image_search_query`: Since the title might be abstract (e.g., "Stop Doing This"), provide a CONCRETE noun for image search (e.g., "man eating apple" or "sleeping woman").
       - `description`: < 160 chars, SEO optimized.
       - Valid JSON output only.
    """
    
    try:
        response = dashscope.Generation.call(
            model=dashscope.Generation.Models.qwen_turbo,
            messages=[{'role': 'user', 'content': prompt}],
            result_format='message'
        )
        
        if response.status_code == 200:
            content = response.output.choices[0].message.content
            # Extract JSON from code block if present
            json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
            if json_match:
                return json_match.group(1)
            return content
        else:
            print(f"API Error: {response.code} - {response.message}")
            return None
    except Exception as e:
        print(f"Exception: {e}")
        return None

def save_files(json_data):
    try:
        data = json.loads(json_data)
        slug = data.get('slug')
        if not slug:
            slug = slugify(data['en']['title'])
            
        today = datetime.date.today().isoformat()
        post_id = str(uuid.uuid4())
        
        # Fetch cover image based on AI-provided query or English title
        image_query = data.get('image_search_query')
        if not image_query:
            image_query = data['en']['title']
            
        print(f"Searching Unsplash for: {image_query}")
        cover_image = get_unsplash_image(image_query)
        
        if not cover_image:
            # Fallback to a default image if API fails or no key
            print("::warning::No cover image found. Using default.")
            # We use a path that we know exists or will be handled by the buildCover fallback in frontend
            # But better to have a physical file reference if possible.
            # Since we don't know if a physical default exists, we leave it empty
            # and let the frontend's buildCover handle it, OR use the SVG path we saw in docs.
            cover_image = "/images/en/cover.svg" 

        print(f"Selected cover image: {cover_image}")
        
        for lang in LANGUAGES:
            if lang in data:
                content = data[lang]
                # Use language-specific default cover if available, or fall back to English/Generic
                current_cover = cover_image
                if cover_image == "/images/en/cover.svg" and lang != 'en':
                     current_cover = f"/images/{lang}/cover.svg"

                # Construct file content safely avoiding triple quotes
                tags_json = json.dumps(content.get('tags', ["Daily Tip", "Health"]), ensure_ascii=False)
                file_content = (
                    f"---\n"
                    f'id: "{post_id}"\n'
                    f'title: "{content["title"]}"\n'
                    f'description: "{content["description"]}"\n'
                    f'publishDate: "{today}"\n'
                    f'tags: {tags_json}\n'
                    f'lang: "{lang}"\n'
                    f'coverImage: "{current_cover}"\n'
                    f"---\n\n"
                    f"{content['content']}\n"
                )
                # Ensure directory exists
                dir_path = os.path.join('content', lang)
                os.makedirs(dir_path, exist_ok=True)
                
                file_path = os.path.join(dir_path, f"{slug}.md")
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(file_content)
                print(f"Created {file_path}")
                
    except json.JSONDecodeError:
        print("Failed to decode JSON response")
        print(json_data)

if __name__ == "__main__":
    try:
        # Generate 2 articles per run
        articles_to_generate = 2
        existing_slugs = get_existing_slugs()
        
        # Ensure we pick different categories for the 2 articles
        chosen_categories = random.sample(CATEGORIES, articles_to_generate)
        
        for i, category in enumerate(chosen_categories):
            print(f"--- Generating Article {i+1}/{articles_to_generate} [Category: {category}] ---")
            
            # Step 1: Brainstorm a unique topic
            topic = brainstorm_topic(category, existing_slugs)
            if not topic:
                print(f"::error::Failed to brainstorm topic for {category}. Skipping.")
                continue
                
            print(f"Brainstormed Topic: {topic}")
            
            # Step 2: Generate Content
            json_result = generate_content(topic)
            if json_result:
                save_files(json_result)
            else:
                print("::error::Failed to generate content (API returned None). Check logs for details.")
                # Don't exit, try the next one
                
    except Exception as e:
        print(f"Fatal Error: {e}")
        exit(1)
