react-webpack-boilerplate
-----------------------------------------
A basic webpack boilerplate with react / anu.

## Usage
- Install:
    - npm: `npm install --force`
    
    - yarn: `yarn install --force`

* Run dev server (Chrome / IE9+):

    `npm run dev` or `npm run start`
    

* Build:
    `npm run build`
    

* Run in IE 8
    + step 1:
        `npm run build`
        
        or
        
        `npm run watch` , build automatically , need manual refresh.
    
    + step 2:
    
        another session, use with npm 'http-server'.

        install 'http-server' first : `npm install http-server -g`

        then run:

        `http-server ./dist -p 8086`

        visit `http://127.0.0.1:8086` or `http://127.0.0.1:8086/index.html` in IE8.

