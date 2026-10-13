detail
============
register_token
message

grep -Rni --exclude-dir='.next' 'decode' frontend/

find frontend/ -type f -not -path 'frontend/.next/*' -exec grep -nH 'decode' {} +