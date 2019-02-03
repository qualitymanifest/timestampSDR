#!/bin/bash

cp dev/pre-commit .git/hooks/
chmod +x .git/hooks/pre-commit
echo "pre-commit copied to .git/hooks directory"