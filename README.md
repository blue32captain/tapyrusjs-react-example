# tapyrusjs-react-example
Sample React Native Application for tapyrusjs-wallet

## Getting Started
1. Download source

```
git clone https://github.com/chaintope/tapyrusjs-react-example
cd tapyrusjs-react-example
```

2. Start tapyrus node and esplora

```
docker compose up -d
```

Then, generates first block to start to sync esplora to tapyrusd.

```
docker-compose exec tapyrus tapyrus-cli -conf=/etc/tapyrus/tapyrus.conf generatetoaddress 1 \
  $(docker-compose exec tapyrus tapyrus-cli -conf=/etc/tapyrus/tapyrus.conf getnewaddress) \
  cUJN5RVzYWFoeY8rUztd47jzXCu1p57Ay8V7pqCzsBD3PEXN7Dd4
```

3. Build application

```
npm install
expo start
```

4. Run Electrs HTTP server

```
git clone https://github.com/Yamaguchi/elect_http
cd elect_http
./bin/rails s
```

5. Access browser console

```
open http://localhost:19003/
```

6. Create Key(Address) on Expo Application

7. Generate block (and send TPC to address)

```
docker-compose exec tapyrus tapyrus-cli -conf=/etc/tapyrus/tapyrus.conf generatetoaddress 1 <address> cUJN5RVzYWFoeY8rUztd47jzXCu1p57Ay8V7pqCzsBD3PEXN7Dd4
```

8. Sync Utxos on Expo Application
