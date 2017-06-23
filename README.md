# tripwire
The MSc project

## Installation & Deployment

Check this [article](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04
) before you start.

Dependencies:

- git `sudo apt-get install git`
- node & npm
- webpack 
- nginx: `sudo apt-get install nginx`
- pm2 (optional) `npm install -g pm2`
- nodemon (optional) `npm install -g nodemon`
- emacs (optional) `sudo apt-get install emacs-nox`

node & npm
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

webpack
```
npm install --save-dev webpack
npm install webpack-dev-server --save
```

### Installation

- `git clone https://github.com/bigzhe/tripwire.git`
- `npm install`
- `webpack`

Since the npm library react-d3-graph is customised, you need install it manully. Change directory to `node_modules/react-d3-graph` and execute `npm install`.

Then, the installation is completed.

### Deployment

Install the nginx and change its configuration by `sudo emacs /etc/nginx/sites-available/default`

```
server {
    listen 3000;

    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then, customise the configuration files in the app. They are:

- `src/config`
- `server/config`
