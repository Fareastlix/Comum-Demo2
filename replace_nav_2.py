import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the current facilities dropdown block
    # We will use regex to find the entire block from <div class="nav-dropdown" id="facilities-nav-dropdown"> to its closing </div>
    pattern = r'<div class="nav-dropdown" id="facilities-nav-dropdown">.*?</div>\s*</div>'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        old_block = match.group(0)
        
        # Determine active state
        active_state = ' active' if 'class="nav-dropdown-trigger active"' in old_block else ''
        
        # The new block uses .nav-dd-item instead of .nav-dropdown-item with icons
        # I am adding inline styles to padding and gap to ensure it looks good as a single column without columns CSS
        replacement = f'''<div class="nav-dropdown" id="facilities-nav-dropdown">
                    <a href="facilities.html" class="nav-dropdown-trigger{active_state}">
                        Fasilitas <i data-lucide="chevron-down" class="nav-dropdown-chevron"></i>
                    </a>
                    <div class="nav-dropdown-menu" style="padding: 12px 16px; display: flex; flex-direction: column; gap: 6px;">
                        <a href="facilities.html" class="nav-dd-item">Locations</a>
                        <a href="facilities.html" class="nav-dd-item">Bicycle Service</a>
                        <a href="facilities.html" class="nav-dd-item">Padel Simulator</a>
                        <a href="facilities.html" class="nav-dd-item">Cafe</a>
                    </div>
                </div>'''
        
        new_content = content.replace(old_block, replacement)
        
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {file}')
