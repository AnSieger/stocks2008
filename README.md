Simple javascript application to get all historical NASDAQ stock prices from [Alpha Vantage](https://www.alphavantage.co/)

## Using
```shell
sudo apt-get update && sudo apt-get install nodejs python3 -y
cd stocks2008
```

delete all `***.json` stocks in the folder /stock you dont want to compare. Run:
```shell
node datapreparer.js
sudo python3 -m http.server 80
```
After this you can view the line chart in your browser: http://0.0.0.0:80/