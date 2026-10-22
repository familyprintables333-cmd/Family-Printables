import zipfile
import os
import sys

def build_zip():
    exclude_dirs = {'node_modules', '.git', '.aistudio', '__pycache__', '.next', 'dist', 'public/uploads'}
    target_zip = 'family-printables-production.zip'
    
    # Remove any existing zip files before building
    if os.path.exists(target_zip):
        os.remove(target_zip)
    public_copy = os.path.join('public', 'family-printables-production.zip')
    if os.path.exists(public_copy):
        os.remove(public_copy)

    print("Building pristine production ZIP archive...")
    
    with zipfile.ZipFile(target_zip, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for root, dirs, files in os.walk('.'):
            # Exclude unwanted directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            for file in files:
                if file.endswith('.zip') or file.startswith('.') or file == 'database.json':
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, '.')
                # Normalize path separators for cross-platform compatibility
                norm_rel_path = rel_path.replace(os.path.sep, '/')
                zipf.write(file_path, norm_rel_path)

    size_mb = os.path.getsize(target_zip) / (1024 * 1024)
    print(f"ZIP Archive successfully created: {target_zip} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    build_zip()
