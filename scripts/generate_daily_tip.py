import os
import random
import datetime
import dashscope
from slugify import slugify
import re

# Initialize DashScope
dashscope.api_key = os.getenv('DASHSCOPE_API_KEY')

if not dashscope.api_key:
    print("Error: DASHSCOPE_API_KEY environment variable is not set.")
    exit(1)

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
    You are a professional health writer. Create a short daily health tip article about "{topic}".
    
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
    1. Content should be encouraging, scientific but easy to understand.
    2. Length: about 300-500 words per language.
    3. Use Markdown formatting (headings, bullet points).
    4. Ensure the slug is URL-friendly and in English.
    5. JSON must be valid.
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
    topic = random.choice(TOPICS)
    print(f"Generating content for topic: {topic}")
    json_result = generate_content(topic)
    if json_result:
        save_files(json_result)
