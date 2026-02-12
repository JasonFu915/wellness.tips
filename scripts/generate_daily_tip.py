import os
import random
import datetime
import dashscope
from slugify import slugify
import re

# Initialize DashScope
api_key = os.getenv('DASHSCOPE_API_KEY')
if not api_key:
    print("::error::DASHSCOPE_API_KEY environment variable is not set. Please check your GitHub Repository Secrets.")
    exit(1)

dashscope.api_key = api_key
print(f"DashScope API Key found (starts with: {api_key[:4]}***)")

# List of topics to rotate through
TOPICS = [
    "Better Sleep Habits", "Hydration Benefits", "Mindfulness Meditation", 
    "Healthy Snacking", "Morning Stretching", "Digital Detox", 
    "Posture Correction", "Eye Health", "Stress Management", 
    "Balanced Breakfast", "Walking Benefits", "Sugar Reduction",
    "Immune System Boost", "Vitamin D Importance", "Gut Health"
]

LANGUAGES = ['en', 'zh', 'es', 'fr', 'de']

def generate_content(topic):
    prompt = f"""
    You are a health communication expert writing for a global audience. Create a practical, science-backed health tip article about "{topic}" that empowers readers to take immediate action.

    Output Format: JSON with the following structure for 5 languages (en, zh, es, fr, de):
    {{
      "slug": "english-slug-based-on-title",
      "en": {{ "title": "...", "description": "...", "content": "Markdown content..." }},
      "zh": {{ "title": "...", "description": "...", "content": "Markdown content..." }},
      "es": {{ "title": "...", "description": "...", "content": "Markdown content..." }},
      "fr": {{ "title": "...", "description": "...", "content": "Markdown content..." }},
      "de": {{ "title": "...", "description": "...", "content": "Markdown content..." }}
    }}

    Requirements:
    1. **Tone & Style**:
       - Encouraging, empathetic, and non-judgmental
       - Scientific but jargon-free (explain terms like "melatonin" or "hydration" in simple analogies)
       - Written in second person ("you") to build connection

    2. **Content Structure**:
       - Start with a relatable problem or myth (e.g., "Think you need 8 hours? Not necessarily.")
       - Include 1–2 key scientific insights from reputable sources (e.g., NIH, WHO, Mayo Clinic)
       - Provide 3–5 actionable steps (use bullet points)
       - End with an empowering takeaway ("Small changes add up!")

    3. **Length & Format**:
       - 300–500 words per language
       - Use Markdown: H2/H3 headings, bullet points, bold for key tips, blockquotes for warnings
       - Avoid fluff—every sentence should deliver value

    4. **User Value Focus**:
       - Answer: “What can the reader DO today?”
       - Address common barriers (e.g., “No time? Try this 60-second version”)
       - Include one surprising fact or counterintuitive insight

    5. **Technical Requirements**:
       - Generate a URL-friendly English slug (e.g., `sleep-better-without-pills`)
       - Output as valid JSON
       - `description`: ≤160 characters, compelling meta description for SEO
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

import json

def save_files(json_data):
    try:
        data = json.loads(json_data)
        slug = data.get('slug')
        if not slug:
            slug = slugify(data['en']['title'])
            
        today = datetime.date.today().isoformat()
        
        for lang in LANGUAGES:
            if lang in data:
                content = data[lang]
                file_content = f"""---
title: "{content['title']}"
date: "{today}"
description: "{content['description']}"
tags: ["Daily Tip", "Health"]
---

{content['content']}
"""
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
        topic = random.choice(TOPICS)
        print(f"Generating content for topic: {topic}")
        json_result = generate_content(topic)
        if json_result:
            save_files(json_result)
        else:
            print("::error::Failed to generate content (API returned None). Check logs for details.")
            exit(1)
    except Exception as e:
        print(f"::error::Unexpected script error: {str(e)}")
        exit(1)
