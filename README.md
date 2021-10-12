### chain-action/httpserver4encoded-notifications
__test http server for viewing encoded notifications__

- Install
```shell
npm install
```
- Edit the parameters `pub` and `sec` received from the debot in the file `index.js`

- Run (Do not close, as you will see the logs in this window.)
```shell
npm start
```

### Test Request
```shell
curl -X POST "http://127.0.0.1:8181/request" -H 'Content-Type: application/x-www-form-urlencoded' --data-raw "param=str1 str2 str3" 
```

The decryption code is taken from `https://tonlabs.notion.site/Notification-provider-onboarding-3dd961bce8954d0da80208b9a908c773`