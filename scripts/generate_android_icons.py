from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/CVAfrik')
source = Image.open(root / 'public/brand/cvafrik-official-mark.png').convert('RGBA')
alpha = source.getchannel('A')
bbox = alpha.getbbox()
if not bbox:
    raise RuntimeError('Le logo source ne contient pas de pixels opaques.')
logo = source.crop(bbox)

sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}
res = root / 'android/app/src/main/res'

for folder, size in sizes.items():
    # Laisser une marge de sécurité afin que le logo reste entier sur les lanceurs Android.
    inner = round(size * 0.60)
    ratio = min(inner / logo.width, inner / logo.height)
    rendered = logo.resize((round(logo.width * ratio), round(logo.height * ratio)), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    x = (size - rendered.width) // 2
    y = (size - rendered.height) // 2
    canvas.alpha_composite(rendered, (x, y))
    folder_path = res / folder
    folder_path.mkdir(parents=True, exist_ok=True)
    for name in ('ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png'):
        canvas.save(folder_path / name, 'PNG', optimize=True)

print('Icônes Android CVAfrik générées dans', res)
