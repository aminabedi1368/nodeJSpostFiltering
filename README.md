# nodeJS post Filtering
nodejs service for text filtering in social app

naive bayes based nodeJS servise with jayson rpc 2.0 for filtering posts of Anar social network app 

install servise: 

in node terminal cd dir of project 

run: npm install

it runs in localhost:3000 and responses in any rest client with a standard format as below:

Host: localhost:3000
Content-Type: application/json
Authorization: Basic cGF5YW06cGF5YW0=
{"jsonrpc": "2.0", "method": "post", "params": ["content goes here"], "id":1}

Authorization system is basic Auth

supported by

a.zamanian1991@gmail.com

amin.abedi.1368@gmail.com