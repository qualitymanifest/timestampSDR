##!/bin/sh

FILES="config.js"

if [ "`git diff-index --cached HEAD | grep \"$FILES\"`" ]; then

  exec < /dev/tty

  echo "\nYou are attempting to commit changes to config.js. If you are sure, try again with \`--no-verify\`"
  echo "\nIf not, you can quickly reset it by running \`git checkout HEAD -- config.js\`"
  echo "\nABORTING COMMIT"
  
  exit 1;

fi
