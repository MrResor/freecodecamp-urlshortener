git checkout main

sudo docker compose down
sudo docker rmi freecodecamp-urlshortener-api freecodecamp-urlshortener-db 

git pull

sudo docker compose up -d

sleep 2

response=$(curl --silent https://urlshortener.profresor.net/api/hello)

if [ "$response" == '{"greeting":"hello API"}' ]; then
    echo "SUCCESS: API is working!"
else
    echo "ERROR: API is not working!"
fi