import os
import re

def check_animated_imports(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        for file in files:
            if file.endswith('.js'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    has_animated = 'Animated.' in content or '<Animated' in content
                    has_import = 'Animated' in content and 'react-native' in content
                    if has_animated and not has_import:
                        print(f"MISSING IMPORT: {path}")
                    elif 'fadeAnims' in content:
                        print(f"FADEANIMS DETECTED: {path}")

check_animated_imports('src')
