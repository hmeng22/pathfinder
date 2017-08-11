#!/bin/bash

echo -e "\033[0;32mDeploying gh-pages to GitHub...\033[0m"

npm run build

cp -R ./dist/* ./gh-pages

cd gh-pages

git add --all

msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

git push origin gh-pages

cd ..
