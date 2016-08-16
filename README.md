# nodeJS post Filtering
nodejs service for filtering social app

nodeJS servise with jayson rpc 2.0 for filtering posts of anar social network app in naive bayse alghorithm

install servise: 

in node terminal cd dir of project 

run: npm install

it's be run in localhost:3000 and can be have response in any rest client with this format: 
Host: localhost:3000
Content-Type: application/json
Authorization: Basic cGF5YW06cGF5YW0=
{"jsonrpc": "2.0", "method": "post", "params": ["content goes here"], "id":1}

Authorization system is basic Auth