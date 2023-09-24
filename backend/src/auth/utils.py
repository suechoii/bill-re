import string, random

def generate_verification_code(len=6):
    return ''.join(
        random.choice(string.digits) for _ in range(len)
    )

def read_html_content_and_replace(
    replacements: dict[str, str],
    html_path: str 
):
    f = open(html_path)
    content = f.read()
    for target, val in replacements.items():
        content = content.replace(target, val)
    f.close()
 
    return content