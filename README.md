# Cross Platform Reader

The **Cross Platform Reader** is a JavaScript library that displays e-books in the browser.

## Instalation

### Prerequisites for admin panel development

1. Ruby >= 2.x
2. Compass >= 0.12.x</li>
3. Node >= 0.10.x</li>
4. NPM >= 1.3.x</li>
5. Bower >= 1.2.8</li>

## Build process

### Install Ruby

Install with [Ruby Version Manager](https://rvm.io) - the current stable version of Ruby is 2.0.0-p195

### Install Compass

`gem install compass`

### Install Node and NPM

The npm installer can be found [here](http://nodejs.org/download/)</a>.

### Install bower

`npm install -g bower`

## Set up the CPR project

```
git clone https://git.mobcastdev.com/Website/cross-platform-reader.git
cd cross-platform-reader
npm install && bower install
```

## Build process

### Development

Run the following command to launch a development environment to test on your machine.

`grunt serve`

### Production

Run the following command to generate a production version of the reader in the dist folder.

`grunt reader`

Run the following command to generate a production version of the demo project.

`grunt demo`

Run the following command to build both the reader and the demo.

`grunt`

## Documentation
[Reader Callback Specification](https://tools.mobcastdev.com/confluence/display/CR/Reader+Callback+Specification)