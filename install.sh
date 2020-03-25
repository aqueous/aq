#!/bin/sh
echo Installing Deno
curl -fsSL https://deno.land/x/install/install.sh | sh

echo Installing aq
deno install --allow-read -f aq https://raw.githubusercontent.com/aqueous/aq/master/aq.ts

echo "Run 'aq --help' to get started"