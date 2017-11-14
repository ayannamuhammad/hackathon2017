#!/bin/bash

# Chris Joakim, Microsoft, 2017/11/10

# File env.sh is in the .gitignore, and is not stored in source control.
# It is "sourced" here to load the necessary environment variables.
source ./env.sh

echo 'POSTing to '$AZURE_FUNCTION_POST_URL

echo ''
curl -d 'a,b,c' -H "Content-Type: text/plain" $AZURE_FUNCTION_POST_URL
