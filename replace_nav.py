import os
import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    active_state = ' class="active"' if '<a href="facilities.html" class="active">Fasilitas</a>' in content else ''

    target = f'<a href="facilities.html"{active_state}>Fasilitas</a>'
    
    replacement = f'''<div class="nav-dropdown" id="facilities-nav-dropdown">
                    <a href="facilities.html" class="nav-dropdown-trigger{active_state}">
                        Fasilitas <i data-lucide="chevron-down" class="nav-dropdown-chevron"></i>
                    </a>
                    <div class="nav-dropdown-menu">
                        <a href="facilities.html" class="nav-dropdown-item">
                            <div class="nav-dropdown-icon"><i data-lucide="map-pin"></i></div>
                            <div class="nav-dropdown-label">
                                <strong>Locations</strong>
                                <small>Temukan hub terdekat</small>
                            </div>
                        </a>
                        <a href="facilities.html" class="nav-dropdown-item">
                            <div class="nav-dropdown-icon"><i data-lucide="wrench"></i></div>
                            <div class="nav-dropdown-label">
                                <strong>Bicycle Service</strong>
                                <small>Tune-up &amp; overhaul</small>
                            </div>
                        </a>
                        <a href="facilities.html" class="nav-dropdown-item">
                            <div class="nav-dropdown-icon"><i data-lucide="activity"></i></div>
                            <div class="nav-dropdown-label">
                                <strong>Padel Simulator</strong>
                                <small>Latihan dengan teknologi</small>
                            </div>
                        </a>
                        <a href="facilities.html" class="nav-dropdown-item">
                            <div class="nav-dropdown-icon"><i data-lucide="coffee"></i></div>
                            <div class="nav-dropdown-label">
                                <strong>Cafe</strong>
                                <small>Coffee &amp; Hangout</small>
                            </div>
                        </a>
                    </div>
                </div>'''

    if target in content:
        content = content.replace(target, replacement)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
