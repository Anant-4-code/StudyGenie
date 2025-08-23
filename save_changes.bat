@echo off
echo Initializing Git repository...
git init
git add .
git commit -m "Fix linting issues and update dependencies"
git push -u origin main
echo Changes have been committed and pushed to the repository.
